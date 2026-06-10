import { NextRequest } from 'next/server';
import { getAdminPool, checkAdminAuth, jsonWithCache, jsonError } from '@/lib/admin-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;

  try {
    const p = await getAdminPool();
    const porProyecto = await p.query(`
      SELECT COALESCE(pr.name, 'Proyecto ' || q.project_id) AS proyecto,
             COUNT(*)::int AS n,
             COUNT(*) FILTER (WHERE q.created_at > NOW() - INTERVAL '30 days')::int AS d30
      FROM hei_quotations q
      LEFT JOIN hei_projects pr ON pr.id = q.project_id
      GROUP BY 1 ORDER BY n DESC
    `);
    const porCanal = await p.query(`
      SELECT COALESCE(channel, 'web') AS canal, COUNT(*)::int AS n
      FROM hei_quotations GROUP BY 1 ORDER BY n DESC
    `);
    const porMes = await p.query(`
      SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS mes, COUNT(*)::int AS n
      FROM hei_quotations GROUP BY 1 ORDER BY 1
    `);
    const recientes = await p.query(`
      SELECT q.quotation_code, COALESCE(pr.name, '') AS proyecto,
             split_part(COALESCE(q.client_name, ''), ' ', 1) AS nombre,
             COALESCE(q.client_city, '') AS ciudad,
             (q.ghl_contact_id IS NOT NULL) AS en_ghl,
             q.created_at
      FROM hei_quotations q
      LEFT JOIN hei_projects pr ON pr.id = q.project_id
      ORDER BY q.created_at DESC LIMIT 10
    `);
    return jsonWithCache({
      ok: true,
      porProyecto: porProyecto.rows,
      porCanal: porCanal.rows,
      porMes: porMes.rows,
      recientes: recientes.rows,
    });
  } catch (e) {
    return jsonError((e as Error).message);
  }
}
