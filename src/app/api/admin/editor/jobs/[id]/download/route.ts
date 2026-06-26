import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.REEL_SERVICE_URL || 'http://127.0.0.1:3004';
const KEY = process.env.REEL_SERVICE_API_KEY || '';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Stream del MP4 final desde el reel-service.
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const r = await fetch(`${URL}/jobs/${id}/download`, {
      headers: KEY ? { Authorization: `Bearer ${KEY}` } : {},
    });
    if (!r.ok || !r.body) {
      return NextResponse.json({ error: 'resultado no disponible' }, { status: r.status });
    }
    return new NextResponse(r.body, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': r.headers.get('content-disposition') || `attachment; filename="reel.mp4"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'reel-service no disponible' }, { status: 502 });
  }
}
