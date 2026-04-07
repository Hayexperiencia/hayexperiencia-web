import { NextResponse } from 'next/server'

let pool: import('pg').Pool | null = null
async function getPool() {
  if (!pool) { const { Pool } = await import('pg'); pool = new Pool({ connectionString: process.env.DATABASE_URL }) }
  return pool
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const project_id = searchParams.get('project_id')
  const status = searchParams.get('status')

  if (!project_id) return NextResponse.json({ error: 'project_id requerido' }, { status: 400 })

  const p = await getPool()
  const conditions = ['u.project_id = $1']
  const params: unknown[] = [project_id]

  if (status) {
    conditions.push(`u.unit_status = $2`)
    params.push(status)
  }

  const { rows } = await p.query(`
    SELECT u.*, s.name as stage_name, p.slug as project_slug
    FROM hei_inventory_units u
    LEFT JOIN hei_project_stages s ON s.id = u.stage_id
    JOIN hei_projects p ON p.id = u.project_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY u.unit_code
  `, params)
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { project_id, unit_code, list_price } = body

  if (!project_id || !unit_code || list_price === undefined) {
    return NextResponse.json({ error: 'project_id, unit_code y list_price son requeridos' }, { status: 400 })
  }

  const p = await getPool()
  const { rows } = await p.query(`
    INSERT INTO hei_inventory_units (
      project_id, stage_id, unit_code, unit_type, list_price,
      area_total_m2, area_private_m2, area_built_m2, area_terrace_m2,
      bedrooms, bathrooms, has_parking, parking_type, has_storage,
      view_description, image_url, internal_notes, unit_status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
    RETURNING id, unit_code
  `, [
    project_id,
    body.stage_id || null,
    unit_code,
    body.unit_type || null,
    list_price,
    body.area_total_m2 || null,
    body.area_private_m2 || null,
    body.area_built_m2 || null,
    body.area_terrace_m2 || null,
    body.bedrooms || null,
    body.bathrooms || null,
    body.has_parking || false,
    body.parking_type || null,
    body.has_storage || false,
    body.view_description || null,
    body.image_url || null,
    body.internal_notes || null,
    body.unit_status || 'disponible',
  ])
  return NextResponse.json(rows[0])
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const allowed = [
    'unit_code', 'unit_type', 'unit_status', 'list_price',
    'area_total_m2', 'area_private_m2', 'area_built_m2', 'area_terrace_m2',
    'bedrooms', 'bathrooms', 'has_parking', 'parking_type', 'has_storage',
    'view_description', 'image_url', 'internal_notes', 'is_active',
    'tower', 'floor_number', 'stage_id'
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
  if (sets.length === 0) return NextResponse.json({ error: 'No hay campos' }, { status: 400 })

  sets.push(`updated_at = NOW()`)
  vals.push(id)

  const p = await getPool()
  await p.query(`UPDATE hei_inventory_units SET ${sets.join(', ')} WHERE id = $${idx}`, vals)
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })
  const p = await getPool()
  await p.query('DELETE FROM hei_inventory_units WHERE id = $1', [id])
  return NextResponse.json({ ok: true })
}
