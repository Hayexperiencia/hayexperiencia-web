'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { generatePaymentPlan, type PaymentPlan, type PlanOverrides } from '@/lib/quotation-engine';
import { formatCOP } from '@/lib/format';
import { buildEngineInput, formatArea, pricePerM2, sendTrack, type Project, type Unit } from './types';

/** Slider + campo numerico vinculados (precision + exploracion, patron NN/g). */
function SliderInput({ label, value, min, max, step, suffix, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-[var(--color-primary)]">{label}</label>
        <span className="inline-flex items-center gap-1">
          <input
            type="number" value={value} min={min} max={max} step={step}
            onChange={e => { const n = parseFloat(e.target.value); if (Number.isFinite(n)) onChange(clamp(n)); }}
            className="w-20 rounded-lg border border-[var(--color-border)] px-2 py-1 text-sm text-right font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label={label}
          />
          <span className="text-xs text-[var(--color-text-light)]">{suffix}</span>
        </span>
      </div>
      <input
        type="range" value={value} min={min} max={max} step={step}
        onChange={e => onChange(clamp(parseFloat(e.target.value)))}
        className="w-full accent-[var(--color-accent)]"
        aria-hidden="true"
      />
    </div>
  );
}

export default function PlanPanel({ project, unit, unitDescription, resolvedImageUrl, onRequestQuote }: {
  project: Project;
  unit: Unit;
  unitDescription: string | null;
  resolvedImageUrl: string | null;
  onRequestQuote: (overrides: PlanOverrides | undefined, plan: PaymentPlan) => void;
}) {
  const isParcelacion = project.project_type === 'parcelacion';
  const baseInput = useMemo(() => buildEngineInput(project, Number(unit.list_price)), [project, unit.list_price]);
  const basePlan = useMemo(() => generatePaymentPlan(baseInput), [baseInput]);

  const [tab, setTab] = useState<'financiado' | 'contado'>('financiado');
  const [ciPct, setCiPct] = useState(basePlan.ci_percentage);
  const [ciCuotas, setCiCuotas] = useState(basePlan.ci_installments);
  const [plazo, setPlazo] = useState(basePlan.loan_term_years);
  const [tasa, setTasa] = useState(basePlan.reference_rate_ea);
  const [ingreso, setIngreso] = useState('');
  const [showAmort, setShowAmort] = useState(false);

  // Al cambiar de unidad, resetear los ajustes al plan base del proyecto
  useEffect(() => {
    setCiPct(basePlan.ci_percentage);
    setCiCuotas(basePlan.ci_installments);
    setPlazo(basePlan.loan_term_years);
    setTasa(basePlan.reference_rate_ea);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit.id]);

  const overrides: PlanOverrides | undefined = useMemo(() => {
    const o: PlanOverrides = {};
    if (ciPct !== basePlan.ci_percentage) o.ci_percentage = ciPct;
    if (ciCuotas !== basePlan.ci_installments) o.ci_installments = ciCuotas;
    if (plazo !== basePlan.loan_term_years) o.loan_term_years = plazo;
    if (tasa !== basePlan.reference_rate_ea) o.reference_rate_ea = tasa;
    return Object.keys(o).length > 0 ? o : undefined;
  }, [ciPct, ciCuotas, plazo, tasa, basePlan]);

  const plan = useMemo(() => generatePaymentPlan(baseInput, undefined, overrides), [baseInput, overrides]);
  const bounds = plan.override_bounds;

  // Track ajustes (debounced) para medir uso real de los sliders
  const adjustTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!overrides) return;
    if (adjustTimer.current) clearTimeout(adjustTimer.current);
    adjustTimer.current = setTimeout(() => {
      sendTrack('plan_adjusted', { project_slug: project.slug, unit_id: unit.id, meta: overrides as Record<string, unknown> });
    }, 1500);
    return () => { if (adjustTimer.current) clearTimeout(adjustTimer.current); };
  }, [overrides, project.slug, unit.id]);

  const ingresoNum = Number(ingreso.replace(/\D/g, ''));
  const pctIngreso = ingresoNum > 0 ? Math.round((plan.total_monthly_with_insurance / ingresoNum) * 100) : null;

  const areaMain = unit.area_total_m2 || unit.area_private_m2;
  const hasContado = plan.cash_discount_pct > 0;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">

      {resolvedImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolvedImageUrl} alt={`${unit.unit_code} — ${project.name}`} loading="lazy" className="w-full h-48 sm:h-56 object-cover" />
      )}

      {/* Header unidad */}
      <div className="bg-[var(--color-primary)] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold">{unit.unit_code} — {project.name}</h3>
            <p className="text-gray-300 mt-1 text-sm">
              {isParcelacion
                ? `${formatArea(unit.area_total_m2)} | ${pricePerM2(unit.list_price, areaMain)}`
                : [
                    unit.area_private_m2 ? `${formatArea(unit.area_private_m2)} priv.` : null,
                    unit.area_built_m2 ? `${formatArea(unit.area_built_m2)} constr.` : null,
                    unit.area_terrace_m2 ? `${formatArea(unit.area_terrace_m2)} terraza` : null,
                    unit.bedrooms ? `${unit.bedrooms} hab` : null,
                    unit.bathrooms ? `${unit.bathrooms} baños` : null,
                    unit.has_parking ? 'Parqueadero' : null,
                    unit.has_storage ? 'Depósito' : null,
                  ].filter(Boolean).join(' | ')}
              {unit.unit_type ? ` | Tipo ${unit.unit_type}` : ''}
              {project.delivery_date_text ? ` | ${project.delivery_date_text}` : ''}
            </p>
            {unitDescription && <p className="text-gray-400 mt-2 text-xs">{unitDescription}</p>}
          </div>
          <div className="text-left sm:text-right shrink-0">
            <div className="text-xs text-gray-400">Precio</div>
            <div className="text-3xl font-bold text-[var(--color-accent)]">{plan.list_price_fmt}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {hasContado && (
        <div className="border-b border-[var(--color-border)] flex">
          <button onClick={() => setTab('financiado')}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${tab === 'financiado' ? 'bg-[var(--color-accent)] text-[var(--color-primary)]' : 'text-[var(--color-text-light)] hover:bg-gray-50'}`}>
            Plan de pagos
          </button>
          <button onClick={() => setTab('contado')}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${tab === 'contado' ? 'bg-[var(--color-accent)] text-[var(--color-primary)]' : 'text-[var(--color-text-light)] hover:bg-gray-50'}`}>
            Pago de contado
          </button>
        </div>
      )}

      {tab === 'contado' && hasContado ? (
        <div className="p-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 mb-4">
            <span className="text-green-800 font-medium">Precio de contado ({plan.cash_discount_pct}% de descuento)</span>
            <span className="text-green-800 font-bold text-2xl">{plan.cash_price_fmt}</span>
          </div>
          <p className="text-sm text-[var(--color-text-light)]">
            Ahorras <strong className="text-green-700">{plan.cash_savings_fmt}</strong> pagando de contado
            frente al precio de lista {plan.list_price_fmt}.
          </p>
        </div>
      ) : (
        <>
          {/* Ajustes del plan */}
          <div className="p-6 bg-gray-50/60 border-b border-[var(--color-border)]">
            <h4 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-4">Ajusta tu plan</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <SliderInput label="Cuota inicial" value={ciPct} min={bounds.ci_percentage.min} max={bounds.ci_percentage.max} step={1} suffix="%" onChange={setCiPct} />
              <SliderInput label="Meses para la cuota inicial" value={ciCuotas} min={bounds.ci_installments.min} max={bounds.ci_installments.max} step={1} suffix="meses" onChange={setCiCuotas} />
              <SliderInput label="Plazo del crédito" value={plazo} min={bounds.loan_term_years.min} max={bounds.loan_term_years.max} step={1} suffix="años" onChange={setPlazo} />
              <SliderInput label="Tasa de interés (E.A.)" value={tasa} min={bounds.reference_rate_ea.min} max={bounds.reference_rate_ea.max} step={0.1} suffix="%" onChange={setTasa} />
            </div>
          </div>

          {/* Plan de pagos */}
          <div className="p-6">
            <h4 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-4">Plan de pagos</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-blue-50">
                <div className="text-xs text-blue-600">Separación</div>
                <div className="text-lg font-bold text-blue-800">{plan.separation_value_fmt}</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <div className="text-xs text-blue-600">Cuota inicial ({plan.ci_percentage}%)</div>
                <div className="text-lg font-bold text-blue-800">{plan.ci_amount_fmt}</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <div className="text-xs text-blue-600">{plan.ci_installments} cuotas de</div>
                <div className="text-lg font-bold text-blue-800">{plan.ci_monthly_fmt}</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-50">
                <div className="text-xs text-purple-600">Financiación ({Math.round(100 - plan.ci_percentage)}%)</div>
                <div className="text-lg font-bold text-purple-800">{plan.financing_amount_fmt}</div>
              </div>
            </div>

            <details className="rounded-xl border border-[var(--color-border)] mb-3 group">
              <summary className="cursor-pointer select-none p-3 text-sm font-semibold text-[var(--color-primary)] hover:bg-gray-50 rounded-xl">
                Ver cronograma de la cuota inicial ({plan.ci_installments} cuotas hasta {plan.ci_target_date})
              </summary>
              <div className="max-h-64 overflow-auto border-t border-[var(--color-border)]">
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
            </details>
          </div>

          {/* Credito */}
          {plan.financing_amount > 0 && (
            <div className="border-t border-[var(--color-border)] p-6">
              <h4 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-4">Simulación de crédito</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-4 rounded-xl bg-purple-50">
                  <div className="text-xs text-purple-600">Monto a financiar</div>
                  <div className="text-xl font-bold text-purple-800">{plan.financing_amount_fmt}</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-50">
                  <div className="text-xs text-purple-600">Cuota mensual estimada</div>
                  <div className="text-xl font-bold text-purple-800">{plan.total_monthly_fmt}</div>
                  <div className="text-xs text-purple-500 mt-0.5">Incluye seguros</div>
                </div>
                <div className="p-4 rounded-xl bg-orange-50">
                  <div className="text-xs text-orange-600">Ingreso familiar requerido</div>
                  <div className="text-xl font-bold text-orange-800">{plan.income_required_fmt}</div>
                </div>
              </div>

              {/* ¿Te alcanza? */}
              <div className="rounded-xl border border-[var(--color-border)] p-4 mb-4">
                <label className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                  ¿Te alcanza? Escribe tu ingreso familiar mensual:
                </label>
                <input
                  type="text" inputMode="numeric" placeholder="Ej: 8.000.000"
                  value={ingreso ? Number(ingreso.replace(/\D/g, '')).toLocaleString('es-CO') : ''}
                  onChange={e => setIngreso(e.target.value)}
                  className="w-full sm:w-64 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
                {pctIngreso !== null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={pctIngreso <= 30 ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}>
                        La cuota sería el {pctIngreso}% de tu ingreso
                      </span>
                      <span className="text-[var(--color-text-light)]">máx. recomendado 30%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pctIngreso <= 30 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, pctIngreso)}%` }}
                      />
                    </div>
                    <p className="text-xs text-[var(--color-text-light)] mt-2">
                      {pctIngreso <= 30
                        ? 'Dentro del límite legal colombiano (la primera cuota no puede superar el 30% del ingreso familiar).'
                        : `Para esta cuota necesitarías un ingreso de ${plan.income_required_fmt}. Prueba más plazo o más cuota inicial.`}
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[var(--color-border)] p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[var(--color-text-light)]">Tasa de referencia (E.A.)</span><span className="font-semibold">{plan.reference_rate_ea}%</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-light)]">Plazo</span><span className="font-semibold">{plan.loan_term_years} años ({plan.loan_term_months} meses)</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-light)]">Cuota capital + intereses</span><span className="font-semibold">{plan.monthly_base_payment_fmt}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-light)]">Seguro de vida (ref.)</span><span className="font-semibold">{formatCOP(plan.life_insurance_monthly)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-light)]">Seguro incendio/terremoto (ref.)</span><span className="font-semibold">{formatCOP(plan.fire_insurance_monthly)}</span></div>
                <div className="border-t border-[var(--color-border)] pt-2 flex justify-between">
                  <span className="font-semibold text-[var(--color-primary)]">Total estimado mensual</span>
                  <span className="font-bold text-lg text-[var(--color-primary)]">{plan.total_monthly_fmt}</span>
                </div>
              </div>

              {plan.amortization_yearly.length > 0 && (
                <button onClick={() => setShowAmort(s => !s)} className="mt-3 text-sm font-medium text-[var(--color-primary)] underline underline-offset-2 hover:text-[var(--color-primary-light)]">
                  {showAmort ? 'Ocultar' : 'Ver'} amortización año a año
                </button>
              )}
              {showAmort && (
                <div className="mt-2 max-h-64 overflow-auto rounded-xl border border-[var(--color-border)]">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Año</th>
                        <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Intereses</th>
                        <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Capital</th>
                        <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.amortization_yearly.map(r => (
                        <tr key={r.year} className="border-t border-gray-100">
                          <td className="p-3">{r.year}</td>
                          <td className="p-3 text-right text-[var(--color-text-light)]">{formatCOP(r.interest_paid)}</td>
                          <td className="p-3 text-right font-medium">{formatCOP(r.principal_paid)}</td>
                          <td className="p-3 text-right text-[var(--color-text-light)]">{formatCOP(r.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="text-xs text-[var(--color-text-light)] mt-3">
                * Simulación referencial con tasa {plan.reference_rate_ea}% E.A. ({plan.calculation_date_fmt}).
                Condiciones finales dependen de la entidad financiera y tu perfil crediticio.
                {isParcelacion ? ' Para lotes, la financiación bancaria puede requerir crédito de libre inversión o leasing sobre otro inmueble.' : ''}
              </p>
            </div>
          )}
        </>
      )}

      {/* Valorizacion */}
      {plan.appreciation_projection.length > 0 && (
        <div className="border-t border-[var(--color-border)] p-6">
          <h4 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-4">
            Proyección de valorización
          </h4>
          <div className="flex items-end gap-2 h-36">
            {plan.appreciation_projection.map(v => {
              const max = plan.appreciation_projection[plan.appreciation_projection.length - 1].value;
              return (
                <div key={v.year} className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-primary)] mb-1">{v.value_fmt}</span>
                  <div className="w-full rounded-t-lg bg-[var(--color-accent)]" style={{ height: `${(v.value / max) * 100}%` }} />
                  <span className="text-xs text-[var(--color-text-light)] mt-1">Año {v.year}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[var(--color-text-light)] mt-3">
            Supuesto: {plan.appreciation_rate_annual}% de valorización anual estimada en la zona.
            Valor proyectado a 5 años: <strong>{plan.appreciation_projection[4]?.value_fmt}</strong>. No es garantía de rentabilidad.
          </p>
        </div>
      )}

      {/* CTA principal */}
      <div className="border-t border-[var(--color-border)] p-6">
        <button
          onClick={() => onRequestQuote(overrides, plan)}
          className="w-full px-6 py-4 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-bold text-lg hover:bg-[var(--color-accent-light)] transition-colors shadow-sm">
          Recibir esta cotización
        </button>
        <p className="text-xs text-center text-[var(--color-text-light)] mt-2">
          PDF con tu plan personalizado + link para compartir. Válida {plan.valid_until_fmt ? `hasta ${plan.valid_until_fmt}` : '15 días'}.
        </p>
      </div>
    </div>
  );
}
