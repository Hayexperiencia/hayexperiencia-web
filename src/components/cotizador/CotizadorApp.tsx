'use client';

import { useState, useEffect, useMemo } from 'react';

// ============================================================
// Types
// ============================================================

interface Project {
  id: number;
  slug: string;
  name: string;
  project_type: string;
  status: string;
  location: string;
  delivery_date_text: string;
  cover_image_url: string | null;
  logo_url: string | null;
  description: string | null;
  separation_value: string;
  ci_percentage: string;
  units_available: string;
  stages: { id: number; name: string; stage_order: number }[];
}

interface Unit {
  id: number;
  unit_code: string;
  unit_type: string | null;
  tower: string | null;
  area_total_m2: string | null;
  area_private_m2: string | null;
  area_terrace_m2: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  has_parking: boolean;
  has_storage: boolean;
  list_price: string;
  unit_status: string;
  stage_name: string | null;
  resolved_image_url: string | null;
}

interface CalcUnit {
  id: number;
  unit_code: string;
  unit_type: string | null;
  area_total_m2: string | null;
  area_private_m2: string | null;
  area_built_m2: string | null;
  area_terrace_m2: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  has_parking: boolean;
  has_storage: boolean;
  description: string | null;
  resolved_image_url: string | null;
}

interface CalcProject {
  slug: string;
  name: string;
  logo_url: string | null;
  delivery_date_text: string | null;
  description: string | null;
  cover_image_url: string | null;
  location: string | null;
}

interface PaymentPlan {
  list_price: number;
  list_price_fmt: string;
  separation_value: number;
  separation_value_fmt: string;
  ci_percentage: number;
  ci_amount: number;
  ci_amount_fmt: string;
  saldo_ci: number;
  ci_installments: number;
  ci_monthly: number;
  ci_monthly_fmt: string;
  ci_target_date: string;
  ci_target_date_iso: string;
  ci_schedule: { cuota: number; descripcion: string; fecha: string; valor: number }[];
  financing_amount: number;
  financing_amount_fmt: string;
  loan_term_years: number;
  loan_term_months: number;
  reference_rate_ea: number;
  monthly_base_payment: number;
  monthly_base_payment_fmt: string;
  life_insurance_monthly: number;
  fire_insurance_monthly: number;
  total_monthly_with_insurance: number;
  total_monthly_fmt: string;
  income_required: number;
  income_required_fmt: string;
  calculation_date_fmt: string;
}

interface CalculateResponse {
  unit: CalcUnit;
  project: CalcProject;
  payment_plan: PaymentPlan;
}

function formatCOP(n: number | string): string {
  const num = typeof n === 'string' ? parseInt(n) : n;
  return '$' + Math.round(num).toLocaleString('es-CO');
}

function formatArea(m2: string | null): string {
  if (!m2) return '—';
  return parseFloat(m2).toLocaleString('es-CO', { maximumFractionDigits: 0 }) + ' m²';
}

// ============================================================
// Component
// ============================================================

