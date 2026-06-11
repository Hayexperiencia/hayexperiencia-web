import { NextResponse } from 'next/server'
import { getPool } from '@/lib/pg'
import { saveQuotationFull } from '@/lib/quotation-pipeline'
import { asPositiveInt, parseOverrides, parseClientData, parseChannel } from '@/lib/validate'
import { rateLimit, clientIp } from '@/lib/rate-limit'

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

  const parsed = parseClientData(body.client_data)
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const overrides = parseOverrides(body.overrides)
  const channel = parseChannel(body.channel, 'harry')

  const p = await getPool()
  const client = await p.connect()
  try {
    const result = await saveQuotationFull(client, {
      unitId,
      overrides,
      clientData: parsed.data,
      channel,
    })
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    const plan = result.calc.payment_plan
    return NextResponse.json({
      quotation_code: result.quotation_code,
      quotation_id: result.quotation_id,
      ghl_contact_id: result.ghl_contact_id,
      pdf_url: result.pdf_url,
      pdf_status: result.pdf_status,
      share_url: result.share_url,
      valid_until: plan.valid_until_iso,
      project: { slug: result.calc.project.slug, name: result.calc.project.name },
      unit: {
        id: result.calc.unit.id,
        unit_code: result.calc.unit.unit_code,
        unit_type: result.calc.unit.unit_type,
      },
      summary: {
        list_price: plan.list_price,
        list_price_fmt: plan.list_price_fmt,
        separation_value: plan.separation_value,
        ci_amount: plan.ci_amount,
        ci_installments: plan.ci_installments,
        ci_monthly: plan.ci_monthly,
        financing_amount: plan.financing_amount,
        total_monthly: plan.total_monthly_with_insurance,
        income_required: plan.income_required,
        cash_price: plan.cash_price,
        cash_discount_pct: plan.cash_discount_pct,
      },
    })
  } catch (e) {
    console.error('quick-save error:', e)
    return NextResponse.json({ error: 'Error guardando la cotizacion' }, { status: 500 })
  } finally {
    client.release()
  }
}
