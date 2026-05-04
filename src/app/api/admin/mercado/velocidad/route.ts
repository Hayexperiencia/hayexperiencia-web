import { NextRequest } from 'next/server';
import { getAdminPool, checkAdminAuth, jsonWithCache, jsonError } from '@/lib/admin-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;

  try {
    const p = await getAdminPool();
    const stats = await p.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status::text != 'activa')::int AS retirados,
        COUNT(*) FILTER (WHERE last_seen_at < NOW() - INTERVAL '14 days')::int AS sin_ver_14d,
        (SELECT COUNT(*) FROM market_intel.scraper_price_history)::int AS price_changes
      FROM market_intel.scraper_listings
    `);
    const distribucion = await p.query(`
      SELECT
        DATE_TRUNC('week', scraped_at)::date AS semana,
        COUNT(*)::int AS nuevos
      FROM market_intel.scraper_listings_external
      WHERE scraped_at > NOW() - INTERVAL '90 days'
      GROUP BY 1
      ORDER BY 1 DESC
      LIMIT 12
    `);
    const s = stats.rows[0];
    const dataInsuficiente = s.retirados === 0 && s.sin_ver_14d === 0 && s.price_changes === 0;
    return jsonWithCache({
      ok: true,
      stats: s,
      distribucion: distribucion.rows,
      dataInsuficiente,
      mensaje: dataInsuficiente
        ? 'No hay histórico suficiente aún. El scraping comenzó hace pocas semanas y no hemos detectado retiros ni cambios de precio. Days on Market y Months of Supply requieren al menos 60-90 días de tracking activo.'
        : null,
    });
  } catch (e) {
    console.error('[admin/mercado/velocidad]', e);
    return jsonError('internal');
  }
}
