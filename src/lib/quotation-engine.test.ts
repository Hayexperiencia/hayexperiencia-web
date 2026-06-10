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

  it('financiación cero => cuota base cero (no NaN)', () => {
    // ci 100% no deja nada por financiar
    const p = generatePaymentPlan({ ...baseInput, ci_percentage: 100 }, NOW)
    expect(p.financing_amount).toBe(0)
    expect(p.monthly_base_payment).toBe(0)
    expect(Number.isNaN(p.monthly_base_payment)).toBe(false)
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
      ci_schedule_total: 29_999_998,
    })
  })

  it('formato COP con separador de miles es-CO', () => {
    const p = generatePaymentPlan(baseInput, NOW)
    expect(p.ci_amount_fmt).toBe('$30.000.000')
  })
})
