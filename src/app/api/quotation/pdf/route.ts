import { NextResponse } from 'next/server'
import { getPool } from '@/lib/pg'
import { calculatePlanForUnit, generateAndSavePdf, SITE_URL } from '@/lib/quotation-pipeline'
import { asPositiveInt, parseOverrides, cleanStr } from '@/lib/validate'
import { rateLimit, clientIp } from '@/lib/rate-limit'

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://host.docker.internal:3001'

/**
 * Genera el PDF de cotizacion. V2: los datos SIEMPRE salen de la BD —
 * ya no se acepta unit/project/payment_plan arbitrarios del cliente
 * (permitia falsificar PDFs "oficiales" con precios inventados).
 *
 * Modos:
 *  - { quotation_code }            → regenera el PDF de una cotizacion guardada (plan_snapshot)
 *  - { unit_id, overrides? }       → PDF al vuelo sin guardar (preview)
 * Opcional: return_url=true devuelve JSON {url} en vez del binario.
 */
export async function POST(request: Request) {
  if (!rateLimit(`pdf:${clientIp(request)}`, 6)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes, intenta en un minuto' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Body JSON invalido' }, { status: 400 })

  const p = await getPool()
  const client = await p.connect()
  try {
    let unit: Record<string, unknown>
    let project: Record<string, unknown>
    let paymentPlan: Record<string, unknown>
    let quotationCode: string | undefined
    let clientName: string | undefined
    let clientPhone: string | undefined
    let clientEmail: string | undefined

    const codeRaw = cleanStr(body.quotation_code, 20)

    if (codeRaw) {
      const { rows } = await client.query(
        `SELECT q.*, u.unit_code, u.unit_type, u.area_total_m2, u.area_private_m2,
                u.area_built_m2, u.area_terrace_m2, u.bedrooms, u.bathrooms,
                u.description as unit_description,
                COALESCE(u.image_url, ti.image_url, p.cover_image_url) as resolved_image_url,
                p.slug as project_slug, p.name as project_name, p.logo_url as project_logo_url,
                p.cover_image_url as project_cover_image_url, p.description as project_description,
                p.location as project_location, p.delivery_date_text
         FROM hei_quotations q
         JOIN hei_projects p ON p.id = q.project_id
         LEFT JOIN hei_inventory_units u ON u.id = q.unit_id
         LEFT JOIN hei_unit_type_images ti ON ti.project_id = u.project_id AND ti.unit_type = u.unit_type AND ti.sort_order = 0
         WHERE q.quotation_code = $1`,
        [codeRaw]
      )
      const q = rows[0]
      if (!q || !q.plan_snapshot) {
        return NextResponse.json({ error: 'Cotizacion no encontrada o sin snapshot' }, { status: 404 })
      }
      paymentPlan = q.plan_snapshot
      quotationCode = q.quotation_code
      clientName = q.client_name ?? undefined
      clientPhone = q.client_phone ?? undefined
      clientEmail = q.client_email ?? undefined
      unit = {
        unit_code: q.unit_code, unit_type: q.unit_type,
        area_total_m2: q.area_total_m2, area_private_m2: q.area_private_m2,
        area_built_m2: q.area_built_m2, area_terrace_m2: q.area_terrace_m2,
        bedrooms: q.bedrooms, bathrooms: q.bathrooms,
        description: q.unit_description, resolved_image_url: q.resolved_image_url,
      }
      project = {
        slug: q.project_slug, name: q.project_name, logo_url: q.project_logo_url,
        cover_image_url: q.project_cover_image_url, description: q.project_description,
        location: q.project_location, delivery_date_text: q.delivery_date_text,
      }
    } else {
      const unitId = asPositiveInt(body.unit_id)
      if (!unitId) {
        return NextResponse.json({ error: 'quotation_code o unit_id es requerido' }, { status: 400 })
      }
      const overrides = parseOverrides(body.overrides)
      const calc = await calculatePlanForUnit(client, unitId, overrides)
      if (!calc) return NextResponse.json({ error: 'Unidad no encontrada' }, { status: 404 })
      unit = calc.unit
      project = calc.project
      paymentPlan = calc.payment_plan as unknown as Record<string, unknown>
    }

    const res = await fetch(`${PDF_SERVICE_URL}/pdf/cotizacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unit, project, payment_plan: paymentPlan,
        quotation_code: quotationCode,
        client_name: clientName, client_phone: clientPhone, client_email: clientEmail,
      }),
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'PDF service error' }))
      return NextResponse.json(err, { status: res.status })
    }

    const pdf = Buffer.from(await res.arrayBuffer())
    const unitCode = String(unit.unit_code || 'unidad').replace(/\s+/g, '')
    const filename = `${(quotationCode || 'HEI-preview').replace(/[^a-zA-Z0-9-]/g, '')}-${unitCode}.pdf`

    // Solo las cotizaciones guardadas persisten a public/pdfs (los previews no dejan rastro)
    if (quotationCode && body.return_url) {
      const saved = await generateAndSavePdf({
        unit, project, paymentPlan, quotationCode,
        clientName, clientPhone, clientEmail,
      })
      return NextResponse.json({ url: saved.relativeUrl, absolute_url: saved.absoluteUrl ?? `${SITE_URL}${saved.relativeUrl}`, filename, status: saved.status })
    }

    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (e) {
    console.error('pdf route error:', e)
    return NextResponse.json({ error: 'Error generando PDF' }, { status: 500 })
  } finally {
    client.release()
  }
}
