import { NextRequest } from 'next/server';
import { getAdminPool, checkAdminAuth, jsonWithCache, jsonError } from '@/lib/admin-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;

  try {
    const p = await getAdminPool();
    const cobertura = await p.query(`
      SELECT
        rep.hei_wasi_id::text AS wasi_id,
        h.title,
        h.city,
        h.property_type,
        rep.hei_match_type::text AS match_type,
        rep.num_dominios::int AS num_dominios,
        rep.en_dominios,
        rep.ultima_vez_visto
      FROM market_intel.hei_republications rep
      LEFT JOIN market_intel.hei_inventory_snapshot h ON h.wasi_id = rep.hei_wasi_id::text
      ORDER BY rep.num_dominios DESC, rep.ultima_vez_visto DESC
    `);
    const shared = await p.query(`
      SELECT
        hei_wasi_id::text AS wasi_id,
        hei_title AS title,
        city,
        property_type,
        transaction,
        hei_price,
        competidores,
        urls
      FROM market_intel.hei_shared_with_competitors
      ORDER BY array_length(competidores, 1) DESC NULLS LAST
    `);
    return jsonWithCache({
      ok: true,
      cobertura: cobertura.rows,
      shared: shared.rows,
    });
  } catch (e) {
    console.error('[admin/mercado/republicacion]', e);
    return jsonError('internal');
  }
}
