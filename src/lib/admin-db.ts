import { NextRequest, NextResponse } from 'next/server';
import type { Pool } from 'pg';

let _pool: Pool | null = null;

export async function getAdminPool(): Promise<Pool> {
  if (!_pool) {
    const { Pool } = await import('pg');
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return _pool;
}

export function checkAdminAuth(req: NextRequest): NextResponse | null {
  const adminKey = process.env.ADMIN_API_KEY;
  const provided =
    req.headers.get('x-admin-key') ??
    req.cookies.get('hei_admin')?.value ??
    req.nextUrl.searchParams.get('key');
  // Sin env configurada falla cerrado (nunca un fallback hardcodeado).
  if (!adminKey || provided !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export function jsonWithCache<T>(data: T, maxAge = 900, swr = 3600): NextResponse {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': `private, max-age=${maxAge}, stale-while-revalidate=${swr}`,
    },
  });
}

export function jsonError(message: string, status = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}
