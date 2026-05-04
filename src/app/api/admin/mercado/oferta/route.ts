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
      SELECT
        city,
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE transaction = 'venta')::int AS venta,
        COUNT(*) FILTER (WHERE transaction = 'arriendo')::int AS arriendo,
        ROUND(percentile_cont(0.5) WITHIN GROUP (ORDER BY price_cop)
              FILTER (WHERE transaction = 'venta' AND price_cop > 1000000)::numeric / 1e6, 1) AS med_venta_M,
        ROUND(percentile_cont(0.5) WITHIN GROUP (ORDER BY price_monthly_cop)
              FILTER (WHERE transaction = 'arriendo' AND price_monthly_cop > 100000)::numeric, 0) AS med_arriendo_cop,
        ROUND(percentile_cont(0.5) WITHIN GROUP (
          ORDER BY (price_cop / NULLIF(area_total_m2, 0))
        ) FILTER (
          WHERE transaction = 'venta' AND price_cop > 1000000 AND area_total_m2 > 0
        )::numeric / 1e6, 2) AS med_pxm2_venta_M
      FROM market_intel.scraper_listings_external
      WHERE city IS NOT NULL
      GROUP BY city
      ORDER BY total DESC
    `);
    return jsonWithCache({ ok: true, rows: r.rows });
  } catch (e) {
    console.error('[admin/mercado/oferta]', e);
    return jsonError('internal');
  }
}
