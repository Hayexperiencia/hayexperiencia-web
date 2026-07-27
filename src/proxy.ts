import { NextRequest, NextResponse } from 'next/server';

// Gate admin. Autenticación por dos vías:
//  (1) Intranet SSO: Authelia inyecta el header Remote-Email tras su forward-auth
//      (solo en tráfico que pasa por el proxy Traefik). Si está presente, el usuario
//      ya está logueado en la intranet → auto-setea la cookie hei_admin y NO se pide
//      la contraseña del admin.
//  (2) Clásica: key por header x-admin-key (scripts/Harry), cookie hei_admin (login
//      con contraseña) o query ?key= (compat).
// Sin ADMIN_API_KEY configurada falla cerrado: nunca volver al fallback público.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Dominio de marca ALUNA: alunacampestre.com (+ www) sirve la landing en su raíz
  // SIN cambiar la URL (rewrite interno a /aluna). El resto de rutas pasa igual.
  const host = req.headers.get('host') || '';
  if (pathname === '/' && (host === 'alunacampestre.com' || host === 'www.alunacampestre.com')) {
    return NextResponse.rewrite(new URL('/aluna', req.url));
  }
  // Posicionar el dominio de marca: hayexperiencia.com/aluna -> 301 a alunacampestre.com.
  if (pathname === '/aluna' && (host === 'hayexperiencia.com' || host === 'www.hayexperiencia.com')) {
    const dest = new URL('https://alunacampestre.com/');
    dest.search = req.nextUrl.search;
    return NextResponse.redirect(dest, 301);
  }

  const adminKey = process.env.ADMIN_API_KEY;

  // (1) Usuario autenticado por la intranet (Authelia). Auto-login sin contraseña.
  const remoteEmail = req.headers.get('remote-email');
  if (remoteEmail && adminKey && (pathname.startsWith('/admin') || pathname.startsWith('/api/admin'))) {
    const res = NextResponse.next();
    if (req.cookies.get('hei_admin')?.value !== adminKey) {
      res.cookies.set('hei_admin', adminKey, {
        httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
      });
    }
    return res;
  }

  // (2) Gate clásico de las APIs admin.
  if (!pathname.startsWith('/api/admin') || pathname === '/api/admin/login') {
    return NextResponse.next();
  }
  const provided =
    req.headers.get('x-admin-key') ??
    req.cookies.get('hei_admin')?.value ??
    req.nextUrl.searchParams.get('key');

  if (!adminKey || provided !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = { matcher: ['/', '/aluna', '/admin/:path*', '/api/admin/:path*'] };
