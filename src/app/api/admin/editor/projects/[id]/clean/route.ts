import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.REEL_SERVICE_URL || 'http://127.0.0.1:3004';
const KEY = process.env.REEL_SERVICE_API_KEY || '';
const H: Record<string, string> = KEY ? { Authorization: `Bearer ${KEY}` } : {};
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const body = await req.json().catch(() => ({}));
    const fd = new FormData();
    if (body.cut_ids !== undefined && body.cut_ids !== null) fd.append('cut_ids', String(body.cut_ids));
    const r = await fetch(`${URL}/projects/${id}/clean`, { method: 'POST', headers: H, body: fd });
    return NextResponse.json(await r.json(), { status: r.status });
  } catch {
    return NextResponse.json({ error: 'reel-service no disponible' }, { status: 502 });
  }
}
