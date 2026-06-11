import { notFound } from 'next/navigation'
import Link from 'next/link'
import crypto from 'node:crypto'
import { getPool } from '@/lib/pg'
import { trackCotizadorEvent } from '@/lib/quotation-pipeline'
import { formatCOP } from '@/lib/format'
import type { Metadata } from 'next'
import type { PaymentPlan } from '@/lib/quotation-engine'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ token: string }> }

interface SharedQuotation {
  quotation_code: string
  client_name: string | null
  created_at: string
  valid_until: string | null
  pdf_url: string | null
  plan_snapshot: PaymentPlan | null
  list_price: string
  ci_amount: string
  ci_installments: number
  ci_monthly: string
  financing_amount: string
  monthly_payment_est: string
  income_required_est: string
  unit_code: string | null
  unit_type: string | null
  area_total_m2: string | null
  area_private_m2: string | null
  bedrooms: number | null
  bathrooms: number | null
  resolved_image_url: string | null
  project_name: string
  project_slug: string
  project_location: string | null
  logo_url: string | null
  delivery_date_text: string | null
  contact_whatsapp: string | null
  advisor_name: string | null
}

async function loadQuotation(token: string): Promise<SharedQuotation | null> {
  if (!/^[a-f0-9]{8,24}$/i.test(token)) return null
  const p = await getPool()
  const client = await p.connect()
  try {
    const { rows } = await client.query(
      `SELECT q.quotation_code, q.client_name, q.created_at, q.valid_until, q.pdf_url,
              q.plan_snapshot, q.list_price, q.ci_amount, q.ci_installments, q.ci_monthly,
              q.financing_amount, q.monthly_payment_est, q.income_required_est,
              u.unit_code, u.unit_type, u.area_total_m2, u.area_private_m2, u.bedrooms, u.bathrooms,
              COALESCE(u.image_url, ti.image_url, p.cover_image_url) as resolved_image_url,
              p.name as project_name, p.slug as project_slug, p.location as project_location,
              p.logo_url, p.delivery_date_text, p.contact_whatsapp, p.advisor_name
       FROM hei_quotations q
       JOIN hei_projects p ON p.id = q.project_id
       LEFT JOIN hei_inventory_units u ON u.id = q.unit_id
       LEFT JOIN hei_unit_type_images ti ON ti.project_id = u.project_id AND ti.unit_type = u.unit_type AND ti.sort_order = 0
       WHERE q.share_token = $1`,
      [token]
    )
    if (rows.length === 0) return null
    const q = rows[0] as SharedQuotation

    const salt = process.env.ANALYTICS_HASH_SALT ?? 'hei-default-salt'
    await trackCotizadorEvent(client, {
      sessionHash: crypto.createHash('sha256').update(`${salt}:share`).digest('hex'),
      event: 'share_viewed',
      projectSlug: q.project_slug,
      quotationCode: q.quotation_code,
      channel: 'web',
    })
    return q
  } finally {
    client.release()
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params
  const q = await loadQuotation(token)
  if (!q) return { title: 'Cotización no encontrada' }
  return {
    title: `Cotización ${q.quotation_code} — ${q.project_name}`,
    description: `Plan de pagos para ${q.unit_code ?? 'unidad'} en ${q.project_name}. Hay Experiencia.`,
    robots: { index: false, follow: false },
  }
}

function fmtDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function SharedQuotationPage({ params }: PageProps) {
  const { token } = await params
  const q = await loadQuotation(token)
  if (!q) notFound()

  const plan = q.plan_snapshot
  const firstName = q.client_name?.split(' ')[0] ?? null
  const expired = q.valid_until ? new Date(q.valid_until) < new Date() : false
  const wa = q.contact_whatsapp?.replace(/\D/g, '') || '573022343659'
  const waText = encodeURIComponent(
    `Hola, tengo la cotización ${q.quotation_code} de ${q.unit_code ?? ''} en ${q.project_name} y quiero más información.`
  )

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">

        {/* Header */}
        <div className="bg-[var(--color-primary)] p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-300">Cotización {q.quotation_code}</p>
              <h1 className="text-2xl font-bold mt-1">{q.unit_code} — {q.project_name}</h1>
              <p className="text-sm text-gray-300 mt-1">
                {q.project_location}{q.delivery_date_text ? ` | ${q.delivery_date_text}` : ''}
              </p>
              {firstName && <p className="text-sm text-[var(--color-accent)] mt-2">Preparada para {firstName}</p>}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Precio</div>
              <div className="text-2xl sm:text-3xl font-bold text-[var(--color-accent)]">{formatCOP(q.list_price)}</div>
            </div>
          </div>
        </div>

        {/* Vigencia */}
        <div className={`px-6 py-3 text-sm ${expired ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {expired
            ? `Esta cotización venció el ${fmtDate(q.valid_until)}. Los precios pueden haber cambiado — pide una nueva.`
            : `Válida hasta el ${fmtDate(q.valid_until)}. Generada el ${fmtDate(q.created_at)}.`}
        </div>

        {q.resolved_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={q.resolved_image_url} alt={q.unit_code ?? 'Unidad'} className="w-full h-52 object-cover" />
        )}

        {/* Resumen del plan */}
        <div className="p-6">
          <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-4">Plan de pagos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="p-3 rounded-xl bg-blue-50">
              <div className="text-xs text-blue-600">Separación</div>
              <div className="text-lg font-bold text-blue-800">{formatCOP(plan?.separation_value ?? null)}</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50">
              <div className="text-xs text-blue-600">Cuota inicial</div>
              <div className="text-lg font-bold text-blue-800">{formatCOP(q.ci_amount)}</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50">
              <div className="text-xs text-blue-600">{q.ci_installments} cuotas de</div>
              <div className="text-lg font-bold text-blue-800">{formatCOP(q.ci_monthly)}</div>
            </div>
            <div className="p-3 rounded-xl bg-purple-50">
              <div className="text-xs text-purple-600">Financiación</div>
              <div className="text-lg font-bold text-purple-800">{formatCOP(q.financing_amount)}</div>
            </div>
          </div>

          {plan?.ci_schedule && (
            <div className="max-h-64 overflow-auto rounded-xl border border-[var(--color-border)] mb-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-3 font-semibold text-[var(--color-primary)]">#</th>
                    <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Concepto</th>
                    <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Fecha</th>
                    <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.ci_schedule.map((row, i) => (
                    <tr key={i} className={`border-t border-gray-100 ${i === 0 ? 'bg-green-50/50' : ''}`}>
                      <td className="p-3 text-[var(--color-text-light)]">{row.cuota}</td>
                      <td className="p-3">{row.descripcion}</td>
                      <td className="p-3 text-[var(--color-text-light)]">{row.fecha}</td>
                      <td className="p-3 text-right font-medium">{formatCOP(row.valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-purple-50">
              <div className="text-xs text-purple-600">Cuota crédito estimada</div>
              <div className="text-xl font-bold text-purple-800">{formatCOP(q.monthly_payment_est)}</div>
              <div className="text-xs text-purple-500 mt-0.5">Incluye seguros</div>
            </div>
            <div className="p-4 rounded-xl bg-orange-50">
              <div className="text-xs text-orange-600">Ingreso familiar requerido</div>
              <div className="text-xl font-bold text-orange-800">{formatCOP(q.income_required_est)}</div>
            </div>
            {plan && plan.cash_discount_pct > 0 && (
              <div className="p-4 rounded-xl bg-green-50">
                <div className="text-xs text-green-600">De contado ({plan.cash_discount_pct}% dto.)</div>
                <div className="text-xl font-bold text-green-800">{plan.cash_price_fmt}</div>
              </div>
            )}
          </div>

          {plan && plan.appreciation_projection.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-3">
                Proyección de valorización ({plan.appreciation_rate_annual}% anual)
              </h3>
              <div className="flex items-end gap-2 h-32">
                {plan.appreciation_projection.map(v => {
                  const max = plan.appreciation_projection[plan.appreciation_projection.length - 1].value
                  return (
                    <div key={v.year} className="flex-1 flex flex-col items-center">
                      <span className="text-[10px] font-semibold text-[var(--color-primary)] mb-1">{v.value_fmt}</span>
                      <div className="w-full rounded-t-lg bg-[var(--color-accent)]" style={{ height: `${(v.value / max) * 100}%` }} />
                      <span className="text-xs text-[var(--color-text-light)] mt-1">Año {v.year}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="border-t border-[var(--color-border)] p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={`https://wa.me/${wa}?text=${waText}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors">
              Hablar con {q.advisor_name?.split(' ')[0] ?? 'un asesor'}
            </a>
            {q.pdf_url && !expired && (
              <a href={q.pdf_url} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 transition-colors">
                Descargar PDF
              </a>
            )}
            <Link href={`/cotizador?proyecto=${q.project_slug}`}
              className="flex-1 text-center px-6 py-3 rounded-xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-gray-50 transition-colors">
              Crear mi cotización
            </Link>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-[var(--color-text-light)] mt-4 max-w-2xl mx-auto">
        Cotización referencial — no constituye oferta comercial vinculante. Precios y disponibilidad
        sujetos a cambio. La simulación de crédito usa una tasa promedio de mercado; las condiciones
        finales dependen de la entidad financiera.
      </p>
    </div>
  )
}
