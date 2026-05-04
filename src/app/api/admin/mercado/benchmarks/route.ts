import { NextRequest } from 'next/server';
import { getAdminPool, checkAdminAuth, jsonWithCache, jsonError } from '@/lib/admin-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;

  const city = req.nextUrl.searchParams.get('city');
  const transaction = req.nextUrl.searchParams.get('transaction');

  try {
    const p = await getAdminPool();
    const cities = await p.query(`
      SELECT DISTINCT city FROM market_intel.pricing_benchmarks_size_bands
      WHERE city IS NOT NULL ORDER BY city
    `);

    const params: (string | null)[] = [];
    let where = 'WHERE TRUE';
    if (city) { params.push(city); where += ` AND city = $${params.length}`; }
    if (transaction) { params.push(transaction); where += ` AND transaction::text = $${params.length}`; }

    const rows = await p.query(`
      SELECT city, property_type::text AS property_type,
             transaction::text AS transaction,
             area_band, muestra,
             precio_mediana_M, pxm2_p25_M, pxm2_mediana_M, pxm2_p75_M,
             computed_at
      FROM market_intel.pricing_benchmarks_size_bands
      ${where}
      ORDER BY city, property_type, area_band
    `, params);

    return jsonWithCache({
      ok: true,
      cities: cities.rows.map(r => r.city),
      rows: rows.rows,
      filter: { city, transaction },
    });
  } catch (e) {
    console.error('[admin/mercado/benchmarks]', e);
    return jsonError('internal');
  }
}
