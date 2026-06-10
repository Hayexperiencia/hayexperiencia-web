import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminKey || !adminPassword) {
    return NextResponse.json({ error: 'Admin auth no configurado' }, { status: 503 });
  }

  let password = '';
  try {
    ({ password } = await req.json());
  } catch {
    // body inválido → password queda vacío y falla abajo
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('hei_admin', adminKey, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
