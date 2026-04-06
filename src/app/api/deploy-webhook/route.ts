import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || '';
const COOLIFY_TOKEN = process.env.COOLIFY_API_TOKEN || '';
const APP_UUID = 'hhc1afp29any1kulfucplz13';

function verifySignature(payload: string, signature: string): boolean {
  const hmac = createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-hub-signature-256') || '';

  if (!WEBHOOK_SECRET || !verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(body);
  if (payload.ref !== 'refs/heads/main') {
    return NextResponse.json({ status: 'ignored', reason: 'not main branch' });
  }

  try {
    const res = await fetch(
      `http://host.docker.internal:8000/api/v1/deploy?uuid=${APP_UUID}&force=false`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${COOLIFY_TOKEN}` },
      }
    );
    const data = await res.json();
    console.log(`[deploy-webhook] Triggered by ${payload.pusher?.name}:`, data);
    return NextResponse.json({ status: 'deploy_triggered', coolify: data });
  } catch (err) {
    console.error('[deploy-webhook] Failed:', err);
    return NextResponse.json({ error: 'Deploy failed' }, { status: 500 });
  }
}
