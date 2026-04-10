import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { generatePaymentPlan } from '@/lib/quotation-engine'

let pool: import('pg').Pool | null = null

async function getPool() {
  if (!pool) {
    const { Pool } = await import('pg')
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://host.docker.internal:3001'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hayexperiencia.com'
const GHL_SERVICE_URL = process.env.GHL_SERVICE_URL || 'http://host.docker.internal:3002'
const GHL_SERVICE_API_KEY = process.env.GHL_SERVICE_API_KEY || ''

async function generateAndSavePdf(
  unit: Record<string, unknown>,
  project: Record<string, unknown>,
  paymentPlan: Record<string, unknown>,
  quotationCode: string,
  clientName?: string,
  clientPhone?: string,
  clientEmail?: string
): Promise<string | null> {
  try {
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
    if (!res.ok) return null

    const pdf = Buffer.from(await res.arrayBuffer())
    const safeCode = quotationCode.replace(/[^a-zA-Z0-9-]/g, '')
    const unitCode = String(unit.unit_code || 'unidad').replace(/\s+/g, '')
    const filename = `${safeCode}-${unitCode}.pdf`

    const pdfDir = path.join(process.cwd(), 'public', 'pdfs')
    await mkdir(pdfDir, { recursive: true })
    await writeFile(path.join(pdfDir, filename), pdf)

    return `/pdfs/${filename}`
  } catch (e) {
    console.error('PDF generation error:', e)
    return null
  }
}

async function upsertCotizadorContact(args: {
  name: string
  phone: string | null
  email: string | null
  projectSlug: string
  quotationCode: string
  pdfUrl: string | null
  channel: string
  codigoInmueble?: string | null
  ghlAccount?: string | null
}): Promise<string | null> {
  if (!GHL_SERVICE_API_KEY) {
    console.warn('GHL_SERVICE_API_KEY no configurado, skipping ghl upsert')
    return null
  }

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${GHL_SERVICE_API_KEY}`,
    'Content-Type': 'application/json',
  }
  if (args.ghlAccount) headers['X-GHL-Account'] = args.ghlAccount

  const body = {
    name: args.name,
    phone: args.phone,
    email: args.email,
    project_slug: args.projectSlug,
    quotation_code: args.quotationCode,
    pdf_url: args.pdfUrl ? `${SITE_URL}${args.pdfUrl}` : null,
    channel: args.channel || 'web',
    codigo_inmueble: args.codigoInmueble || null,
  }

  try {
    const res = await fetch(`${GHL_SERVICE_URL}/cotizador/upsert-contact`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) {
      const text = await res.text()
      console.error(`ghl-service upsert ${res.status}: ${text}`)
      return null
    }
    const data = await res.json()
    return data.contact_id || null
  } catch (e) {
    console.error('ghl-service upsert error:', e)
    return null
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { unit_id, project_id, payment_plan, client_data, channel } = body

  if (!unit_id || !project_id || !payment_plan) {
    return NextResponse.json({ error: 'unit_id, project_id y payment_plan son requeridos' }, { status: 400 })
  }

  const p = await getPool()
  const client = await p.connect()
  try {
    // Get project + unit data for PDF
    const projectResult = await client.query(
      'SELECT slug, name, logo_url, cover_image_url, description, location, delivery_date_text FROM hei_projects WHERE id = $1',
      [project_id]
    )
    const proj = projectResult.rows[0]
    if (!proj) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })

    const unitResult = await client.query(`
      SELECT u.unit_code, u.unit_type, u.area_total_m2, u.area_private_m2,
             u.area_terrace_m2, u.bedrooms, u.bathrooms, u.has_parking, u.has_storage,
             u.description, COALESCE(u.image_url, ti.image_url, p.cover_image_url) as resolved_image_url
      FROM hei_inventory_units u
      JOIN hei_projects p ON p.id = u.project_id
      LEFT JOIN hei_unit_type_images ti ON ti.project_id = u.project_id AND ti.unit_type = u.unit_type AND ti.sort_order = 0
      WHERE u.id = $1
    `, [unit_id])
    const unitData = unitResult.rows[0]

    // Generate quotation code
    const counterResult = await client.query(`
      UPDATE hei_system_config
      SET value = (value::integer + 1)::text, updated_at = NOW()
      WHERE key = 'quotation_counter'
      RETURNING value
    `)
    const counter = counterResult.rows[0].value.padStart(5, '0')
    const year = new Date().getFullYear()
    const quotation_code = `HEI-${year}-${counter}`

    // Generate PDF
    const pdfUrl = await generateAndSavePdf(
      unitData,
      { slug: proj.slug, name: proj.name, logo_url: proj.logo_url, cover_image_url: proj.cover_image_url, description: proj.description, location: proj.location, delivery_date_text: proj.delivery_date_text },
      payment_plan,
      quotation_code,
      client_data?.name, client_data?.phone, client_data?.email
    )

    // Upsert contacto en GHL via ghl-service (dedup nativo phone-first)
    let ghl_contact_id: string | null = null
    if (client_data?.name) {
      ghl_contact_id = await upsertCotizadorContact({
        name: client_data.name,
        phone: client_data.phone || null,
        email: client_data.email || null,
        projectSlug: proj.slug,
        quotationCode: quotation_code,
        pdfUrl,
        channel: channel || 'web',
        codigoInmueble: unitData?.unit_code || null,
      })
    }

    // Save quotation with PDF URL
    const { rows } = await client.query(`
      INSERT INTO hei_quotations (
        quotation_code, unit_id, project_id,
        list_price, separation_value, ci_percentage, ci_amount,
        ci_installments, ci_monthly, ci_target_date,
        financing_amount, reference_rate_ea, loan_term_months,
        monthly_payment_est, income_required_est,
        client_name, client_phone, client_email, client_city,
        ghl_contact_id, channel, pdf_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
      RETURNING id, quotation_code
    `, [
      quotation_code, unit_id, project_id,
      payment_plan.list_price, payment_plan.separation_value,
      payment_plan.ci_percentage, payment_plan.ci_amount,
      payment_plan.ci_installments, payment_plan.ci_monthly,
      payment_plan.ci_target_date_iso,
      payment_plan.financing_amount, payment_plan.reference_rate_ea,
      payment_plan.loan_term_months,
      payment_plan.total_monthly_with_insurance,
      payment_plan.income_required,
      client_data?.name || null, client_data?.phone || null,
      client_data?.email || null, client_data?.city || null,
      ghl_contact_id, channel || 'web', pdfUrl
    ])

    return NextResponse.json({
      quotation_code: rows[0].quotation_code,
      quotation_id: rows[0].id,
      ghl_contact_id,
      pdf_url: pdfUrl ? `${SITE_URL}${pdfUrl}` : null,
    })

  } finally {
    client.release()
  }
}
