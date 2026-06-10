/**
 * quotation-engine.ts — Motor de calculo financiero HEI Cotizador V1
 * Port directo del Python quotation_engine.py a TypeScript.
 *
 * V1: Solo plan de pagos (separacion + cuotas CI + financiacion referencial).
 * Todas las tasas en porcentaje (ej: 12.5, no 0.125).
 * Todos los valores monetarios en COP enteros.
 */

interface PaymentPlanInput {
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
}

interface ScheduleRow {
  cuota: number
  descripcion: string
  fecha: string
  valor: number
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

function calculateMonthlyRate(rateEA: number): number {
  return Math.pow(1 + rateEA / 100, 1 / 12) - 1
}

function calculateFrenchPayment(principal: number, rateEA: number, termMonths: number): number {
  if (principal <= 0) return 0
  const r = calculateMonthlyRate(rateEA)
  return Math.round(principal * r / (1 - Math.pow(1 + r, -termMonths)))
}

export function generatePaymentPlan(input: PaymentPlanInput, now?: Date): PaymentPlan {
  // `now` inyectable para tests deterministas; en producción default = fecha actual.
  const today = now ?? new Date()

  // 1. Cuota inicial
  const ciAmount = Math.round(input.list_price * input.ci_percentage / 100)
  const saldoCi = ciAmount - input.separation_value

  // 2. Fecha meta CI
  let effectiveDate: Date
  if (input.ci_date_mode === 'dynamic') {
    let month = today.getMonth() + input.ci_dynamic_months
    const year = today.getFullYear() + Math.floor(month / 12)
    month = month % 12
    const day = Math.min(today.getDate(), daysInMonth(year, month + 1))
    effectiveDate = new Date(year, month, day)
  } else {
    effectiveDate = new Date(input.ci_target_date + 'T12:00:00')
  }

  // Numero de cuotas
  const monthsDiff = (effectiveDate.getFullYear() - today.getFullYear()) * 12 +
    (effectiveDate.getMonth() - today.getMonth())
  const ciInstallments = Math.max(1, monthsDiff)
  const ciMonthly = ciInstallments > 0 ? Math.round(saldoCi / ciInstallments) : saldoCi

  // 3. Financiacion
  let financingAmount = input.list_price - ciAmount
  const maxFinancing = Math.round(input.list_price * input.max_loan_pct / 100)
  financingAmount = Math.min(financingAmount, maxFinancing)

  // 4. Credito hipotecario referencial
  const loanTermMonths = input.loan_term_years * 12
  const monthlyBasePayment = calculateFrenchPayment(financingAmount, input.reference_rate_ea, loanTermMonths)

  // Seguros
  const fireMonthly = Math.round(financingAmount * input.fire_insurance_rate_annual / 12)
  const totalMonthly = monthlyBasePayment + input.life_insurance_monthly + fireMonthly
  const incomeRequired = Math.round(totalMonthly / 0.30)

  // 5. Cronograma
  const ciSchedule: ScheduleRow[] = []
  ciSchedule.push({
    cuota: 0,
    descripcion: 'Separación',
    fecha: formatDate(today),
    valor: input.separation_value,
  })

  for (let i = 1; i <= ciInstallments; i++) {
    let month = today.getMonth() + i
    const year = today.getFullYear() + Math.floor(month / 12)
    month = month % 12
    const day = Math.min(today.getDate(), daysInMonth(year, month + 1))
    const fecha = new Date(year, month, day)
    ciSchedule.push({
      cuota: i,
      descripcion: `Cuota ${i} de ${ciInstallments}`,
      fecha: formatDate(fecha),
      valor: ciMonthly,
    })
  }

  const calcDate = today.toISOString().slice(0, 10)

  return {
    list_price: input.list_price,
    list_price_fmt: formatCOP(input.list_price),
    separation_value: input.separation_value,
    separation_value_fmt: formatCOP(input.separation_value),
    ci_percentage: input.ci_percentage,
    ci_amount: ciAmount,
    ci_amount_fmt: formatCOP(ciAmount),
    saldo_ci: saldoCi,
    saldo_ci_fmt: formatCOP(saldoCi),
    ci_installments: ciInstallments,
    ci_monthly: ciMonthly,
    ci_monthly_fmt: formatCOP(ciMonthly),
    ci_target_date: formatDate(effectiveDate),
    ci_target_date_iso: effectiveDate.toISOString().slice(0, 10),
    ci_schedule: ciSchedule,
    ci_schedule_total: input.separation_value + (ciMonthly * ciInstallments),
    financing_amount: financingAmount,
    financing_amount_fmt: formatCOP(financingAmount),
    loan_term_years: input.loan_term_years,
    loan_term_months: loanTermMonths,
    reference_rate_ea: input.reference_rate_ea,
    monthly_base_payment: monthlyBasePayment,
    monthly_base_payment_fmt: formatCOP(monthlyBasePayment),
    life_insurance_monthly: input.life_insurance_monthly,
    fire_insurance_monthly: fireMonthly,
    total_monthly_with_insurance: totalMonthly,
    total_monthly_fmt: formatCOP(totalMonthly),
    income_required: incomeRequired,
    income_required_fmt: formatCOP(incomeRequired),
    calculation_date: calcDate,
    calculation_date_fmt: formatDate(today),
  }
}
