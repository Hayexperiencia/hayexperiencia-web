import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

const WEBHOOK_SECRET = process.env.PLANE_WEBHOOK_SECRET || '';

// Eventos que alimentan el inbox de Harry (heartbeat). El resto se ignora.
const INBOX_EVENTS = new Set(['issue', 'issue_comment']);

let pool: import('pg').Pool | null = null;

async function getPool() {
  if (!pool) {
    try {
      const { Pool } = await import('pg');
      pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
    } catch {
      return null;
    }
  }
  return pool;
}

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET || !signature) return false;
  const digest = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}

type PlanePayload = {
  action?: string;
  workspace_id?: string;
  data?: {
    id?: string;
    name?: string;
    project?: string;
    assignees?: Array<string | { id?: string }>;
    issue?: string;
    actor?: { id?: string; display_name?: string };
  };
  activity?: { actor?: { id?: string; display_name?: string } };
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-plane-signature') || '';
  const event = request.headers.get('x-plane-event') || 'unknown';
  const delivery = request.headers.get('x-plane-delivery') || '';

  if (!verifySignature(body, signature)) {
    console.warn('[plane-webhook] invalid signature', { event, delivery });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: PlanePayload = {};
  try {
    payload = JSON.parse(body) as PlanePayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const action = typeof payload.action === 'string' ? payload.action : 'unknown';
  const data = payload.data ?? {};
  const actor =
    payload.activity?.actor?.display_name ||
    payload.activity?.actor?.id ||
    data.actor?.display_name ||
    '';

  console.log(
    '[plane-webhook]',
    JSON.stringify({
      ts: new Date().toISOString(),
      event,
      action,
      delivery,
      dataId: data.id ?? '',
      workspace: payload.workspace_id,
    })
  );

  // Persistir al inbox (tabla plane_events) para que el heartbeat de Harry lo
  // procese. Best-effort: si la tabla no existe aun o la BD no responde, el
  // webhook contesta 200 igual (Plane desactiva webhooks que fallan repetido).
  if (INBOX_EVENTS.has(event) && delivery) {
    try {
      const p = await getPool();
      if (p) {
        const assignees = (data.assignees ?? []).map((a) =>
          typeof a === 'string' ? a : a?.id ?? ''
        );
        await p.query(
          `INSERT INTO plane_events
             (delivery_id, event, action, project, workitem_id, workitem_name, actor, assignees, payload)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           ON CONFLICT (delivery_id) DO NOTHING`,
          [
            delivery,
            event,
            action,
            data.project ?? '',
            data.id ?? data.issue ?? '',
            data.name ?? '',
            actor,
            JSON.stringify(assignees),
            body,
          ]
        );
      }
    } catch (err) {
      console.error('[plane-webhook] inbox insert failed', (err as Error).message);
    }
  }

  return NextResponse.json({ status: 'received', event, action });
}

export async function GET() {
  return NextResponse.json({
    service: 'plane-webhook',
    status: 'ready',
    expects: 'POST with X-Plane-Signature (HMAC SHA-256 hex) and X-Plane-Event headers',
  });
}
