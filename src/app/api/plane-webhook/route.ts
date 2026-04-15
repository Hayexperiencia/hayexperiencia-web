import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

const WEBHOOK_SECRET = process.env.PLANE_WEBHOOK_SECRET || '';

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET || !signature) return false;
  const digest = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-plane-signature') || '';
  const event = request.headers.get('x-plane-event') || 'unknown';
  const delivery = request.headers.get('x-plane-delivery') || '';

  if (!verifySignature(body, signature)) {
    console.warn('[plane-webhook] invalid signature', { event, delivery });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const action = typeof payload.action === 'string' ? payload.action : 'unknown';
  const dataId = typeof payload.data === 'object' && payload.data && 'id' in payload.data
    ? (payload.data as { id: string }).id
    : '';

  console.log('[plane-webhook]', JSON.stringify({
    ts: new Date().toISOString(),
    event,
    action,
    delivery,
    dataId,
    workspace: payload.workspace_id,
  }));

  return NextResponse.json({ status: 'received', event, action });
}

export async function GET() {
  return NextResponse.json({
    service: 'plane-webhook',
    status: 'ready',
    expects: 'POST with X-Plane-Signature (HMAC SHA-256 hex) and X-Plane-Event headers',
  });
}
