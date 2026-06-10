import { NextRequest } from 'next/server';
import { getAdminPool, checkAdminAuth, jsonWithCache, jsonError } from '@/lib/admin-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;

  try {
    const p = await getAdminPool();
    const views = await p.query(`
      SELECT COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE viewed_at > NOW() - INTERVAL '7 days')::int AS d7,
             COUNT(*) FILTER (WHERE viewed_at > NOW() - INTERVAL '30 days')::int AS d30,
             COUNT(DISTINCT session_hash) FILTER (WHERE viewed_at > NOW() - INTERVAL '30 days')::int AS sesiones30,
             MIN(viewed_at) AS desde
      FROM analytics.property_views
    `);
    const cotizaciones = await p.query(`
      SELECT COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS d7,
             COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days')::int AS d30,
             COUNT(*) FILTER (WHERE ghl_contact_id IS NOT NULL)::int AS con_ghl
      FROM hei_quotations
    `);
    return jsonWithCache({
      ok: true,
      visitas: views.rows[0],
      cotizaciones: cotizaciones.rows[0],
    });
  } catch (e) {
    return jsonError((e as Error).message);
  }
}
