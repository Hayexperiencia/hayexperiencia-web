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

export async function POST(request: Request) {
  const body = await request.json()
  const { slug, name, project_type, separation_value, ci_percentage, ci_target_date } = body
  if (!slug || !name || !project_type || !separation_value || !ci_percentage || !ci_target_date) {
    return NextResponse.json({ error: 'slug, name, project_type, separation_value, ci_percentage, ci_target_date requeridos' }, { status: 400 })
  }
  const p = await getPool()
  const { rows } = await p.query(`
    INSERT INTO hei_projects (slug, name, project_type, separation_value, ci_percentage, ci_target_date,
      status, ci_date_mode, ci_dynamic_months, reference_rate_ea, loan_term_years, max_loan_pct,
      life_insurance_monthly, fire_insurance_rate_annual, location, delivery_date_text,
      cover_image_url, logo_url, sort_order)
    VALUES ($1,$2,$3,$4,$5,$6,
      $7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
    RETURNING id, slug, name
  `, [
    slug, name, project_type, separation_value, ci_percentage, ci_target_date,
    body.status || 'preventa',
    body.ci_date_mode || 'fixed',
    body.ci_dynamic_months || 6,
    body.reference_rate_ea || 12.50,
    body.loan_term_years || 15,
    body.max_loan_pct || 70.00,
    body.life_insurance_monthly || 90000,
    body.fire_insurance_rate_annual || 0.002520,
    body.location || null,
    body.delivery_date_text || null,
    body.cover_image_url || null,
    body.logo_url || null,
    body.sort_order || 0,
  ])
  return NextResponse.json(rows[0])
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const allowed = [
    'name', 'slug', 'project_type', 'status', 'location', 'delivery_date_text',
    'separation_value', 'ci_percentage', 'ci_target_date',
    'ci_date_mode', 'ci_dynamic_months',
    'reference_rate_ea', 'loan_term_years', 'max_loan_pct',
    'life_insurance_monthly', 'fire_insurance_rate_annual',
    'discount_rate_monthly', 'late_rate_monthly',
    'is_active', 'sort_order', 'cover_image_url', 'logo_url',
    'description', 'cash_discount_pct', 'appreciation_rate_annual',
    'contact_whatsapp', 'advisor_name', 'quote_validity_days'
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

export async function DELETE(request: Request) {
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })
  const p = await getPool()
  await p.query('DELETE FROM hei_projects WHERE id = $1', [id])
  return NextResponse.json({ ok: true })
}
