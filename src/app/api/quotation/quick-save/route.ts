import { NextResponse } from 'next/server'
import {
  calculatePlanForUnit,
  generateAndSavePdf,
  loadProjectAndUnit,
  nextQuotationCode,
  persistQuotation,
  upsertCotizadorContact,
} from '@/lib/quotation-pipeline'

let pool: import('pg').Pool | null = null

async function getPool() {
  if (!pool) {
    const { Pool } = await import('pg')
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

export async function POST(request: Request) {
  const body = await request.json()
  const { unit_id, client_data, channel } = body as {
    unit_id?: number
    client_data?: { name?: string; phone?: string; email?: string; city?: string }
    channel?: string
  }

  if (!unit_id) {
    return NextResponse.json({ error: 'unit_id es requerido' }, { status: 400 })
  }
  if (!client_data?.name) {
    return NextResponse.json(
      { error: 'client_data.name es requerido' },
      { status: 400 }
    )
  }

  const p = await getPool()
  const client = await p.connect()
  try {
    const calc = await calculatePlanForUnit(client, unit_id)
    if (!calc) {
      return NextResponse.json(
        { error: 'Unidad no encontrada o inactiva' },
        { status: 404 }
      )
    }

    const { proj, unitData } = await loadProjectAndUnit(client, calc.project_id, unit_id)
    if (!proj) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    const quotation_code = await nextQuotationCode(client)

    const pdfResult = await generateAndSavePdf({
      unit: unitData ?? {},
      project: {
        slug: proj.slug,
        name: proj.name,
        logo_url: proj.logo_url,
        cover_image_url: proj.cover_image_url,
        description: proj.description,
        location: proj.location,
        delivery_date_text: proj.delivery_date_text,
      },
      paymentPlan: calc.payment_plan as unknown as Record<string, unknown>,
      quotationCode: quotation_code,
      clientName: client_data.name,
      clientPhone: client_data.phone,
      clientEmail: client_data.email,
    })

    const ghl_contact_id = await upsertCotizadorContact({
      name: client_data.name,
      phone: client_data.phone || null,
      email: client_data.email || null,
      projectSlug: proj.slug,
      quotationCode: quotation_code,
      pdfUrl: pdfResult.absoluteUrl,
      channel: channel || 'harry',
      codigoInmueble: unitData?.unit_code || null,
    })

    const inserted = await persistQuotation(client, {
      quotationCode: quotation_code,
      unitId: unit_id,
      projectId: calc.project_id,
      paymentPlan: calc.payment_plan as unknown as Record<string, unknown>,
      clientData: client_data,
      ghlContactId: ghl_contact_id,
      channel: channel || 'harry',
      pdfUrl: pdfResult.relativeUrl,
    })

    return NextResponse.json({
      quotation_code: inserted.quotation_code,
      quotation_id: inserted.id,
      ghl_contact_id,
      pdf_url: pdfResult.absoluteUrl,
      pdf_status: pdfResult.status,
      project: { slug: proj.slug, name: proj.name },
      unit: {
        id: calc.unit.id,
        unit_code: calc.unit.unit_code,
        unit_type: calc.unit.unit_type,
      },
      summary: {
        list_price: calc.payment_plan.list_price,
        list_price_fmt: calc.payment_plan.list_price_fmt,
        separation_value: calc.payment_plan.separation_value,
        ci_amount: calc.payment_plan.ci_amount,
        ci_installments: calc.payment_plan.ci_installments,
        ci_monthly: calc.payment_plan.ci_monthly,
        financing_amount: calc.payment_plan.financing_amount,
        total_monthly: calc.payment_plan.total_monthly_with_insurance,
        income_required: calc.payment_plan.income_required,
      },
    })
  } finally {
    client.release()
  }
}
