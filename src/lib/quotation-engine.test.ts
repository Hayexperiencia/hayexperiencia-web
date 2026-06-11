import { describe, it, expect } from 'vitest'
import { generatePaymentPlan } from './quotation-engine'

// Caso base con parámetros reales del sistema (hei_system_config) y fecha fija
// para que el cronograma sea determinista.
const baseInput = {
  list_price: 100_000_000,
  separation_value: 1_000_000,
  ci_percentage: 30,
  ci_target_date: '2026-12-09',
  ci_date_mode: 'fixed',
  ci_dynamic_months: 6,
  reference_rate_ea: 12.5,
  loan_term_years: 15,
  max_loan_pct: 70,
  life_insurance_monthly: 90_000,
  fire_insurance_rate_annual: 0.00252,
}
const NOW = new Date(2026, 5, 9, 12, 0, 0) // 2026-06-09

describe('generatePaymentPlan — invariantes financieras', () => {
  it('cuota inicial = list_price * ci% redondeado', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.ci_amount).toBe(Math.round(100_000_000 * 30 / 100))
  })

  it('saldo CI = cuota inicial - separación', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.saldo_ci).toBe(p.ci_amount - baseInput.separation_value)
  })

  it('financiación se topa a max_loan_pct del precio', () => {
    // ci 10% deja saldo a financiar 90M, pero max_loan_pct 70% lo limita a 70M
    const p = generatePaymentPlan({ ...baseInput, ci_percentage: 10 }, NOW)
    expect(p.financing_amount).toBe(Math.round(100_000_000 * 70 / 100))
  })

  it('ingreso requerido = cuota total / 0.30', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.income_required).toBe(Math.round(p.total_monthly_with_insurance / 0.30))
  })

  it('cuota total = base + seguro vida + seguro incendio', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.total_monthly_with_insurance).toBe(
      p.monthly_base_payment + p.life_insurance_monthly + p.fire_insurance_monthly,
    )
  })

  it('cronograma = separación + N cuotas (N+1 filas)', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.ci_schedule.length).toBe(p.ci_installments + 1)
    expect(p.ci_schedule[0].descripcion).toBe('Separación')
  })

  it('tasa más alta => cuota mensual más alta', () => {
    const low = generatePaymentPlan({ ...baseInput, reference_rate_ea: 10 }, NOW)
    const high = generatePaymentPlan({ ...baseInput, reference_rate_ea: 15 }, NOW)
    expect(high.monthly_base_payment).toBeGreaterThan(low.monthly_base_payment)
  })

  it('financiación cero => cuota base cero y sin seguros (no NaN)', () => {
    // ci 100% no deja nada por financiar
    const p = generatePaymentPlan({ ...baseInput, ci_percentage: 100 }, NOW)
    expect(p.financing_amount).toBe(0)
    expect(p.monthly_base_payment).toBe(0)
    expect(p.life_insurance_monthly).toBe(0)
    expect(p.total_monthly_with_insurance).toBe(0)
    expect(Number.isNaN(p.monthly_base_payment)).toBe(false)
  })
})

describe('generatePaymentPlan — exactitud del cronograma (fix v2)', () => {
  it('la suma del cronograma es EXACTAMENTE separación + saldo CI', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    const sum = p.ci_schedule.reduce((acc, r) => acc + r.valor, 0)
    expect(sum).toBe(p.ci_amount)
    expect(p.ci_schedule_total).toBe(p.ci_amount)
  })

  it('última cuota ajusta el residuo de redondeo', () => {
    // saldo 29M / 6 cuotas: 5 de 4.833.333 + última de 4.833.335
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.ci_monthly).toBe(4_833_333)
    expect(p.ci_last_installment).toBe(29_000_000 - 4_833_333 * 5)
    expect(p.ci_schedule[p.ci_schedule.length - 1].valor).toBe(p.ci_last_installment)
  })

  it('separación >= cuota inicial => saldo CI 0 sin negativos', () => {
    const p = generatePaymentPlan({ ...baseInput, separation_value: 40_000_000 }, NOW)
    expect(p.saldo_ci).toBe(0)
    expect(p.ci_monthly).toBe(0)
    const sum = p.ci_schedule.slice(1).reduce((acc, r) => acc + r.valor, 0)
    expect(sum).toBe(0)
  })
})

describe('generatePaymentPlan — modo dynamic y fechas', () => {
  it('dynamic con N meses equivale a fecha fija hoy+N', () => {
    const dyn = generatePaymentPlan({ ...baseInput, ci_date_mode: 'dynamic', ci_dynamic_months: 6 }, NOW)
    expect(dyn.ci_installments).toBe(6)
    expect(dyn.ci_target_date_iso).toBe('2026-12-09')
  })

  it('fin de mes: 31-ene + 1 mes cae al 28-feb (no desborda)', () => {
    const eom = new Date(2026, 0, 31, 12, 0, 0)
    const p = generatePaymentPlan({ ...baseInput, ci_date_mode: 'dynamic', ci_dynamic_months: 1 }, eom)
    expect(p.ci_target_date_iso).toBe('2026-02-28')
  })
})

