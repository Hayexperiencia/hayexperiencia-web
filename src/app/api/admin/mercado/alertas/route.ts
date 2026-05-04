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
        wasi_id::text AS wasi_id,
        title,
        city,
        tipo,
        trans,
        area_m2::numeric AS area_m2,
        area_band,
        precio_M,
        pxm2_M,
        mercado_n,
        mercado_pxm2_M,
        pxm2_p25_M,
        pxm2_p75_M,
        posicion,
        diff_pxm2_M,
        diff_pct
      FROM market_intel.hei_competitive_position_v2
      WHERE posicion IS NOT NULL
      ORDER BY
        CASE posicion WHEN 'ALTO' THEN 1 WHEN 'BAJO' THEN 2 ELSE 3 END,
        ABS(COALESCE(diff_pct, 0)) DESC
    `);
    const counts = r.rows.reduce((acc: Record<string, number>, row) => {
      const k = row.posicion ?? 'NULL';
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {});
    return jsonWithCache({ ok: true, counts, rows: r.rows });
  } catch (e) {
    console.error('[admin/mercado/alertas]', e);
    return jsonError('internal');
  }
}
