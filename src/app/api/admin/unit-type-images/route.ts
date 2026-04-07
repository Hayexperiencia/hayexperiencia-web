import { NextResponse } from 'next/server'

let pool: import('pg').Pool | null = null

async function getPool() {
  if (!pool) {
    const { Pool } = await import('pg')
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

export async function POST(request: Request) {
  const { project_id, unit_type, image_url, caption, sort_order } = await request.json()

  if (!project_id || !unit_type || !image_url) {
    return NextResponse.json({ error: 'project_id, unit_type e image_url son requeridos' }, { status: 400 })
  }

  const p = await getPool()
  const client = await p.connect()
  try {
    await client.query(`
      INSERT INTO hei_unit_type_images (project_id, unit_type, image_url, caption, sort_order)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (project_id, unit_type, sort_order) DO UPDATE
        SET image_url = EXCLUDED.image_url,
            caption   = EXCLUDED.caption
    `, [project_id, unit_type, image_url, caption || null, sort_order || 0])
    return NextResponse.json({ ok: true })
  } finally {
    client.release()
  }
}

export async function PATCH(request: Request) {
  const { unit_id, image_url } = await request.json()

  if (!unit_id || !image_url) {
    return NextResponse.json({ error: 'unit_id e image_url son requeridos' }, { status: 400 })
  }

  const p = await getPool()
  const client = await p.connect()
  try {
    await client.query(
      'UPDATE hei_inventory_units SET image_url = $1, updated_at = NOW() WHERE id = $2',
      [image_url, unit_id]
    )
    return NextResponse.json({ ok: true })
  } finally {
    client.release()
  }
}
