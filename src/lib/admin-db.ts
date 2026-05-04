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

const ADMIN_KEY = process.env.ADMIN_API_KEY ?? 'hayexperiencia';

export function checkAdminAuth(req: NextRequest): NextResponse | null {
  const auth = req.headers.get('x-admin-key') ?? req.nextUrl.searchParams.get('key');
  if (auth !== ADMIN_KEY) {
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
