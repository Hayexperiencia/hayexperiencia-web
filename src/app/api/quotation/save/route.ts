import { NextResponse } from 'next/server'
import { getPool } from '@/lib/pg'
import { saveQuotationFull } from '@/lib/quotation-pipeline'
import { asPositiveInt, parseOverrides, parseClientData, parseChannel } from '@/lib/validate'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import type { PlanOverrides } from '@/lib/quotation-engine'

/**
 * Endpoint legacy (flujo /calculate → /save de Harry y del cotizador v1).
 *
 * V2: el payment_plan que manda el cliente YA NO se persiste — solo se usan
 * sus parametros ajustables (ci_percentage, ci_installments, plazo, tasa) como
 * overrides y el plan se recalcula completo server-side desde la BD. Asi una
 * cotizacion no puede inyectar precios o montos falsos.
 */
export async function POST(request: Request) {
  if (!rateLimit(`save:${clientIp(request)}`, 6)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes, intenta en un minuto' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Body JSON invalido' }, { status: 400 })

  const unitId = asPositiveInt(body.unit_id)
  if (!unitId) {
    return NextResponse.json({ error: 'unit_id es requerido' }, { status: 400 })
  }

  // client_data es opcional aqui (el v1 permitia guardar anonimo desde la web)
  let clientData = null
  if (body.client_data && typeof body.client_data === 'object' && body.client_data.name) {
    const parsed = parseClientData(body.client_data)
    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    clientData = parsed.data
  }

  // Overrides: shape v2 (body.overrides) o extraidos del payment_plan legacy.
  let overrides: PlanOverrides | undefined = parseOverrides(body.overrides)
  if (!overrides && body.payment_plan && typeof body.payment_plan === 'object') {
    const pp = body.payment_plan as Record<string, unknown>
    overrides = parseOverrides({
      ci_percentage: pp.ci_percentage,
      ci_installments: pp.ci_installments,
      loan_term_years: pp.loan_term_years,
      reference_rate_ea: pp.reference_rate_ea,
    })
  }

  const channel = parseChannel(body.channel, 'web')

  const p = await getPool()
  const client = await p.connect()
  try {
    const result = await saveQuotationFull(client, { unitId, overrides, clientData, channel })
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }
    return NextResponse.json({
      quotation_code: result.quotation_code,
      quotation_id: result.quotation_id,
      ghl_contact_id: result.ghl_contact_id,
      pdf_url: result.pdf_url,
      pdf_status: result.pdf_status,
      share_url: result.share_url,
      valid_until: result.calc.payment_plan.valid_until_iso,
    })
  } catch (e) {
    console.error('save error:', e)
    return NextResponse.json({ error: 'Error guardando la cotizacion' }, { status: 500 })
  } finally {
    client.release()
  }
}