export default function CotizadorApp({ initialSlug }: { initialSlug?: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [calcResult, setCalcResult] = useState<CalculateResponse | null>(null);
  const [loading, setLoading] = useState({ projects: true, units: false, calc: false });
  const [savingQuote, setSavingQuote] = useState(false);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const isEmbedded = !!initialSlug;
  const isParcelacion = selectedProject?.project_type === 'parcelacion';

  // Load projects
  useEffect(() => {
    fetch('/api/quotation/projects')
      .then(r => r.json())
      .then((data: Project[]) => {
        setProjects(data);
        if (initialSlug) {
          const match = data.find(p => p.slug === initialSlug);
          if (match) setSelectedProject(match);
        }
        setLoading(l => ({ ...l, projects: false }));
      })
      .catch(() => setLoading(l => ({ ...l, projects: false })));
  }, [initialSlug]);

  // Load units
  useEffect(() => {
    if (!selectedProject) { setUnits([]); return; }
    setLoading(l => ({ ...l, units: true }));
    setSelectedUnit(null);
    setCalcResult(null);
    setSavedCode(null);
    fetch(`/api/quotation/units?project_slug=${selectedProject.slug}`)
      .then(r => r.json())
      .then((data: Unit[]) => { setUnits(data); setLoading(l => ({ ...l, units: false })); })
      .catch(() => setLoading(l => ({ ...l, units: false })));
  }, [selectedProject]);

  // Calculate
  useEffect(() => {
    if (!selectedUnit) { setCalcResult(null); return; }
    setLoading(l => ({ ...l, calc: true }));
    setSavedCode(null);
    fetch('/api/quotation/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unit_id: selectedUnit.id }),
    })
      .then(r => r.json())
      .then((data: CalculateResponse) => { setCalcResult(data); setLoading(l => ({ ...l, calc: false })); })
      .catch(() => setLoading(l => ({ ...l, calc: false })));
  }, [selectedUnit]);

  // Save quotation
  async function handleSaveQuote() {
    if (!calcResult || !selectedUnit || !selectedProject) return;
    setSavingQuote(true);
    try {
      const res = await fetch('/api/quotation/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_id: selectedUnit.id,
          project_id: selectedProject.id,
          payment_plan: calcResult.payment_plan,
          client_data: clientName ? { name: clientName, phone: clientPhone, email: clientEmail } : null,
          channel: 'web',
        }),
      });
      const data = await res.json();
      if (data.quotation_code) setSavedCode(data.quotation_code);
    } catch { /* ignore */ }
    setSavingQuote(false);
  }

  // Download PDF
  async function handleDownloadPdf() {
    if (!calcResult) return;
    setDownloadingPdf(true);
    try {
      const res = await fetch('/api/quotation/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit: calcResult.unit,
          project: calcResult.project,
          payment_plan: calcResult.payment_plan,
          quotation_code: savedCode || undefined,
          client_name: clientName || undefined,
          client_phone: clientPhone || undefined,
          client_email: clientEmail || undefined,
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${savedCode || 'HEI'}-${calcResult.unit.unit_code.replace(/\s+/g, '')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch { /* ignore */ }
    setDownloadingPdf(false);
  }

  // Group units by type
  const unitTypes = useMemo(() => {
    const types = new Map<string, Unit[]>();
    units.forEach(u => {
      const key = u.unit_type || 'General';
      if (!types.has(key)) types.set(key, []);
      types.get(key)!.push(u);
    });
    return types;
  }, [units]);

  const stepNum = (n: number) => isEmbedded ? n - 1 : n;

  // ============================================================
  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ---- Header ---- */}
        {!isEmbedded && (
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">Cotizador</h1>
            <p className="mt-2 text-[var(--color-text-light)]">
              Selecciona un proyecto y una unidad para ver tu plan de pagos personalizado.
            </p>
          </div>
        )}

        {/* ---- Datos de contacto (arriba) ---- */}
        <div className="mb-8 bg-white rounded-2xl border border-[var(--color-border)] p-5">
          <h2 className="text-sm font-semibold text-[var(--color-primary)] mb-3">
            Tus datos <span className="font-normal text-[var(--color-text-light)]">(opcional — para guardar y recibir tu cotización)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="text" placeholder="Nombre completo" value={clientName} onChange={e => setClientName(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" />
            <input type="tel" placeholder="Teléfono / WhatsApp" value={clientPhone} onChange={e => setClientPhone(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" />
            <input type="email" placeholder="Correo electrónico" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" />
          </div>
        </div>

        {/* ---- Step 1: Project selector ---- */}
        {!isEmbedded && (
          loading.projects ? (
            <div className="text-center py-12 text-[var(--color-text-light)]">Cargando proyectos...</div>
          ) : (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-[var(--color-text-light)] uppercase tracking-wide mb-4">1. Elige tu proyecto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {projects.map(p => {
                  const avail = parseInt(p.units_available);
                  const isSel = selectedProject?.id === p.id;
                  return (
                    <button key={p.id} onClick={() => setSelectedProject(p)} disabled={avail === 0}
                      className={`relative text-left p-4 rounded-2xl border-2 transition-all ${isSel ? 'border-[var(--color-accent)] bg-[var(--color-primary)] text-white shadow-lg' : avail === 0 ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' : 'border-[var(--color-border)] bg-white hover:border-[var(--color-accent)] hover:shadow-md'}`}>
                      {p.cover_image_url && <div className="mb-3 rounded-xl overflow-hidden aspect-[16/9]"><img src={p.cover_image_url} alt={p.name} className="w-full h-full object-cover" /></div>}
                      <h3 className="font-bold text-base leading-tight">{p.name}</h3>
                      <p className={`text-xs mt-1 ${isSel ? 'text-gray-300' : 'text-[var(--color-text-light)]'}`}>{p.location}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs font-semibold ${isSel ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent)]'}`}>{avail > 0 ? `${avail} disponibles` : 'Agotado'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )
        )}

        {/* ---- Project info card (cuando se selecciona) ---- */}
        {selectedProject && (
          <div className="mb-8 bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {selectedProject.cover_image_url && (
                <div className="sm:w-1/3">
                  <img src={selectedProject.cover_image_url} alt={selectedProject.name} className="w-full h-48 sm:h-full object-cover" />
                </div>
              )}
              <div className="flex-1 p-6">
                <div className="flex items-start gap-4 mb-3">
                  {selectedProject.logo_url && <img src={selectedProject.logo_url} alt="" className="h-10 object-contain" />}
                  <div>
                    <h3 className="font-bold text-xl text-[var(--color-primary)]">{selectedProject.name}</h3>
                    <p className="text-sm text-[var(--color-text-light)]">{selectedProject.location} {selectedProject.delivery_date_text ? `| ${selectedProject.delivery_date_text}` : ''}</p>
                  </div>
                </div>
                {selectedProject.description && <p className="text-sm text-[var(--color-text)] leading-relaxed">{selectedProject.description}</p>}
                <div className="flex gap-4 mt-3 text-xs text-[var(--color-text-light)]">
                  <span>Separación: <strong className="text-[var(--color-primary)]">{formatCOP(selectedProject.separation_value)}</strong></span>
                  <span>CI: <strong className="text-[var(--color-primary)]">{selectedProject.ci_percentage}%</strong></span>
                  <span><strong className="text-green-700">{selectedProject.units_available}</strong> disponibles</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---- Step 2: Unit selector ---- */}
        {selectedProject && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[var(--color-text-light)] uppercase tracking-wide mb-4">
              {stepNum(2)}. Elige tu {isParcelacion ? 'lote' : 'unidad'}
            </h2>
            {loading.units ? (
              <div className="text-center py-8 text-[var(--color-text-light)]">Cargando unidades...</div>
            ) : units.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-text-light)]">No hay unidades disponibles.</div>
            ) : (
              Array.from(unitTypes.entries()).map(([type, typeUnits]) => (
                <div key={type} className="mb-4">
                  {unitTypes.size > 1 && (
                    <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-2">{type} <span className="text-[var(--color-text-light)] font-normal">({typeUnits.length})</span></h3>
                  )}
                  <div className={`grid gap-3 ${isParcelacion ? 'grid-cols-3 sm:grid-cols-5 lg:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
                    {typeUnits.map(u => {
                      const isSel = selectedUnit?.id === u.id;
                      return (
                        <button key={u.id} onClick={() => setSelectedUnit(u)}
                          className={`relative p-3 rounded-xl border-2 transition-all text-left ${isSel ? 'border-[var(--color-accent)] bg-[var(--color-primary)] text-white' : 'border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]'}`}>
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500" />
                          <div className="font-bold text-sm">{u.unit_code}</div>
                          <div className={`text-xs mt-0.5 ${isSel ? 'text-gray-300' : 'text-[var(--color-text-light)]'}`}>
                            {formatArea(u.area_total_m2 || u.area_private_m2)}
                          </div>
                          <div className={`text-xs font-semibold mt-0.5 ${isSel ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent)]'}`}>
                            {formatCOP(u.list_price)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ---- Loading calc ---- */}
        {loading.calc && <div className="text-center py-12 text-[var(--color-text-light)]">Calculando plan de pagos...</div>}

        {/* ---- Step 3: Results ---- */}
        {calcResult && selectedUnit && selectedProject && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[var(--color-text-light)] uppercase tracking-wide mb-4">
              {stepNum(3)}. Tu cotización
            </h2>

            <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">

              {/* Unit image + info */}
              {calcResult.unit.resolved_image_url && (
                <img src={calcResult.unit.resolved_image_url} alt={calcResult.unit.unit_code} className="w-full h-48 sm:h-56 object-cover" />
              )}

              {/* Header */}
              <div className="bg-[var(--color-primary)] p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedUnit.unit_code} — {calcResult.project.name}</h3>
                    <p className="text-gray-300 mt-1 text-sm">
                      {isParcelacion
                        ? `${formatArea(selectedUnit.area_total_m2)} | Tipo ${selectedUnit.unit_type || '—'}`
                        : `${formatArea(selectedUnit.area_private_m2)} priv. ${selectedUnit.area_terrace_m2 ? `+ ${formatArea(selectedUnit.area_terrace_m2)} terraza` : ''} | ${selectedUnit.unit_type || '—'}`}
                      {calcResult.project.delivery_date_text ? ` | ${calcResult.project.delivery_date_text}` : ''}
                    </p>
                    {calcResult.unit.description && <p className="text-gray-400 mt-2 text-xs">{calcResult.unit.description}</p>}
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-gray-400">Precio</div>
                    <div className="text-3xl font-bold text-[var(--color-accent)]">{calcResult.payment_plan.list_price_fmt}</div>
                  </div>
                </div>
              </div>

              {/* ---- Plan de pagos ---- */}
              <div className="p-6">
                <h4 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-4">Plan de pagos</h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-blue-50">
                    <div className="text-xs text-blue-600">Separación</div>
                    <div className="text-lg font-bold text-blue-800">{calcResult.payment_plan.separation_value_fmt}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50">
                    <div className="text-xs text-blue-600">Cuota inicial ({calcResult.payment_plan.ci_percentage}%)</div>
                    <div className="text-lg font-bold text-blue-800">{calcResult.payment_plan.ci_amount_fmt}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50">
                    <div className="text-xs text-blue-600">{calcResult.payment_plan.ci_installments} cuotas de</div>
                    <div className="text-lg font-bold text-blue-800">{calcResult.payment_plan.ci_monthly_fmt}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50">
                    <div className="text-xs text-purple-600">Financiación ({100 - calcResult.payment_plan.ci_percentage}%)</div>
                    <div className="text-lg font-bold text-purple-800">{calcResult.payment_plan.financing_amount_fmt}</div>
                  </div>
                </div>

                <div className="max-h-64 overflow-auto rounded-xl border border-[var(--color-border)] mb-3">
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
                      {calcResult.payment_plan.ci_schedule.map((row, i) => (
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
                <p className="text-xs text-[var(--color-text-light)]">Meta cuota inicial: {calcResult.payment_plan.ci_target_date}. Calculado el {calcResult.payment_plan.calculation_date_fmt}.</p>
              </div>

              {/* ---- Simulación crédito (inline, sin tab) ---- */}
              <div className="border-t border-[var(--color-border)] p-6">
                <h4 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-4">Simulación de crédito hipotecario</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="p-4 rounded-xl bg-purple-50">
                    <div className="text-xs text-purple-600">Monto a financiar</div>
                    <div className="text-xl font-bold text-purple-800">{calcResult.payment_plan.financing_amount_fmt}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-50">
                    <div className="text-xs text-purple-600">Cuota mensual estimada</div>
                    <div className="text-xl font-bold text-purple-800">{calcResult.payment_plan.total_monthly_fmt}</div>
                    <div className="text-xs text-purple-500 mt-0.5">Incluye seguros</div>
                  </div>
                  <div className="p-4 rounded-xl bg-orange-50">
                    <div className="text-xs text-orange-600">Ingreso familiar requerido</div>
                    <div className="text-xl font-bold text-orange-800">{calcResult.payment_plan.income_required_fmt}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--color-text-light)]">Tasa de referencia (E.A.)</span><span className="font-semibold">{calcResult.payment_plan.reference_rate_ea}%</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-light)]">Plazo</span><span className="font-semibold">{calcResult.payment_plan.loan_term_years} años ({calcResult.payment_plan.loan_term_months} meses)</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-light)]">Cuota capital + intereses</span><span className="font-semibold">{calcResult.payment_plan.monthly_base_payment_fmt}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-light)]">Seguro de vida (ref.)</span><span className="font-semibold">{formatCOP(calcResult.payment_plan.life_insurance_monthly)}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-light)]">Seguro incendio/terremoto (ref.)</span><span className="font-semibold">{formatCOP(calcResult.payment_plan.fire_insurance_monthly)}</span></div>
                  <div className="border-t border-[var(--color-border)] pt-2 flex justify-between">
                    <span className="font-semibold text-[var(--color-primary)]">Total estimado mensual</span>
                    <span className="font-bold text-lg text-[var(--color-primary)]">{calcResult.payment_plan.total_monthly_fmt}</span>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-text-light)] mt-3">
                  * Simulación referencial con tasa promedio de mercado ({calcResult.payment_plan.reference_rate_ea}% E.A.).
                  Condiciones finales dependen de la entidad financiera y perfil crediticio.
                </p>
              </div>

              {/* ---- Actions ---- */}
              <div className="border-t border-[var(--color-border)] p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => { handleSaveQuote(); }}
                    disabled={savingQuote || !!savedCode}
                    className="flex-1 text-center px-6 py-3 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-bold hover:bg-[var(--color-accent-light)] transition-colors disabled:opacity-50">
                    {savedCode ? `Guardada: ${savedCode}` : savingQuote ? 'Guardando...' : 'Guardar cotización'}
                  </button>
                  <button onClick={handleDownloadPdf} disabled={downloadingPdf}
                    className="flex-1 text-center px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 transition-colors disabled:opacity-50">
                    {downloadingPdf ? 'Generando PDF...' : 'Descargar PDF'}
                  </button>
                  <a href={`https://wa.me/573022343659?text=${encodeURIComponent(`Hola, me interesa ${selectedUnit.unit_code} del proyecto ${calcResult.project.name}. Precio: ${calcResult.payment_plan.list_price_fmt}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors">
                    WhatsApp
                  </a>
                </div>
                {savedCode && (
                  <p className="text-sm text-green-600 mt-3 text-center">
                    Cotización <strong>{savedCode}</strong> guardada. Un asesor se comunicará contigo.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---- Disclaimer ---- */}
        {calcResult && (
          <div className="text-center text-xs text-[var(--color-text-light)] mt-4 max-w-2xl mx-auto">
            Esta cotización es referencial y no constituye una oferta comercial vinculante.
            Precios, condiciones y disponibilidad sujetos a cambio sin previo aviso.
          </div>
        )}
      </div>
    </section>
  );
}
