import { NextRequest } from 'next/server';
import { getAdminPool, checkAdminAuth, jsonWithCache, jsonError } from '@/lib/admin-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;

  try {
    const p = await getAdminPool();
    const r = await p.query(`
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
      SELECT m.city,
             m.tipo,
             m.trans,
             m.n_mkt,
             COALESCE(h.n_hei, 0) AS n_hei,
             (m.n_mkt - COALESCE(h.n_hei, 0)) AS gap,
             CASE WHEN m.n_mkt > 0
                  THEN ROUND(100.0 * COALESCE(h.n_hei, 0) / m.n_mkt, 1)
                  ELSE 0 END AS pct_hei
      FROM mkt m
      LEFT JOIN hei h ON h.city = m.city AND h.tipo = m.tipo AND h.trans = m.trans
      ORDER BY gap DESC
      LIMIT 30
    `);
    return jsonWithCache({ ok: true, rows: r.rows });
  } catch (e) {
    console.error('[admin/mercado/brechas]', e);
    return jsonError('internal');
  }
}
