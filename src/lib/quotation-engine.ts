/**
 * quotation-engine.ts — Motor de calculo financiero HEI Cotizador V2
 *
 * Isomorfo (server + client): TS puro sin dependencias, se importa desde el
 * navegador para recalculo en vivo con sliders y desde las APIs para la
 * version canonica que se persiste.
 *
 * V2 sobre V1:
 *  - Cronograma CI con suma EXACTA (ultima cuota ajustada, sin residuo de redondeo).
 *  - Overrides acotados (ci_percentage, ci_installments, loan_term_years, reference_rate_ea).
 *  - Escenario de pago de contado (cash_discount_pct por proyecto).
 *  - Proyeccion de valorizacion a 5 anos (appreciation_rate_annual por proyecto).
 *  - Amortizacion anual referencial del credito.
 *  - Vigencia de la cotizacion (quote_validity_days).
 *
 * Todas las tasas en porcentaje (ej: 12.5, no 0.125).
 * Todos los valores monetarios en COP enteros.
 * El shape de PaymentPlan solo CRECE respecto a V1 (Harry y el PDF dependen de el).
 */

export interface PaymentPlanInput {
  list_price: number
  separation_value: number
  ci_percentage: number
  ci_target_date: string // ISO date
  ci_date_mode: string
  ci_dynamic_months: number
  reference_rate_ea: number
  loan_term_years: number
  max_loan_pct: number
  life_insurance_monthly: number
  fire_insurance_rate_annual: number
  // V2 (opcionales: 0/undefined = la seccion no aplica)
  cash_discount_pct?: number
  appreciation_rate_annual?: number
  quote_validity_days?: number
}

/** Ajustes que el usuario puede mover (sliders web / overrides API). Se acotan SIEMPRE. */
export interface PlanOverrides {
  ci_percentage?: number
  ci_installments?: number
  loan_term_years?: number
  reference_rate_ea?: number
}

export interface OverrideBounds {
  ci_percentage: { min: number; max: number }
  ci_installments: { min: number; max: number }
  loan_term_years: { min: number; max: number }
  reference_rate_ea: { min: number; max: number }
}

interface ScheduleRow {
  cuota: number
  descripcion: string
  fecha: string
  valor: number
}

interface AppreciationRow {
  year: number
  value: number
  value_fmt: string
}

interface AmortizationYearRow {
  year: number
  interest_paid: number
  principal_paid: number
  balance: number
}

export interface PaymentPlan {
  list_price: number
  list_price_fmt: string
  separation_value: number
  separation_value_fmt: string
  ci_percentage: number
  ci_amount: number
  ci_amount_fmt: string
  saldo_ci: number
  saldo_ci_fmt: string
  ci_installments: number
  ci_monthly: number
  ci_monthly_fmt: string
  ci_last_installment: number
  ci_last_installment_fmt: string
  ci_target_date: string
  ci_target_date_iso: string
  ci_schedule: ScheduleRow[]
  ci_schedule_total: number
  financing_amount: number
  financing_amount_fmt: string
  loan_term_years: number
  loan_term_months: number
  reference_rate_ea: number
  monthly_base_payment: number
  monthly_base_payment_fmt: string
  life_insurance_monthly: number
  fire_insurance_monthly: number
  total_monthly_with_insurance: number
  total_monthly_fmt: string
  income_required: number
  income_required_fmt: string
  calculation_date: string
  calculation_date_fmt: string
  // V2
  overrides_applied: PlanOverrides | null
  override_bounds: OverrideBounds
  cash_discount_pct: number
  cash_price: number
  cash_price_fmt: string
  cash_savings: number
  cash_savings_fmt: string
  appreciation_rate_annual: number
  appreciation_projection: AppreciationRow[]
  amortization_yearly: AmortizationYearRow[]
  valid_until_iso: string
  valid_until_fmt: string
}

function formatCOP(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-CO')
}

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** Fecha hoy + N meses, conservando dia (con clamp a fin de mes). */
function addMonths(base: Date, months: number): Date {
  let month = base.getMonth() + months
  const year = base.getFullYear() + Math.floor(month / 12)
  month = month % 12
  const day = Math.min(base.getDate(), daysInMonth(year, month + 1))
  return new Date(year, month, day)
}

function calculateMonthlyRate(rateEA: number): number {
  return Math.pow(1 + rateEA / 100, 1 / 12) - 1
}

