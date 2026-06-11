import type { PaymentPlanInput } from '@/lib/quotation-engine'

export interface Project {
  id: number
  slug: string
  name: string
  project_type: string
  status: string
  location: string
  delivery_date_text: string
  cover_image_url: string | null
  logo_url: string | null
  description: string | null
  separation_value: string
  ci_percentage: string
  ci_target_date: string
  ci_date_mode: string
  ci_dynamic_months: number
  reference_rate_ea: string
  loan_term_years: number
  max_loan_pct: string
  life_insurance_monthly: string
  fire_insurance_rate_annual: string
  cash_discount_pct: string
  appreciation_rate_annual: string
  quote_validity_days: number
  contact_whatsapp: string | null
  advisor_name: string | null
  units_available: string
  stages: { id: number; name: string; stage_order: number }[]
}

export interface Unit {
  id: number
  unit_code: string
  unit_type: string | null
  tower: string | null
  floor_number: number | null
  area_total_m2: string | null
  area_private_m2: string | null
  area_built_m2: string | null
  area_terrace_m2: string | null
  bedrooms: number | null
  bathrooms: number | null
  has_parking: boolean
  parking_type: string | null
  has_storage: boolean
  view_description: string | null
  list_price: string
  unit_status: string
  stage_name: string | null
  resolved_image_url: string | null
}

/** Reconstruye el input del motor desde los datos publicos de proyecto+unidad
 *  para el recalculo en vivo client-side (misma fuente que usa el server). */
export function buildEngineInput(project: Project, listPrice: number): PaymentPlanInput {
  return {
    list_price: listPrice,
    separation_value: Number(project.separation_value),
    ci_percentage: Number(project.ci_percentage),
    ci_target_date: String(project.ci_target_date).slice(0, 10),
    ci_date_mode: project.ci_date_mode || 'fixed',
    ci_dynamic_months: Number(project.ci_dynamic_months) || 6,
    reference_rate_ea: Number(project.reference_rate_ea),
    loan_term_years: Number(project.loan_term_years),
    max_loan_pct: Number(project.max_loan_pct),
    life_insurance_monthly: Number(project.life_insurance_monthly),
    fire_insurance_rate_annual: Number(project.fire_insurance_rate_annual),
    cash_discount_pct: Number(project.cash_discount_pct) || 0,
    appreciation_rate_annual: Number(project.appreciation_rate_annual) || 0,
    quote_validity_days: Number(project.quote_validity_days) || 15,
  }
}

export function formatArea(m2: string | number | null): string {
  if (!m2) return '—'
  const n = typeof m2 === 'string' ? parseFloat(m2) : m2
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString('es-CO', { maximumFractionDigits: 0 }) + ' m²'
}

export function pricePerM2(price: string | number, area: string | number | null): string {
  const p = Number(price)
  const a = Number(area)
  if (!a || !Number.isFinite(p / a)) return '—'
  return '$' + Math.round(p / a).toLocaleString('es-CO') + '/m²'
}

/** Eventos del funnel → Postgres propio (fire-and-forget, sin PII). */
export function sendTrack(
  event: string,
  data: { project_slug?: string; unit_id?: number; quotation_code?: string; channel?: string; meta?: Record<string, unknown> } = {}
) {
  if (typeof window === 'undefined') return
  try {
    void fetch('/api/quotation/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, ...data }),
      keepalive: true,
    }).catch(() => {})
  } catch { /* nunca romper la UI por tracking */ }
}
