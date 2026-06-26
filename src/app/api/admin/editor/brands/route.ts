import { NextResponse } from 'next/server';

const URL = process.env.REEL_SERVICE_URL || 'http://127.0.0.1:3004';
const KEY = process.env.REEL_SERVICE_API_KEY || '';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const r = await fetch(`${URL}/brands`, {
      headers: KEY ? { Authorization: `Bearer ${KEY}` } : {},
      cache: 'no-store',
    });
    return NextResponse.json(await r.json(), { status: r.status });
  } catch {
    return NextResponse.json({ error: 'reel-service no disponible' }, { status: 502 });
  }
}
