import { NextResponse } from 'next/server'
import { generatePaymentPlan } from '@/lib/quotation-engine'

let pool: import('pg').Pool | null = null

async function getPool() {
  if (!pool) {
    const { Pool } = await import('pg')
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

export async function POST(request: Request) {
  const { unit_id } = await request.json()

  if (!unit_id) {
    return NextResponse.json({ error: 'unit_id es requerido' }, { status: 400 })
  }

  const p = await getPool()
  const client = await p.connect()
  try {
    const { rows } = await client.query(`
      SELECT
        u.list_price, u.unit_code, u.unit_type,
        u.area_total_m2, u.area_private_m2, u.area_built_m2, u.area_terrace_m2,
        u.bedrooms, u.bathrooms, u.has_parking, u.has_storage,
        p.slug as project_slug, p.name as project_name,
        p.separation_value, p.ci_percentage,
        p.ci_target_date::text as ci_target_date,
        p.ci_date_mode, p.ci_dynamic_months,
        p.reference_rate_ea, p.loan_term_years, p.max_loan_pct,
        p.life_insurance_monthly,
        p.fire_insurance_rate_annual,
        p.logo_url as project_logo_url,
        p.delivery_date_text
      FROM hei_inventory_units u
      JOIN hei_projects p ON p.id = u.project_id
      WHERE u.id = $1 AND u.is_active = true
    `, [unit_id])

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Unidad no encontrada' }, { status: 404 })
    }

    const unit = rows[0]

    const plan = generatePaymentPlan({
      list_price: Number(unit.list_price),
      separation_value: Number(unit.separation_value),
      ci_percentage: Number(unit.ci_percentage),
      ci_target_date: unit.ci_target_date,
      ci_date_mode: unit.ci_date_mode,
      ci_dynamic_months: Number(unit.ci_dynamic_months),
      reference_rate_ea: Number(unit.reference_rate_ea),
      loan_term_years: Number(unit.loan_term_years),
      max_loan_pct: Number(unit.max_loan_pct),
      life_insurance_monthly: Number(unit.life_insurance_monthly),
      fire_insurance_rate_annual: Number(unit.fire_insurance_rate_annual),
    })

    return NextResponse.json({
      unit: {
        id: unit_id,
        unit_code: unit.unit_code,
        unit_type: unit.unit_type,
        area_total_m2: unit.area_total_m2,
        area_private_m2: unit.area_private_m2,
        area_built_m2: unit.area_built_m2,
        area_terrace_m2: unit.area_terrace_m2,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        has_parking: unit.has_parking,
        has_storage: unit.has_storage,
      },
      project: {
        slug: unit.project_slug,
        name: unit.project_name,
        logo_url: unit.project_logo_url,
        delivery_date_text: unit.delivery_date_text,
      },
      payment_plan: plan,
    })

  } finally {
    client.release()
  }
}