describe('generatePaymentPlan — overrides acotados (v2)', () => {
  it('más cuotas que meses hasta la meta => la meta se corre', () => {
    const p = generatePaymentPlan(baseInput, NOW, { ci_installments: 12 })
    expect(p.ci_installments).toBe(12)
    expect(p.ci_target_date_iso).toBe('2027-06-09')
    const sum = p.ci_schedule.reduce((acc, r) => acc + r.valor, 0)
    expect(sum).toBe(p.ci_amount)
  })

  it('ci_installments se acota a 36', () => {
    const p = generatePaymentPlan(baseInput, NOW, { ci_installments: 50 })
    expect(p.ci_installments).toBe(36)
  })

  it('ci_percentage no baja del mínimo del proyecto', () => {
    const p = generatePaymentPlan(baseInput, NOW, { ci_percentage: 10 })
    expect(p.ci_percentage).toBe(30)
  })

  it('ci_percentage mayor reduce la financiación', () => {
    const p = generatePaymentPlan(baseInput, NOW, { ci_percentage: 50 })
    expect(p.ci_amount).toBe(50_000_000)
    expect(p.financing_amount).toBe(50_000_000)
    expect(p.overrides_applied).toEqual({ ci_percentage: 50 })
  })

  it('plazo y tasa se acotan a rangos sanos', () => {
    const p = generatePaymentPlan(baseInput, NOW, { loan_term_years: 40, reference_rate_ea: 3 })
    expect(p.loan_term_years).toBe(30)
    expect(p.reference_rate_ea).toBe(6)
  })

  it('sin overrides => overrides_applied null y bounds presentes', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.overrides_applied).toBeNull()
    expect(p.override_bounds.ci_percentage.min).toBe(30)
  })
})

describe('generatePaymentPlan — contado, valorización, amortización, vigencia (v2)', () => {
  it('descuento de contado calcula precio y ahorro', () => {
    const p = generatePaymentPlan({ ...baseInput, cash_discount_pct: 5 }, NOW)
    expect(p.cash_price).toBe(95_000_000)
    expect(p.cash_savings).toBe(5_000_000)
  })

  it('sin descuento => precio contado igual a lista', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.cash_discount_pct).toBe(0)
    expect(p.cash_price).toBe(100_000_000)
    expect(p.cash_savings).toBe(0)
  })

  it('valorización 7% proyecta 5 años compuestos', () => {
    const p = generatePaymentPlan({ ...baseInput, appreciation_rate_annual: 7 }, NOW)
    expect(p.appreciation_projection.length).toBe(5)
    expect(p.appreciation_projection[0].value).toBe(Math.round(100_000_000 * 1.07))
    expect(p.appreciation_projection[4].value).toBe(Math.round(100_000_000 * Math.pow(1.07, 5)))
  })

  it('sin tasa de valorización => proyección vacía', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.appreciation_projection).toEqual([])
  })

  it('amortización anual: balance final 0 y capital total = financiación', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.amortization_yearly.length).toBe(15)
    const last = p.amortization_yearly[p.amortization_yearly.length - 1]
    expect(last.balance).toBe(0)
    const totalPrincipal = p.amortization_yearly.reduce((acc, r) => acc + r.principal_paid, 0)
    expect(Math.abs(totalPrincipal - p.financing_amount)).toBeLessThanOrEqual(15)
  })

  it('vigencia default 15 días desde el cálculo', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.valid_until_iso).toBe('2026-06-24')
  })
})

describe('generatePaymentPlan — golden (regresión)', () => {
  it('caso base produce exactamente los valores conocidos', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect({
      ci_amount: p.ci_amount,
      saldo_ci: p.saldo_ci,
      ci_installments: p.ci_installments,
      ci_monthly: p.ci_monthly,
      financing_amount: p.financing_amount,
      monthly_base_payment: p.monthly_base_payment,
      fire_insurance_monthly: p.fire_insurance_monthly,
      total_monthly_with_insurance: p.total_monthly_with_insurance,
      income_required: p.income_required,
      schedule_rows: p.ci_schedule.length,
      // v2: suma exacta (v1 arrastraba residuo de redondeo: 29_999_998)
      ci_schedule_total: p.ci_schedule_total,
    }).toEqual({
      ci_amount: 30_000_000,
      saldo_ci: 29_000_000,
      ci_installments: 6,
      ci_monthly: 4_833_333,
      financing_amount: 70_000_000,
      monthly_base_payment: 832_759,
      fire_insurance_monthly: 14_700,
      total_monthly_with_insurance: 937_459,
      income_required: 3_124_863,
      schedule_rows: 7,
      ci_schedule_total: 30_000_000,
    })
  })

  it('formato COP con separador de miles es-CO', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.ci_amount_fmt).toBe('$30.000.000')
  })
})