function calculateFrenchPayment(principal: number, rateEA: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0
  const r = calculateMonthlyRate(rateEA)
  if (r === 0) return Math.round(principal / termMonths)
  return Math.round(principal * r / (1 - Math.pow(1 + r, -termMonths)))
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

/** Limites de los ajustes del usuario, derivados de la config del proyecto. */
export function getOverrideBounds(input: PaymentPlanInput): OverrideBounds {
  return {
    // La CI nunca baja del minimo exigido por el proyecto.
    ci_percentage: { min: Number(input.ci_percentage), max: 90 },
    ci_installments: { min: 1, max: 36 },
    loan_term_years: { min: 1, max: 30 },
    reference_rate_ea: { min: 6, max: 25 },
  }
}

function sanitizeOverrides(
  raw: PlanOverrides | undefined,
  bounds: OverrideBounds
): PlanOverrides | null {
  if (!raw) return null
  const out: PlanOverrides = {}
  if (Number.isFinite(raw.ci_percentage)) {
    out.ci_percentage = clamp(Number(raw.ci_percentage), bounds.ci_percentage.min, bounds.ci_percentage.max)
  }
  if (Number.isFinite(raw.ci_installments)) {
    out.ci_installments = Math.round(clamp(Number(raw.ci_installments), bounds.ci_installments.min, bounds.ci_installments.max))
  }
  if (Number.isFinite(raw.loan_term_years)) {
    out.loan_term_years = Math.round(clamp(Number(raw.loan_term_years), bounds.loan_term_years.min, bounds.loan_term_years.max))
  }
  if (Number.isFinite(raw.reference_rate_ea)) {
    out.reference_rate_ea = clamp(Number(raw.reference_rate_ea), bounds.reference_rate_ea.min, bounds.reference_rate_ea.max)
  }
  return Object.keys(out).length > 0 ? out : null
}

/** Amortizacion francesa agregada por anos (referencial; ajusta residuo de redondeo al final). */
function buildYearlyAmortization(principal: number, rateEA: number, termMonths: number): AmortizationYearRow[] {
  if (principal <= 0 || termMonths <= 0) return []
  const r = calculateMonthlyRate(rateEA)
  const payment = calculateFrenchPayment(principal, rateEA, termMonths)
  const rows: AmortizationYearRow[] = []
  let balance = principal
  let yearInterest = 0
  let yearPrincipal = 0
  for (let m = 1; m <= termMonths; m++) {
    const interest = balance * r
    let principalPart = payment - interest
    if (m === termMonths || principalPart > balance) principalPart = balance
    balance -= principalPart
    yearInterest += interest
    yearPrincipal += principalPart
    if (m % 12 === 0 || m === termMonths) {
      rows.push({
        year: Math.ceil(m / 12),
        interest_paid: Math.round(yearInterest),
        principal_paid: Math.round(yearPrincipal),
        balance: Math.round(Math.max(0, balance)),
      })
      yearInterest = 0
      yearPrincipal = 0
    }
  }
  return rows
}

export function generatePaymentPlan(
  input: PaymentPlanInput,
  now?: Date,
  overrides?: PlanOverrides
): PaymentPlan {
  // `now` inyectable para tests deterministas; en produccion default = fecha actual.
  const today = now ?? new Date()

  const bounds = getOverrideBounds(input)
  const applied = sanitizeOverrides(overrides, bounds)

  const ciPercentage = applied?.ci_percentage ?? Number(input.ci_percentage)
  const loanTermYears = applied?.loan_term_years ?? Number(input.loan_term_years)
  const rateEA = applied?.reference_rate_ea ?? Number(input.reference_rate_ea)

  // 1. Cuota inicial
  const ciAmount = Math.round(input.list_price * ciPercentage / 100)
  const saldoCi = Math.max(0, ciAmount - input.separation_value)

  // 2. Fecha meta CI y numero de cuotas
  let effectiveDate: Date
  if (input.ci_date_mode === 'dynamic') {
    effectiveDate = addMonths(today, input.ci_dynamic_months)
  } else {
    effectiveDate = new Date(input.ci_target_date + 'T12:00:00')
  }

  const monthsDiff = (effectiveDate.getFullYear() - today.getFullYear()) * 12 +
    (effectiveDate.getMonth() - today.getMonth())
  let ciInstallments = applied?.ci_installments ?? Math.max(1, monthsDiff)
  ciInstallments = Math.round(clamp(ciInstallments, bounds.ci_installments.min, bounds.ci_installments.max))
  // Si el usuario pidio mas cuotas que las que caben hasta la meta, la meta se corre.
  if (applied?.ci_installments && applied.ci_installments > Math.max(1, monthsDiff)) {
    effectiveDate = addMonths(today, ciInstallments)
  }

  // Cuotas iguales "redondas"; la ULTIMA ajusta para que la suma sea exacta.
  const ciMonthly = ciInstallments > 0 ? Math.round(saldoCi / ciInstallments) : 0
  const ciLast = ciInstallments > 0 ? saldoCi - ciMonthly * (ciInstallments - 1) : 0

  // 3. Financiacion
  let financingAmount = input.list_price - ciAmount
  const maxFinancing = Math.round(input.list_price * input.max_loan_pct / 100)
  financingAmount = Math.max(0, Math.min(financingAmount, maxFinancing))

  // 4. Credito hipotecario referencial
  const loanTermMonths = loanTermYears * 12
  const monthlyBasePayment = calculateFrenchPayment(financingAmount, rateEA, loanTermMonths)

  // Seguros (solo aplican si hay credito)
  const lifeMonthly = financingAmount > 0 ? Number(input.life_insurance_monthly) : 0
  const fireMonthly = Math.round(financingAmount * input.fire_insurance_rate_annual / 12)
  const totalMonthly = monthlyBasePayment + lifeMonthly + fireMonthly
  // Ley 546/1999: primera cuota max 30% del ingreso familiar.
  const incomeRequired = Math.round(totalMonthly / 0.30)

  // 5. Cronograma CI
  const ciSchedule: ScheduleRow[] = [{
    cuota: 0,
    descripcion: 'Separación',
    fecha: formatDate(today),
    valor: input.separation_value,
  }]
  for (let i = 1; i <= ciInstallments; i++) {
    ciSchedule.push({
      cuota: i,
      descripcion: `Cuota ${i} de ${ciInstallments}`,
      fecha: formatDate(addMonths(today, i)),
      valor: i === ciInstallments ? ciLast : ciMonthly,
    })
  }

  // 6. Escenario de contado
  const cashPct = Number(input.cash_discount_pct) || 0
  const cashPrice = cashPct > 0 ? Math.round(input.list_price * (1 - cashPct / 100)) : input.list_price
  const cashSavings = input.list_price - cashPrice

  // 7. Proyeccion de valorizacion (5 anos)
  const apprRate = Number(input.appreciation_rate_annual) || 0
  const appreciationProjection: AppreciationRow[] = apprRate > 0
    ? Array.from({ length: 5 }, (_, i) => {
        const value = Math.round(input.list_price * Math.pow(1 + apprRate / 100, i + 1))
        return { year: i + 1, value, value_fmt: formatCOP(value) }
      })
    : []

  // 8. Vigencia
  const validityDays = Number(input.quote_validity_days) || 15
  const validUntil = new Date(today.getTime() + validityDays * 86400000)

  const calcDate = today.toISOString().slice(0, 10)

  return {
    list_price: input.list_price,
    list_price_fmt: formatCOP(input.list_price),
    separation_value: input.separation_value,
    separation_value_fmt: formatCOP(input.separation_value),
    ci_percentage: ciPercentage,
    ci_amount: ciAmount,
    ci_amount_fmt: formatCOP(ciAmount),
    saldo_ci: saldoCi,
    saldo_ci_fmt: formatCOP(saldoCi),
    ci_installments: ciInstallments,
    ci_monthly: ciMonthly,
    ci_monthly_fmt: formatCOP(ciMonthly),
    ci_last_installment: ciLast,
    ci_last_installment_fmt: formatCOP(ciLast),
    ci_target_date: formatDate(effectiveDate),
    ci_target_date_iso: effectiveDate.toISOString().slice(0, 10),
    ci_schedule: ciSchedule,
    ci_schedule_total: input.separation_value + saldoCi,
    financing_amount: financingAmount,
    financing_amount_fmt: formatCOP(financingAmount),
    loan_term_years: loanTermYears,
    loan_term_months: loanTermMonths,
    reference_rate_ea: rateEA,
    monthly_base_payment: monthlyBasePayment,
    monthly_base_payment_fmt: formatCOP(monthlyBasePayment),
    life_insurance_monthly: lifeMonthly,
    fire_insurance_monthly: fireMonthly,
    total_monthly_with_insurance: totalMonthly,
    total_monthly_fmt: formatCOP(totalMonthly),
    income_required: incomeRequired,
    income_required_fmt: formatCOP(incomeRequired),
    calculation_date: calcDate,
    calculation_date_fmt: formatDate(today),
    overrides_applied: applied,
    override_bounds: bounds,
    cash_discount_pct: cashPct,
    cash_price: cashPrice,
    cash_price_fmt: formatCOP(cashPrice),
    cash_savings: cashSavings,
    cash_savings_fmt: formatCOP(cashSavings),
    appreciation_rate_annual: apprRate,
    appreciation_projection: appreciationProjection,
    amortization_yearly: buildYearlyAmortization(financingAmount, rateEA, loanTermMonths),
    valid_until_iso: validUntil.toISOString().slice(0, 10),
    valid_until_fmt: formatDate(validUntil),
  }
}
