import { NextResponse } from 'next/server'
import {
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
  const { unit_id, project_id, payment_plan, client_data, channel } = body

  if (!unit_id || !project_id || !payment_plan) {
    return NextResponse.json(
      { error: 'unit_id, project_id y payment_plan son requeridos' },
      { status: 400 }
    )
  }

  const p = await getPool()
  const client = await p.connect()
  try {
    const { proj, unitData } = await loadProjectAndUnit(client, project_id, unit_id)
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
      paymentPlan: payment_plan,
      quotationCode: quotation_code,
      clientName: client_data?.name,
      clientPhone: client_data?.phone,
      clientEmail: client_data?.email,
    })

    let ghl_contact_id: string | null = null
    if (client_data?.name) {
      ghl_contact_id = await upsertCotizadorContact({
        name: client_data.name,
        phone: client_data.phone || null,
        email: client_data.email || null,
        projectSlug: proj.slug,
        quotationCode: quotation_code,
        pdfUrl: pdfResult.absoluteUrl,
        channel: channel || 'web',
        codigoInmueble: unitData?.unit_code || null,
      })
    }

    const inserted = await persistQuotation(client, {
      quotationCode: quotation_code,
      unitId: unit_id,
      projectId: project_id,
      paymentPlan: payment_plan,
      clientData: client_data || null,
      ghlContactId: ghl_contact_id,
      channel: channel || 'web',
      pdfUrl: pdfResult.relativeUrl,
    })

    return NextResponse.json({
      quotation_code: inserted.quotation_code,
      quotation_id: inserted.id,
      ghl_contact_id,
      pdf_url: pdfResult.absoluteUrl,
      pdf_status: pdfResult.status,
    })
  } finally {
    client.release()
  }
}
