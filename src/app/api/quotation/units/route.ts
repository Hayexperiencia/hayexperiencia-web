import { NextResponse } from 'next/server'

let pool: import('pg').Pool | null = null

async function getPool() {
  if (!pool) {
    const { Pool } = await import('pg')
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const project_slug = searchParams.get('project_slug')
  const stage_id = searchParams.get('stage_id')
  const status = searchParams.get('status') || 'disponible'

  if (!project_slug) {
    return NextResponse.json({ error: 'project_slug es requerido' }, { status: 400 })
  }

  const p = await getPool()
  const client = await p.connect()
  try {
    const { rows } = await client.query(`
      SELECT u.id, u.unit_code, u.unit_type, u.tower, u.floor_number,
             u.area_total_m2, u.area_private_m2, u.area_built_m2, u.area_terrace_m2,
             u.bedrooms, u.bathrooms,
             u.has_parking, u.parking_type, u.has_storage,
             u.view_description, u.list_price, u.unit_status,
             s.name as stage_name,
             COALESCE(u.image_url, ti.image_url, p.cover_image_url) as resolved_image_url,
             ti.caption as type_image_caption
      FROM hei_inventory_units u
      JOIN hei_projects p ON p.id = u.project_id
      LEFT JOIN hei_project_stages s ON s.id = u.stage_id
      LEFT JOIN hei_unit_type_images ti
             ON ti.project_id = u.project_id
            AND ti.unit_type = u.unit_type
            AND ti.sort_order = 0
      WHERE p.slug = $1
        AND u.is_active = true
        AND ($2::integer IS NULL OR u.stage_id = $2::integer)
        AND u.unit_status = $3
      ORDER BY u.unit_code
    `, [project_slug, stage_id ? parseInt(stage_id) : null, status])
    return NextResponse.json(rows)
  } finally {
    client.release()
  }
}
