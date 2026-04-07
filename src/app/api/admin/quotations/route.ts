import { NextResponse } from 'next/server'

let pool: import('pg').Pool | null = null
async function getPool() {
  if (!pool) { const { Pool } = await import('pg'); pool = new Pool({ connectionString: process.env.DATABASE_URL }) }
  return pool
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const project_id = searchParams.get('project_id')
  const limit = parseInt(searchParams.get('limit') || '50')

  const p = await getPool()
  const conditions = ['1=1']
  const params: unknown[] = []

  if (project_id) {
    params.push(project_id)
    conditions.push(`q.project_id = $${params.length}`)
  }

  params.push(limit)
  const { rows } = await p.query(`
    SELECT q.*, p.name as project_name, p.slug as project_slug,
           u.unit_code, u.unit_type
    FROM hei_quotations q
    JOIN hei_projects p ON p.id = q.project_id
    LEFT JOIN hei_inventory_units u ON u.id = q.unit_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY q.created_at DESC
    LIMIT $${params.length}
  `, params)
  return NextResponse.json(rows)
}
