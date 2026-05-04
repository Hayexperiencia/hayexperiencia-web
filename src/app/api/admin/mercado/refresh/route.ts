import { NextRequest } from 'next/server';
import { getAdminPool, checkAdminAuth, jsonError } from '@/lib/admin-db';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;

  try {
    const p = await getAdminPool();
    const start = Date.now();
    const refreshed: string[] = [];
    const skipped: string[] = [];

    for (const view of ['pricing_benchmarks', 'pricing_benchmarks_size_bands']) {
      try {
        await p.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY market_intel.${view}`);
        refreshed.push(view);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes('cannot refresh materialized view') || msg.includes('concurrent')) {
          skipped.push(view);
        } else {
          throw e;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      refreshed,
      skipped,
      duration_ms: Date.now() - start,
    });
  } catch (e) {
    console.error('[admin/mercado/refresh]', e);
    return jsonError('internal');
  }
}
