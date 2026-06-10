import { NextRequest, NextResponse } from 'next/server';

// Gate único para todas las APIs admin. La key llega por header (scripts/Harry),
// cookie hei_admin (páginas admin tras login) o query ?key= (compat).
// Sin ADMIN_API_KEY configurada falla cerrado: nunca volver al fallback público.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/api/admin') || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  const adminKey = process.env.ADMIN_API_KEY;
  const provided =
    req.headers.get('x-admin-key') ??
    req.cookies.get('hei_admin')?.value ??
    req.nextUrl.searchParams.get('key');

  if (!adminKey || provided !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = { matcher: '/api/admin/:path*' };
