import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Verifica si el usuario ya está autenticado, sin pedir contraseña:
//  - por cookie hei_admin (login clásico con contraseña), o
//  - por header Remote-Email (intranet Authelia; el proxy ya auto-seteó la cookie).
// Si no está autenticado, el propio proxy.ts responde 401 antes de llegar aquí.
export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  const cookie = req.cookies.get('hei_admin')?.value;
  const remoteEmail = req.headers.get('remote-email');
  if (adminKey && (cookie === adminKey || remoteEmail)) {
    return NextResponse.json({ ok: true, user: remoteEmail ?? null });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
