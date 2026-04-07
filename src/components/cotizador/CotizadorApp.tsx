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
  type_image_caption: string | null;
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
  saldo_ci_fmt: string;
  ci_installments: number;
  ci_monthly: number;
  ci_monthly_fmt: string;
  ci_target_date: string;
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
  unit: {
    id: number;
    unit_code: string;
    unit_type: string | null;
    area_total_m2: string | null;
    area_private_m2: string | null;
    area_terrace_m2: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    has_parking: boolean;
    has_storage: boolean;
  };
  project: {
    slug: string;
    name: string;
    logo_url: string | null;
    delivery_date_text: string | null;
  };
  payment_plan: PaymentPlan;
}

// ============================================================
// Helpers
// ============================================================

function formatCOP(n: number | string): string {
  const num = typeof n === 'string' ? parseInt(n) : n;
  return '$' + Math.round(num).toLocaleString('es-CO');
}

function formatArea(m2: string | null): string {
  if (!m2) return '—';
  return parseFloat(m2).toLocaleString('es-CO', { maximumFractionDigits: 0 }) + ' m²';
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  parcelacion: 'Parcelación',
  vertical: 'Vertical',
  mixto: 'Mixto',
};

// ============================================================
// Component
// ============================================================

export default function CotizadorApp({ initialSlug }: { initialSlug?: string }) {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [calcResult, setCalcResult] = useState<CalculateResponse | null>(null);
  const [loading, setLoading] = useState({ projects: true, units: false, calc: false });
  const [activeTab, setActiveTab] = useState<'plan' | 'credito'>('plan');
  const [savingQuote, setSavingQuote] = useState(false);
  const [savedCode, setSavedCode] = useState<string | null>(null);

  // Client form
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // --------------------------------------------------------
  // Load projects
  // --------------------------------------------------------
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

  // --------------------------------------------------------
  // Load units when project changes
  // --------------------------------------------------------
  useEffect(() => {
    if (!selectedProject) { setUnits([]); return; }
    setLoading(l => ({ ...l, units: true }));
    setSelectedUnit(null);
    setCalcResult(null);
    setSavedCode(null);
    fetch(`/api/quotation/units?project_slug=${selectedProject.slug}`)
      .then(r => r.json())
      .then((data: Unit[]) => {
        setUnits(data);
        setLoading(l => ({ ...l, units: false }));
      })
      .catch(() => setLoading(l => ({ ...l, units: false })));
  }, [selectedProject]);

  // --------------------------------------------------------
  // Calculate when unit is selected
  // --------------------------------------------------------
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
      .then((data: CalculateResponse) => {
        setCalcResult(data);
        setLoading(l => ({ ...l, calc: false }));
      })
      .catch(() => setLoading(l => ({ ...l, calc: false })));
  }, [selectedUnit]);

  // --------------------------------------------------------
  // Save quotation
  // --------------------------------------------------------
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

  // Group units by type for display
  const unitTypes = useMemo(() => {
    const types = new Map<string, Unit[]>();
    units.forEach(u => {
      const key = u.unit_type || 'General';
      if (!types.has(key)) types.set(key, []);
      types.get(key)!.push(u);
    });
    return types;
  }, [units]);

  const isParcelacion = selectedProject?.project_type === 'parcelacion';

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ---- Header ---- */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
            Cotizador
          </h1>
          <p className="mt-2 text-[var(--color-text-light)]">
            Selecciona un proyecto y una unidad para ver tu plan de pagos personalizado.
          </p>
        </div>

        {/* ---- Step 1: Project selector ---- */}
        {loading.projects ? (
          <div className="text-center py-12 text-[var(--color-text-light)]">Cargando proyectos...</div>
        ) : (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-[var(--color-text-light)] uppercase tracking-wide mb-4">
              1. Elige tu proyecto
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {projects.map(p => {
                const avail = parseInt(p.units_available);
                const isSelected = selectedProject?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    disabled={avail === 0}
                    className={`relative text-left p-5 rounded-2xl border-2 transition-all
                      ${isSelected
                        ? 'border-[var(--color-accent)] bg-[var(--color-primary)] text-white shadow-lg'
                        : avail === 0
                          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                          : 'border-[var(--color-border)] bg-white hover:border-[var(--color-accent)] hover:shadow-md'
                      }`}
                  >
                    {p.cover_image_url && (
                      <div className="mb-3 rounded-xl overflow-hidden aspect-[16/9]">
                        <img
                          src={p.cover_image_url}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-bold text-lg leading-tight">{p.name}</h3>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-gray-300' : 'text-[var(--color-text-light)]'}`}>
                      {p.location}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isSelected ? 'bg-[var(--color-accent)] text-[var(--color-primary)]' : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                      }`}>
                        {PROJECT_TYPE_LABELS[p.project_type] || p.project_type}
                      </span>
                      <span className={`text-xs ${isSelected ? 'text-gray-400' : 'text-[var(--color-text-light)]'}`}>
                        {avail > 0 ? `${avail} disponibles` : 'Sin disponibilidad'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---- Step 2: Unit selector ---- */}
        {selectedProject && (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-[var(--color-text-light)] uppercase tracking-wide mb-4">
              2. Elige tu {isParcelacion ? 'lote' : 'unidad'}
            </h2>

            {loading.units ? (
              <div className="text-center py-8 text-[var(--color-text-light)]">Cargando unidades...</div>
            ) : units.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-text-light)]">
                No hay unidades disponibles en este proyecto.
              </div>
            ) : (
              <>
                {/* Unit type groups */}
                {Array.from(unitTypes.entries()).map(([type, typeUnits]) => (
                  <div key={type} className="mb-6">
                    {unitTypes.size > 1 && (
                      <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-3">
                        {type}
                        <span className="ml-2 text-[var(--color-text-light)] font-normal">
                          ({typeUnits.length} {typeUnits.length === 1 ? 'unidad' : 'unidades'})
                        </span>
                      </h3>
                    )}
                    <div className={`grid gap-3 ${
                      isParcelacion
                        ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6'
                        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                    }`}>
                      {typeUnits.map(u => {
                        const isUnitSelected = selectedUnit?.id === u.id;
                        return (
                          <button
                            key={u.id}
                            onClick={() => setSelectedUnit(u)}
                            className={`relative p-4 rounded-xl border-2 transition-all text-left
                              ${isUnitSelected
                                ? 'border-[var(--color-accent)] bg-[var(--color-primary)] text-white'
                                : 'border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]'
                              }`}
                          >
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-green-500" />
                            <div className="font-bold text-sm">{u.unit_code}</div>
                            {isParcelacion ? (
                              <div className={`text-xs mt-1 ${isUnitSelected ? 'text-gray-300' : 'text-[var(--color-text-light)]'}`}>
                                {formatArea(u.area_total_m2)}
                              </div>
                            ) : (
                              <div className={`text-xs mt-1 space-y-0.5 ${isUnitSelected ? 'text-gray-300' : 'text-[var(--color-text-light)]'}`}>
                                {u.area_private_m2 && <div>{formatArea(u.area_private_m2)} priv.</div>}
                                {u.area_terrace_m2 && <div>+ {formatArea(u.area_terrace_m2)} terraza</div>}
                                {u.tower && <div>{u.tower}</div>}
                              </div>
                            )}
                            <div className={`text-xs font-semibold mt-1 ${isUnitSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent)]'}`}>
                              {formatCOP(u.list_price)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ---- Step 3: Payment plan ---- */}
        {loading.calc && (
          <div className="text-center py-12 text-[var(--color-text-light)]">Calculando plan de pagos...</div>
        )}

        {calcResult && selectedUnit && selectedProject && (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-[var(--color-text-light)] uppercase tracking-wide mb-4">
              3. Tu plan de pagos
            </h2>

            <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">

              {/* Header */}
              <div className="bg-[var(--color-primary)] p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedUnit.unit_code} — {calcResult.project.name}</h3>
                    <p className="text-gray-300 mt-1">
                      {isParcelacion
                        ? `${formatArea(selectedUnit.area_total_m2)} | Tipo ${selectedUnit.unit_type || '—'}`
                        : `${formatArea(selectedUnit.area_private_m2)} priv. ${selectedUnit.area_terrace_m2 ? `+ ${formatArea(selectedUnit.area_terrace_m2)} terraza` : ''} | ${selectedUnit.unit_type || '—'}`
                      }
                      {calcResult.project.delivery_date_text ? ` | ${calcResult.project.delivery_date_text}` : ''}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-sm text-gray-400">Precio</div>
                    <div className="text-3xl font-bold text-[var(--color-accent)]">{calcResult.payment_plan.list_price_fmt}</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-[var(--color-border)] flex">
                <button
                  onClick={() => setActiveTab('plan')}
                  className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                    activeTab === 'plan'
                      ? 'bg-[var(--color-accent)] text-[var(--color-primary)]'
                      : 'text-[var(--color-text-light)] hover:bg-gray-50'
                  }`}
                >
                  Plan de pagos
                </button>
                <button
                  onClick={() => setActiveTab('credito')}
                  className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                    activeTab === 'credito'
                      ? 'bg-[var(--color-accent)] text-[var(--color-primary)]'
                      : 'text-[var(--color-text-light)] hover:bg-gray-50'
                  }`}
                >
                  Simulación crédito
                </button>
              </div>

              <div className="p-6">

                {/* Tab: Plan de pagos */}
                {activeTab === 'plan' && (
                  <div>
                    {/* Summary cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      <div className="p-4 rounded-xl bg-blue-50">
                        <div className="text-xs text-blue-600">Separación</div>
                        <div className="text-lg font-bold text-blue-800">{calcResult.payment_plan.separation_value_fmt}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-50">
                        <div className="text-xs text-blue-600">Cuota inicial ({calcResult.payment_plan.ci_percentage}%)</div>
                        <div className="text-lg font-bold text-blue-800">{calcResult.payment_plan.ci_amount_fmt}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-50">
                        <div className="text-xs text-blue-600">{calcResult.payment_plan.ci_installments} cuotas de</div>
                        <div className="text-lg font-bold text-blue-800">{calcResult.payment_plan.ci_monthly_fmt}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-purple-50">
                        <div className="text-xs text-purple-600">Financiación ({100 - calcResult.payment_plan.ci_percentage}%)</div>
                        <div className="text-lg font-bold text-purple-800">{calcResult.payment_plan.financing_amount_fmt}</div>
                      </div>
                    </div>

                    {/* Schedule table */}
                    <div className="max-h-72 overflow-auto rounded-xl border border-[var(--color-border)]">
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

                    <p className="text-xs text-[var(--color-text-light)] mt-3">
                      Meta cuota inicial: {calcResult.payment_plan.ci_target_date}.
                      Calculado el {calcResult.payment_plan.calculation_date_fmt}.
                    </p>
                  </div>
                )}

                {/* Tab: Simulación crédito */}
                {activeTab === 'credito' && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-purple-50">
                        <div className="text-xs text-purple-600">Monto a financiar</div>
                        <div className="text-xl font-bold text-purple-800">{calcResult.payment_plan.financing_amount_fmt}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-purple-50">
                        <div className="text-xs text-purple-600">Cuota mensual estimada</div>
                        <div className="text-xl font-bold text-purple-800">{calcResult.payment_plan.total_monthly_fmt}</div>
                        <div className="text-xs text-purple-500 mt-1">Incluye seguros</div>
                      </div>
                      <div className="p-4 rounded-xl bg-orange-50">
                        <div className="text-xs text-orange-600">Ingreso familiar requerido</div>
                        <div className="text-xl font-bold text-orange-800">{calcResult.payment_plan.income_required_fmt}</div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--color-border)] p-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-light)]">Tasa de referencia (E.A.)</span>
                        <span className="font-semibold">{calcResult.payment_plan.reference_rate_ea}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-light)]">Plazo</span>
                        <span className="font-semibold">{calcResult.payment_plan.loan_term_years} años ({calcResult.payment_plan.loan_term_months} meses)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-light)]">Cuota capital + intereses</span>
                        <span className="font-semibold">{calcResult.payment_plan.monthly_base_payment_fmt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-light)]">Seguro de vida (ref.)</span>
                        <span className="font-semibold">{formatCOP(calcResult.payment_plan.life_insurance_monthly)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-light)]">Seguro incendio/terremoto (ref.)</span>
                        <span className="font-semibold">{formatCOP(calcResult.payment_plan.fire_insurance_monthly)}</span>
                      </div>
                      <div className="border-t border-[var(--color-border)] pt-3 flex justify-between">
                        <span className="font-semibold text-[var(--color-primary)]">Total estimado mensual</span>
                        <span className="font-bold text-lg text-[var(--color-primary)]">{calcResult.payment_plan.total_monthly_fmt}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--color-text-light)] mt-4">
                      * Simulación referencial con tasa promedio de mercado ({calcResult.payment_plan.reference_rate_ea}% E.A.).
                      La tasa y condiciones finales dependen de la entidad financiera y el perfil crediticio del comprador.
                      Valores sujetos a cambio.
                    </p>
                  </div>
                )}
              </div>

              {/* Client data (optional) */}
              <div className="border-t border-[var(--color-border)] p-6 bg-gray-50/50">
                <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-3">
                  Datos de contacto <span className="font-normal text-[var(--color-text-light)]">(opcional)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono / WhatsApp"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-[var(--color-border)] p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/573022343659?text=${encodeURIComponent(
                      `Hola, me interesa ${selectedUnit.unit_code} del proyecto ${calcResult.project.name}. Precio: ${calcResult.payment_plan.list_price_fmt}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
                  >
                    Escribir por WhatsApp
                  </a>
                  <button
                    onClick={handleSaveQuote}
                    disabled={savingQuote || !!savedCode}
                    className="flex-1 text-center px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 transition-colors disabled:opacity-50"
                  >
                    {savedCode ? `Guardada: ${savedCode}` : savingQuote ? 'Guardando...' : 'Guardar cotización'}
                  </button>
                </div>
                {savedCode && (
                  <p className="text-sm text-green-600 mt-3 text-center">
                    Cotización guardada con código <strong>{savedCode}</strong>. Un asesor se comunicará contigo pronto.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---- Disclaimer ---- */}
        {calcResult && (
          <div className="text-center text-xs text-[var(--color-text-light)] mt-6 max-w-2xl mx-auto">
            Esta cotización es referencial y no constituye una oferta comercial vinculante.
            Los precios, condiciones y disponibilidad están sujetos a cambio sin previo aviso.
            La simulación de crédito hipotecario usa tasas promedio de mercado y no representa
            una aprobación bancaria.
          </div>
        )}

      </div>
    </section>
  );
}
