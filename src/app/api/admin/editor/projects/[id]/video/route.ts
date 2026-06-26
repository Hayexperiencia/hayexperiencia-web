import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.REEL_SERVICE_URL || 'http://127.0.0.1:3004';
const KEY = process.env.REEL_SERVICE_API_KEY || '';
const H: Record<string, string> = KEY ? { Authorization: `Bearer ${KEY}` } : {};
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const which = req.nextUrl.searchParams.get('which') || 'clean';
  try {
    const r = await fetch(`${URL}/projects/${id}/video?which=${which}`, { headers: H });
    if (!r.ok || !r.body) {
      return NextResponse.json({ error: 'video no disponible' }, { status: r.status });
    }
    return new NextResponse(r.body, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': r.headers.get('content-disposition') || `inline; filename="${which}.mp4"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'reel-service no disponible' }, { status: 502 });
  }
}
