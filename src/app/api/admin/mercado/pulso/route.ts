import { NextRequest } from 'next/server';
import { getAdminPool, checkAdminAuth, jsonWithCache, jsonError } from '@/lib/admin-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;

  try {
    const p = await getAdminPool();
    const kpis = await p.query(`
      SELECT
        COUNT(*)::int AS total,
        ROUND(100.0 * COUNT(*) FILTER (WHERE cover_url IS NOT NULL) / NULLIF(COUNT(*),0), 1) AS pct_foto,
        ROUND(100.0 * COUNT(*) FILTER (WHERE lat IS NOT NULL AND lng IS NOT NULL) / NULLIF(COUNT(*),0), 1) AS pct_geo,
        COUNT(DISTINCT source_domain)::int AS dominios
      FROM market_intel.scraper_listings_external
    `);
    const sources = await p.query(`
      SELECT source_domain,
             COUNT(*)::int AS n,
             MAX(scraped_at) AS last_scrape,
             MAX(last_seen_at) AS last_seen
      FROM market_intel.scraper_listings_external
      GROUP BY source_domain
      ORDER BY n DESC
    `);
    return jsonWithCache({
      ok: true,
      kpis: kpis.rows[0],
      sources: sources.rows,
    });
  } catch (e) {
    console.error('[admin/mercado/pulso]', e);
    return jsonError('internal');
  }
}
