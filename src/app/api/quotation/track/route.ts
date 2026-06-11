import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { getPool } from '@/lib/pg'
import { trackCotizadorEvent } from '@/lib/quotation-pipeline'
import { asPositiveInt, cleanStr, parseChannel } from '@/lib/validate'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SALT = process.env.ANALYTICS_HASH_SALT ?? 'hei-default-salt'

const VALID_EVENTS = new Set([
  'started',
  'project_selected',
  'unit_selected',
  'plan_adjusted',
  'lead_gate_shown',
  'quote_saved',
  'pdf_downloaded',
  'whatsapp_clicked',
  'share_viewed',
  'share_copied',
])

export async function POST(req: NextRequest) {
  if (!rateLimit(`track:${clientIp(req)}`, 60)) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: false }, { status: 400 })

  const event = cleanStr(body.event, 40)
  if (!event || !VALID_EVENTS.has(event)) {
    return NextResponse.json({ ok: false, error: 'event invalido' }, { status: 400 })
  }

  const sessionRaw = `${req.headers.get('x-forwarded-for') ?? ''}:${req.headers.get('user-agent') ?? ''}`
  const sessionHash = crypto.createHash('sha256').update(`${SALT}:${sessionRaw}`).digest('hex')

  // meta: solo claves planas y valores cortos (sin PII)
  let meta: Record<string, unknown> | null = null
  if (body.meta && typeof body.meta === 'object' && !Array.isArray(body.meta)) {
    meta = {}
    for (const [k, v] of Object.entries(body.meta as Record<string, unknown>).slice(0, 10)) {
      if (typeof v === 'number' || typeof v === 'boolean') meta[k.slice(0, 40)] = v
      else if (typeof v === 'string') meta[k.slice(0, 40)] = v.slice(0, 120)
    }
  }

  const p = await getPool()
  const client = await p.connect()
  try {
    await trackCotizadorEvent(client, {
      sessionHash,
      event,
      projectSlug: cleanStr(body.project_slug, 50),
      unitId: asPositiveInt(body.unit_id),
      quotationCode: cleanStr(body.quotation_code, 20),
      channel: parseChannel(body.channel, 'web'),
      meta,
    })
    return NextResponse.json({ ok: true })
  } finally {
    client.release()
  }
}
