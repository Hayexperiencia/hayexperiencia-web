import { NextRequest } from 'next/server';
import { getAdminPool, checkAdminAuth, jsonWithCache, jsonError } from '@/lib/admin-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;

  try {
    const p = await getAdminPool();
    const tendencia = await p.query(`
      SELECT date_trunc('day', viewed_at)::date AS dia, COUNT(*)::int AS views,
             COUNT(DISTINCT session_hash)::int AS sesiones
      FROM analytics.property_views
      WHERE viewed_at > NOW() - INTERVAL '30 days'
      GROUP BY 1 ORDER BY 1
    `);
    const topProps = await p.query(`
      SELECT wasi_id, COUNT(*)::int AS views,
             COUNT(DISTINCT session_hash)::int AS sesiones,
             MAX(viewed_at) AS ultima
      FROM analytics.property_views
      WHERE viewed_at > NOW() - INTERVAL '30 days'
      GROUP BY wasi_id ORDER BY views DESC LIMIT 10
    `);
    const fuentes = await p.query(`
      SELECT COALESCE(NULLIF(source, ''), 'direct') AS fuente, COUNT(*)::int AS n
      FROM analytics.property_views
      GROUP BY 1 ORDER BY n DESC LIMIT 8
    `);
    const dispositivos = await p.query(`
      SELECT COALESCE(device, 'desconocido') AS device, COUNT(*)::int AS n
      FROM analytics.property_views GROUP BY 1 ORDER BY n DESC
    `);
    const ciudades = await p.query(`
      SELECT COALESCE(NULLIF(city, ''), 'desconocida') AS city, COUNT(*)::int AS n
      FROM analytics.property_views GROUP BY 1 ORDER BY n DESC LIMIT 8
    `);
    return jsonWithCache({
      ok: true,
      tendencia: tendencia.rows,
      topProps: topProps.rows,
      fuentes: fuentes.rows,
      dispositivos: dispositivos.rows,
      ciudades: ciudades.rows,
    });
  } catch (e) {
    return jsonError((e as Error).message);
  }
}
