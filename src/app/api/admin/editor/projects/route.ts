import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.REEL_SERVICE_URL || 'http://127.0.0.1:3004';
const KEY = process.env.REEL_SERVICE_API_KEY || '';
const H: Record<string, string> = KEY ? { Authorization: `Bearer ${KEY}` } : {};
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const r = await fetch(`${URL}/projects`, { headers: H, cache: 'no-store' });
    return NextResponse.json(await r.json(), { status: r.status });
  } catch {
    return NextResponse.json({ error: 'reel-service no disponible' }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { drive_url } = await req.json();
    const fd = new FormData();
    fd.append('drive_url', drive_url || '');
    const r = await fetch(`${URL}/projects`, { method: 'POST', headers: H, body: fd });
    return NextResponse.json(await r.json(), { status: r.status });
  } catch {
    return NextResponse.json({ error: 'reel-service no disponible' }, { status: 502 });
  }
}
