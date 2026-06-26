import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.REEL_SERVICE_URL || 'http://127.0.0.1:3004';
const KEY = process.env.REEL_SERVICE_API_KEY || '';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Proxy multipart (video + opciones) al reel-service.
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const r = await fetch(`${URL}/render`, {
      method: 'POST',
      headers: KEY ? { Authorization: `Bearer ${KEY}` } : {},
      body: form,
    });
    return NextResponse.json(await r.json(), { status: r.status });
  } catch {
    return NextResponse.json({ error: 'reel-service no disponible' }, { status: 502 });
  }
}
