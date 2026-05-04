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
      WITH top_cities AS (
        SELECT city, COUNT(*) AS n
        FROM market_intel.scraper_listings_external
        WHERE city IS NOT NULL
        GROUP BY city
        ORDER BY n DESC
        LIMIT 6
      ),
      tipos AS (
        SELECT
          sl.city,
          sl.property_type::text AS tipo,
          COUNT(*)::int AS n,
          ROUND(percentile_cont(0.5) WITHIN GROUP (ORDER BY sl.price_cop)
                FILTER (WHERE sl.price_cop > 1000000)::numeric / 1e6, 1) AS mediana_M,
          ROW_NUMBER() OVER (PARTITION BY sl.city ORDER BY COUNT(*) DESC) AS rk
        FROM market_intel.scraper_listings_external sl
        JOIN top_cities tc ON tc.city = sl.city
        WHERE sl.property_type IS NOT NULL
        GROUP BY sl.city, sl.property_type
      )
      SELECT city, tipo, n, mediana_M
      FROM tipos
      WHERE rk <= 3
      ORDER BY city, rk
    `);
    return jsonWithCache({ ok: true, rows: r.rows });
  } catch (e) {
    console.error('[admin/mercado/tipologias]', e);
    return jsonError('internal');
  }
}
