import { NextResponse } from 'next/server'
import { getPool } from '@/lib/pg'

const VALID_FOLLOWUP = ['nueva', 'contactado', 'negociacion', 'cerrada', 'descartada']

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const project_id = searchParams.get('project_id')
  const channel = searchParams.get('channel')
  const followup = searchParams.get('followup_status')
  const search = searchParams.get('search')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500)
  const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)

  const conditions = ['1=1']
  const params: unknown[] = []

  if (project_id) {
    params.push(project_id)
    conditions.push(`q.project_id = $${params.length}`)
  }
  if (channel) {
    params.push(channel)
    conditions.push(`q.channel = $${params.length}`)
  }
  if (followup && VALID_FOLLOWUP.includes(followup)) {
    params.push(followup)
    conditions.push(`q.followup_status = $${params.length}`)
  }
  if (search) {
    params.push(`%${search.trim()}%`)
    conditions.push(`(q.quotation_code ILIKE $${params.length} OR q.client_name ILIKE $${params.length} OR q.client_phone ILIKE $${params.length} OR q.client_email ILIKE $${params.length})`)
  }
  if (from) {
    params.push(from)
    conditions.push(`q.created_at >= $${params.length}::date`)
  }
  if (to) {
    params.push(to)
    conditions.push(`q.created_at < ($${params.length}::date + interval '1 day')`)
  }

  params.push(limit, offset)
  const p = await getPool()
  const { rows } = await p.query(`
    SELECT q.*, p.name as project_name, p.slug as project_slug,
           u.unit_code, u.unit_type,
           COUNT(*) OVER() as total_count
    FROM hei_quotations q
    JOIN hei_projects p ON p.id = q.project_id
    LEFT JOIN hei_inventory_units u ON u.id = q.unit_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY q.created_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `, params)
  return NextResponse.json(rows)
}

/** Seguimiento comercial: estado y notas de una cotizacion. */
export async function PUT(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const sets: string[] = []
  const vals: unknown[] = []

  if (body.followup_status !== undefined) {
    if (!VALID_FOLLOWUP.includes(body.followup_status)) {
      return NextResponse.json({ error: `followup_status debe ser: ${VALID_FOLLOWUP.join(', ')}` }, { status: 400 })
    }
    vals.push(body.followup_status)
    sets.push(`followup_status = $${vals.length}`)
  }
  if (body.admin_notes !== undefined) {
    vals.push(String(body.admin_notes ?? '').slice(0, 2000) || null)
    sets.push(`admin_notes = $${vals.length}`)
  }
  if (sets.length === 0) return NextResponse.json({ error: 'No hay campos' }, { status: 400 })

  vals.push(body.id)
  const p = await getPool()
  await p.query(`UPDATE hei_quotations SET ${sets.join(', ')} WHERE id = $${vals.length}`, vals)
  return NextResponse.json({ ok: true })
}
