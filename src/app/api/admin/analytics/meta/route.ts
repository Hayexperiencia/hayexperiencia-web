import { NextRequest } from 'next/server';
import { getAdminPool, checkAdminAuth, jsonWithCache, jsonError } from '@/lib/admin-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;

  try {
    const p = await getAdminPool();
    const existe = await p.query(`SELECT to_regclass('analytics.meta_snapshot') IS NOT NULL AS x`);
    if (!existe.rows[0].x) {
      return jsonWithCache({ ok: true, pendiente: true, payload: null, capturedAt: null });
    }
    const r = await p.query(
      `SELECT payload, captured_at FROM analytics.meta_snapshot ORDER BY captured_at DESC LIMIT 1`
    );
    if (r.rows.length === 0) {
      return jsonWithCache({ ok: true, pendiente: true, payload: null, capturedAt: null });
    }
    return jsonWithCache({
      ok: true,
      pendiente: false,
      payload: r.rows[0].payload,
      capturedAt: r.rows[0].captured_at,
    });
  } catch (e) {
    return jsonError((e as Error).message);
  }
}
