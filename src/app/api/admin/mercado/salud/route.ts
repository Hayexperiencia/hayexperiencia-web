import { NextRequest } from 'next/server';
import { getAdminPool, checkAdminAuth, jsonWithCache, jsonError } from '@/lib/admin-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;

  try {
    const p = await getAdminPool();
    const runs = await p.query(`
      SELECT scraper_name,
             MAX(started_at) AS last_started,
             MAX(finished_at) AS last_finished,
             BOOL_OR(ok) FILTER (WHERE started_at > NOW() - INTERVAL '7 days') AS ok_7d,
             SUM(items_inserted) FILTER (WHERE started_at > NOW() - INTERVAL '7 days')::int AS inserted_7d,
             COUNT(*) FILTER (WHERE started_at > NOW() - INTERVAL '7 days')::int AS runs_7d
      FROM market_intel.scraper_runs
      GROUP BY scraper_name
      ORDER BY last_started DESC NULLS LAST
    `);
    const matRefresh = await p.query(`
      SELECT MAX(computed_at) AS pricing_benchmarks_size_bands
      FROM market_intel.pricing_benchmarks_size_bands
    `);
    const heiInventory = await p.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE price_cop > 0)::int AS con_precio,
        COUNT(*) FILTER (WHERE area_m2 > 0)::int AS con_area,
        COUNT(*) FILTER (WHERE city IS NOT NULL)::int AS con_ciudad,
        MAX(refreshed_at) AS ultimo_sync
      FROM market_intel.hei_inventory_snapshot
    `);
    const matchTypes = await p.query(`
      SELECT COALESCE(hei_match_type::text, 'unmatched') AS match_type, COUNT(*)::int AS n
      FROM market_intel.scraper_listings
      WHERE hei_wasi_id IS NOT NULL
      GROUP BY hei_match_type
    `);

    return jsonWithCache({
      ok: true,
      runs: runs.rows,
      matRefresh: matRefresh.rows[0],
      heiInventory: heiInventory.rows[0],
      matchTypes: matchTypes.rows,
      enrichmentInfo: {
        nota: 'Última corrida enrichment v1: 2026-05-01. 92/92 propiedades procesadas.',
        confidence: { high: 1, medium: 1, low: 21, insufficient: 69 },
        yearBuiltPobladas: 8,
        yearBuiltTotal: 92,
        planeTask: 'HEI-83',
      },
    });
  } catch (e) {
    console.error('[admin/mercado/salud]', e);
    return jsonError('internal');
  }
}
