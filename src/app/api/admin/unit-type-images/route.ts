import { NextResponse } from 'next/server'
import { getPool } from '@/lib/pg'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const project_id = searchParams.get('project_id')
  if (!project_id) return NextResponse.json({ error: 'project_id requerido' }, { status: 400 })

  const p = await getPool()
  const { rows } = await p.query(
    `SELECT project_id, unit_type, image_url, caption, sort_order
     FROM hei_unit_type_images
     WHERE project_id = $1
     ORDER BY unit_type, sort_order`,
    [project_id]
  )
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const { project_id, unit_type, image_url, caption, sort_order } = await request.json()

  if (!project_id || !unit_type || !image_url) {
    return NextResponse.json({ error: 'project_id, unit_type e image_url son requeridos' }, { status: 400 })
  }

  const p = await getPool()
  await p.query(`
    INSERT INTO hei_unit_type_images (project_id, unit_type, image_url, caption, sort_order)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (project_id, unit_type, sort_order) DO UPDATE
      SET image_url = EXCLUDED.image_url,
          caption   = EXCLUDED.caption
  `, [project_id, unit_type, image_url, caption || null, sort_order || 0])
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request) {
  const { unit_id, image_url } = await request.json()

  if (!unit_id || !image_url) {
    return NextResponse.json({ error: 'unit_id e image_url son requeridos' }, { status: 400 })
  }

  const p = await getPool()
  await p.query(
    'UPDATE hei_inventory_units SET image_url = $1, updated_at = NOW() WHERE id = $2',
    [image_url, unit_id]
  )
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const { project_id, unit_type, sort_order } = await request.json()
  if (!project_id || !unit_type) {
    return NextResponse.json({ error: 'project_id y unit_type son requeridos' }, { status: 400 })
  }
  const p = await getPool()
  await p.query(
    'DELETE FROM hei_unit_type_images WHERE project_id = $1 AND unit_type = $2 AND sort_order = $3',
    [project_id, unit_type, sort_order ?? 0]
  )
  return NextResponse.json({ ok: true })
}
