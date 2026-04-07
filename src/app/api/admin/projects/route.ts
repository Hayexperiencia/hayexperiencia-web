import { NextResponse } from 'next/server'

let pool: import('pg').Pool | null = null
async function getPool() {
  if (!pool) { const { Pool } = await import('pg'); pool = new Pool({ connectionString: process.env.DATABASE_URL }) }
  return pool
}

export async function GET() {
  const p = await getPool()
  const { rows } = await p.query(`
    SELECT p.*,
      COUNT(u.id) FILTER (WHERE u.unit_status = 'disponible') as units_available,
      COUNT(u.id) FILTER (WHERE u.unit_status = 'vendido') as units_sold,
      COUNT(u.id) FILTER (WHERE u.unit_status = 'reservado') as units_reserved,
      COUNT(u.id) FILTER (WHERE u.unit_status = 'bloqueado') as units_blocked,
      COUNT(u.id) as units_total
    FROM hei_projects p
    LEFT JOIN hei_inventory_units u ON u.project_id = p.id
    GROUP BY p.id
    ORDER BY p.sort_order
  `)
  return NextResponse.json(rows)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const allowed = [
    'name', 'status', 'location', 'delivery_date_text',
    'separation_value', 'ci_percentage', 'ci_target_date',
    'ci_date_mode', 'ci_dynamic_months',
    'reference_rate_ea', 'loan_term_years', 'max_loan_pct',
    'life_insurance_monthly', 'fire_insurance_rate_annual',
    'is_active', 'sort_order', 'cover_image_url', 'logo_url'
  ]

  const sets: string[] = []
  const vals: unknown[] = []
  let idx = 1
  for (const [k, v] of Object.entries(fields)) {
    if (allowed.includes(k)) {
      sets.push(`${k} = $${idx}`)
      vals.push(v)
      idx++
    }
  }
  if (sets.length === 0) return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 })

  sets.push(`updated_at = NOW()`)
  vals.push(id)

  const p = await getPool()
  await p.query(`UPDATE hei_projects SET ${sets.join(', ')} WHERE id = $${idx}`, vals)
  return NextResponse.json({ ok: true })
}
