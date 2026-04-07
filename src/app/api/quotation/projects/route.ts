import { NextResponse } from 'next/server'

let pool: import('pg').Pool | null = null

async function getPool() {
  if (!pool) {
    const { Pool } = await import('pg')
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

export async function GET() {
  const p = await getPool()
  const client = await p.connect()
  try {
    const { rows } = await client.query(`
      SELECT
        p.id, p.slug, p.name, p.project_type, p.status,
        p.location, p.delivery_date_text, p.cover_image_url,
        p.separation_value, p.ci_percentage,
        p.ci_target_date, p.ci_date_mode, p.ci_dynamic_months,
        p.reference_rate_ea, p.loan_term_years, p.max_loan_pct,
        p.life_insurance_monthly, p.fire_insurance_rate_annual,
        COALESCE(
          json_agg(
            json_build_object('id', s.id, 'name', s.name, 'stage_order', s.stage_order)
            ORDER BY s.stage_order
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as stages,
        COUNT(u.id) FILTER (WHERE u.unit_status = 'disponible') as units_available
      FROM hei_projects p
      LEFT JOIN hei_project_stages s ON s.project_id = p.id AND s.is_active = true
      LEFT JOIN hei_inventory_units u ON u.project_id = p.id AND u.is_active = true
      WHERE p.is_active = true
      GROUP BY p.id
      ORDER BY p.sort_order
    `)
    return NextResponse.json(rows)
  } finally {
    client.release()
  }
}
