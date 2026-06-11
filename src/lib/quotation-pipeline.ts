import { writeFile, mkdir, stat } from 'fs/promises'
import path from 'path'
import crypto from 'node:crypto'
import { generatePaymentPlan, type PlanOverrides, type PaymentPlan } from '@/lib/quotation-engine'
import type { PoolClient } from 'pg'

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://host.docker.internal:3001'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hayexperiencia.com'
const GHL_SERVICE_URL = process.env.GHL_SERVICE_URL || 'http://host.docker.internal:3002'
const GHL_SERVICE_API_KEY = process.env.GHL_SERVICE_API_KEY || ''

// CF "Proyecto de interes" se llena en el ghl-service (PROJECT_SLUG_TO_CF_OPTION
// en routers/cotizador.py). El sitio web no necesita conocer el ID.

export type PdfStatus = 'verified' | 'missing' | 'unverified'

export async function verifyPdfUrl(absoluteUrl: string, timeoutMs = 5000): Promise<PdfStatus> {
  try {
    const res = await fetch(absoluteUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(timeoutMs),
    })
    return res.ok ? 'verified' : 'missing'
  } catch {
    return 'unverified'
  }
}

export async function generateAndSavePdf(args: {
  unit: Record<string, unknown>
  project: Record<string, unknown>
  paymentPlan: Record<string, unknown>
  quotationCode: string
  clientName?: string
  clientPhone?: string
  clientEmail?: string
}): Promise<{ relativeUrl: string | null; absoluteUrl: string | null; status: PdfStatus }> {
  try {
    const res = await fetch(`${PDF_SERVICE_URL}/pdf/cotizacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unit: args.unit,
        project: args.project,
        payment_plan: args.paymentPlan,
        quotation_code: args.quotationCode,
        client_name: args.clientName,
        client_phone: args.clientPhone,
        client_email: args.clientEmail,
      }),
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) {
      console.error(`pdf-service ${res.status}`)
      return { relativeUrl: null, absoluteUrl: null, status: 'missing' }
    }

    const pdf = Buffer.from(await res.arrayBuffer())
    if (pdf.length < 1024) {
      console.error(`pdf-service returned tiny buffer (${pdf.length} bytes)`)
      return { relativeUrl: null, absoluteUrl: null, status: 'missing' }
    }

    const safeCode = args.quotationCode.replace(/[^a-zA-Z0-9-]/g, '')
    const unitCode = String(args.unit.unit_code || 'unidad').replace(/\s+/g, '')
    const filename = `${safeCode}-${unitCode}.pdf`

    const pdfDir = path.join(process.cwd(), 'public', 'pdfs')
    await mkdir(pdfDir, { recursive: true })
    const fullPath = path.join(pdfDir, filename)
    await writeFile(fullPath, pdf)

    // Local sanity check: file exists and matches buffer size
    const stats = await stat(fullPath).catch(() => null)
    if (!stats || stats.size !== pdf.length) {
      console.error(`pdf write verification failed: stats=${stats?.size} buf=${pdf.length}`)
      return { relativeUrl: null, absoluteUrl: null, status: 'missing' }
    }

    const relativeUrl = `/pdfs/${filename}`
    const absoluteUrl = `${SITE_URL}${relativeUrl}`
    const status = await verifyPdfUrl(absoluteUrl)
    return { relativeUrl, absoluteUrl, status }
  } catch (e) {
    console.error('PDF generation error:', e)
    return { relativeUrl: null, absoluteUrl: null, status: 'missing' }
  }
}

export async function upsertCotizadorContact(args: {
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
    Authorization: `Bearer ${GHL_SERVICE_API_KEY}`,
    'Content-Type': 'application/json',
  }
  if (args.ghlAccount) headers['X-GHL-Account'] = args.ghlAccount

  const body = {
    name: args.name,
    phone: args.phone,
    email: args.email,
    project_slug: args.projectSlug,
    quotation_code: args.quotationCode,
    pdf_url: args.pdfUrl,
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

export async function nextQuotationCode(client: PoolClient): Promise<string> {
  const res = await client.query(`
    UPDATE hei_system_config
    SET value = (value::integer + 1)::text, updated_at = NOW()
    WHERE key = 'quotation_counter'
    RETURNING value
  `)
  const counter = res.rows[0].value.padStart(5, '0')
  const year = new Date().getFullYear()
  return `HEI-${year}-${counter}`
}

export interface PersistArgs {
  quotationCode: string
  unitId: number
  projectId: number
  paymentPlan: PaymentPlan
  clientData: { name?: string; phone?: string | null; email?: string | null; city?: string | null } | null
  ghlContactId: string | null
  channel: string
  pdfUrl: string | null
}

export async function persistQuotation(client: PoolClient, args: PersistArgs) {
  const shareToken = crypto.randomBytes(6).toString('hex')
  const plan = args.paymentPlan
  const { rows } = await client.query(
    `
    INSERT INTO hei_quotations (
      quotation_code, unit_id, project_id,
      list_price, separation_value, ci_percentage, ci_amount,
      ci_installments, ci_monthly, ci_target_date,
      financing_amount, reference_rate_ea, loan_term_months,
      monthly_payment_est, income_required_est,
      client_name, client_phone, client_email, client_city,
      ghl_contact_id, channel, pdf_url,
      share_token, valid_until, overrides, plan_snapshot
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
    RETURNING id, quotation_code, share_token
  `,
    [
      args.quotationCode,
      args.unitId,
      args.projectId,
      plan.list_price,
      plan.separation_value,
      plan.ci_percentage,
      plan.ci_amount,
      plan.ci_installments,
      plan.ci_monthly,
      plan.ci_target_date_iso,
      plan.financing_amount,
      plan.reference_rate_ea,
      plan.loan_term_months,
      plan.total_monthly_with_insurance,
      plan.income_required,
      args.clientData?.name || null,
      args.clientData?.phone || null,
      args.clientData?.email || null,
      args.clientData?.city || null,
      args.ghlContactId,
      args.channel || 'web',
      args.pdfUrl,
      shareToken,
      plan.valid_until_iso,
      plan.overrides_applied ? JSON.stringify(plan.overrides_applied) : null,
      JSON.stringify(plan),
    ]
  )
  return rows[0] as { id: number; quotation_code: string; share_token: string }
}

export interface CalcResult {
  project_id: number
  unit: Record<string, unknown> & { id: number; unit_code: string }
  project: Record<string, unknown> & { slug: string; name: string }
  payment_plan: PaymentPlan
}

export async function calculatePlanForUnit(
  client: PoolClient,
  unitId: number,
  overrides?: PlanOverrides
): Promise<CalcResult | null> {
  const { rows } = await client.query(
    `
    SELECT
      u.list_price, u.unit_code, u.unit_type, u.project_id, u.unit_status,
      u.area_total_m2, u.area_private_m2, u.area_built_m2, u.area_terrace_m2,
      u.bedrooms, u.bathrooms, u.has_parking, u.has_storage,
      p.id as project_id_full, p.slug as project_slug, p.name as project_name,
      p.project_type,
      p.separation_value, p.ci_percentage,
      p.ci_target_date::text as ci_target_date,
      p.ci_date_mode, p.ci_dynamic_months,
      p.reference_rate_ea, p.loan_term_years, p.max_loan_pct,
      p.life_insurance_monthly, p.fire_insurance_rate_annual,
      p.cash_discount_pct, p.appreciation_rate_annual, p.quote_validity_days,
      p.contact_whatsapp, p.advisor_name,
      p.logo_url as project_logo_url, p.delivery_date_text,
      p.description as project_description,
      p.cover_image_url as project_cover_image_url,
      p.location as project_location,
      u.description as unit_description,
      COALESCE(u.image_url, ti.image_url, p.cover_image_url) as resolved_image_url
    FROM hei_inventory_units u
    JOIN hei_projects p ON p.id = u.project_id
    LEFT JOIN hei_unit_type_images ti ON ti.project_id = u.project_id AND ti.unit_type = u.unit_type AND ti.sort_order = 0
    WHERE u.id = $1 AND u.is_active = true
  `,
    [unitId]
  )
  if (rows.length === 0) return null
  const u = rows[0]
  const plan = generatePaymentPlan(
    {
      list_price: Number(u.list_price),
      separation_value: Number(u.separation_value),
      ci_percentage: Number(u.ci_percentage),
      ci_target_date: u.ci_target_date,
      ci_date_mode: u.ci_date_mode,
      ci_dynamic_months: Number(u.ci_dynamic_months),
      reference_rate_ea: Number(u.reference_rate_ea),
      loan_term_years: Number(u.loan_term_years),
      max_loan_pct: Number(u.max_loan_pct),
      life_insurance_monthly: Number(u.life_insurance_monthly),
      fire_insurance_rate_annual: Number(u.fire_insurance_rate_annual),
      cash_discount_pct: Number(u.cash_discount_pct) || 0,
      appreciation_rate_annual: Number(u.appreciation_rate_annual) || 0,
      quote_validity_days: Number(u.quote_validity_days) || 15,
    },
    undefined,
    overrides
  )
  return {
    project_id: u.project_id_full as number,
    unit: {
      id: unitId,
      unit_code: u.unit_code,
      unit_type: u.unit_type,
      unit_status: u.unit_status,
      area_total_m2: u.area_total_m2,
      area_private_m2: u.area_private_m2,
      area_built_m2: u.area_built_m2,
      area_terrace_m2: u.area_terrace_m2,
      bedrooms: u.bedrooms,
      bathrooms: u.bathrooms,
      has_parking: u.has_parking,
      has_storage: u.has_storage,
      description: u.unit_description,
      resolved_image_url: u.resolved_image_url,
    },
    project: {
      slug: u.project_slug,
      name: u.project_name,
      project_type: u.project_type,
      logo_url: u.project_logo_url,
      delivery_date_text: u.delivery_date_text,
      description: u.project_description,
      cover_image_url: u.project_cover_image_url,
      location: u.project_location,
      contact_whatsapp: u.contact_whatsapp,
      advisor_name: u.advisor_name,
    },
    payment_plan: plan,
  }
}

export interface SaveResult {
  quotation_code: string
  quotation_id: number
  share_token: string
  share_url: string
  ghl_contact_id: string | null
  pdf_url: string | null
  pdf_status: PdfStatus
  calc: CalcResult
}

/**
 * Flujo completo de guardado (v2): SIEMPRE recalcula server-side desde la BD
 * (el cliente solo aporta overrides acotados, nunca montos), genera PDF,
 * upsertea contacto en GHL y persiste con share token.
 * Usado por /api/quotation/save y /api/quotation/quick-save.
 */
export async function saveQuotationFull(
  client: PoolClient,
  args: {
    unitId: number
    overrides?: PlanOverrides
    clientData: { name: string; phone: string | null; email: string | null; city: string | null } | null
    channel: string
  }
): Promise<SaveResult | { error: string; status: number }> {
  const calc = await calculatePlanForUnit(client, args.unitId, args.overrides)
  if (!calc) return { error: 'Unidad no encontrada o inactiva', status: 404 }

  const quotation_code = await nextQuotationCode(client)

  const pdfResult = await generateAndSavePdf({
    unit: calc.unit,
    project: calc.project,
    paymentPlan: calc.payment_plan as unknown as Record<string, unknown>,
    quotationCode: quotation_code,
    clientName: args.clientData?.name,
    clientPhone: args.clientData?.phone ?? undefined,
    clientEmail: args.clientData?.email ?? undefined,
  })

  let ghl_contact_id: string | null = null
  if (args.clientData?.name) {
    ghl_contact_id = await upsertCotizadorContact({
      name: args.clientData.name,
      phone: args.clientData.phone,
      email: args.clientData.email,
      projectSlug: calc.project.slug,
      quotationCode: quotation_code,
      pdfUrl: pdfResult.absoluteUrl,
      channel: args.channel,
      codigoInmueble: calc.unit.unit_code,
    })
  }

  const inserted = await persistQuotation(client, {
    quotationCode: quotation_code,
    unitId: args.unitId,
    projectId: calc.project_id,
    paymentPlan: calc.payment_plan,
    clientData: args.clientData,
    ghlContactId: ghl_contact_id,
    channel: args.channel,
    pdfUrl: pdfResult.relativeUrl,
  })

  return {
    quotation_code: inserted.quotation_code,
    quotation_id: inserted.id,
    share_token: inserted.share_token,
    share_url: `${SITE_URL}/cotizacion/${inserted.share_token}`,
    ghl_contact_id,
    pdf_url: pdfResult.absoluteUrl,
    pdf_status: pdfResult.status,
    calc,
  }
}

/** Registra un evento del funnel del cotizador. Nunca lanza (fire-and-forget). */
export async function trackCotizadorEvent(
  client: PoolClient,
  args: {
    sessionHash: string | null
    event: string
    projectSlug?: string | null
    unitId?: number | null
    quotationCode?: string | null
    channel?: string
    meta?: Record<string, unknown> | null
  }
): Promise<void> {
  try {
    await client.query(
      `INSERT INTO hei_cotizador_events (session_hash, event, project_slug, unit_id, quotation_code, channel, meta)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        args.sessionHash,
        args.event,
        args.projectSlug ?? null,
        args.unitId ?? null,
        args.quotationCode ?? null,
        args.channel ?? 'web',
        args.meta ? JSON.stringify(args.meta) : null,
      ]
    )
  } catch (e) {
    console.error('trackCotizadorEvent error:', e)
  }
}
