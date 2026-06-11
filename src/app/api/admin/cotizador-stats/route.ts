import { NextResponse } from 'next/server'
import { getPool } from '@/lib/pg'

/** Mini-dashboard del cotizador: volumen, canales, funnel de eventos y seguimiento. */
export async function GET() {
  const p = await getPool()
  const client = await p.connect()
  try {
    const [weekly, byChannel, byProject, funnel, followup] = await Promise.all([
      client.query(`
        SELECT to_char(date_trunc('week', created_at), 'YYYY-MM-DD') as week, COUNT(*) as n
        FROM hei_quotations
        WHERE created_at > NOW() - interval '8 weeks'
        GROUP BY 1 ORDER BY 1
      `),
      client.query(`
        SELECT channel, COUNT(*) as n,
               COUNT(*) FILTER (WHERE created_at > NOW() - interval '30 days') as n_30d
        FROM hei_quotations GROUP BY channel ORDER BY n DESC
      `),
      client.query(`
        SELECT p.name, p.slug, COUNT(q.id) as n,
               COUNT(q.id) FILTER (WHERE q.created_at > NOW() - interval '30 days') as n_30d
        FROM hei_quotations q JOIN hei_projects p ON p.id = q.project_id
        GROUP BY p.id ORDER BY n DESC
      `),
      client.query(`
        SELECT event, COUNT(*) as n, COUNT(DISTINCT session_hash) as sessions
        FROM hei_cotizador_events
        WHERE created_at > NOW() - interval '30 days'
        GROUP BY event
      `).catch(() => ({ rows: [] })),
      client.query(`
        SELECT followup_status, COUNT(*) as n FROM hei_quotations GROUP BY followup_status
      `).catch(() => ({ rows: [] })),
    ])

    return NextResponse.json({
      weekly: weekly.rows,
      by_channel: byChannel.rows,
      by_project: byProject.rows,
      funnel_30d: funnel.rows,
      followup: followup.rows,
    })
  } finally {
    client.release()
  }
}
