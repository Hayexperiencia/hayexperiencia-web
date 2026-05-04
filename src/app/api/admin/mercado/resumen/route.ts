import { NextRequest } from 'next/server';
import { getAdminPool, checkAdminAuth, jsonWithCache, jsonError } from '@/lib/admin-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;

  try {
    const p = await getAdminPool();
    const universo = await p.query(`
      SELECT COUNT(*)::int AS total,
             COUNT(DISTINCT city)::int AS ciudades,
             COUNT(DISTINCT source_domain)::int AS dominios
      FROM market_intel.scraper_listings_external
      WHERE city IS NOT NULL
    `);
    const alertas = await p.query(`
      SELECT posicion, COUNT(*)::int AS n
      FROM market_intel.hei_competitive_position_v2
      WHERE posicion IS NOT NULL
      GROUP BY posicion
    `);
    const topCity = await p.query(`
      SELECT city, COUNT(*)::int AS n
      FROM market_intel.scraper_listings_external
      WHERE city IS NOT NULL
      GROUP BY city
      ORDER BY n DESC
      LIMIT 1
    `);
    const topGap = await p.query(`
      WITH mkt AS (
        SELECT city, property_type::text AS tipo, transaction::text AS trans, COUNT(*)::int AS n_mkt
        FROM market_intel.scraper_listings_external
        WHERE city IS NOT NULL
        GROUP BY city, property_type, transaction
        HAVING COUNT(*) >= 10
      ),
      hei AS (
        SELECT city, property_type AS tipo, transaction AS trans, COUNT(*)::int AS n_hei
        FROM market_intel.hei_inventory_snapshot
        WHERE city IS NOT NULL
        GROUP BY city, property_type, transaction
      )
      SELECT m.city, m.tipo, m.trans, m.n_mkt - COALESCE(h.n_hei, 0) AS gap
      FROM mkt m LEFT JOIN hei h ON h.city = m.city AND h.tipo = m.tipo AND h.trans = m.trans
      ORDER BY gap DESC LIMIT 1
    `);
    const republicaciones = await p.query(`
      SELECT COUNT(*)::int AS total,
             AVG(num_dominios)::numeric(4,1) AS promedio_dominios
      FROM market_intel.hei_republications
    `);
    const shared = await p.query(`SELECT COUNT(*)::int AS n FROM market_intel.hei_shared_with_competitors`);

    const alertCounts: Record<string, number> = { ALTO: 0, BAJO: 0, EN_RANGO: 0 };
    alertas.rows.forEach(r => { alertCounts[r.posicion] = r.n; });

    return jsonWithCache({
      ok: true,
      universo: universo.rows[0],
      alertas: alertCounts,
      topCiudad: topCity.rows[0] ?? null,
      topBrecha: topGap.rows[0] ?? null,
      republicaciones: republicaciones.rows[0],
      sharedListings: shared.rows[0]?.n ?? 0,
    });
  } catch (e) {
    console.error('[admin/mercado/resumen]', e);
    return jsonError('internal');
  }
}
