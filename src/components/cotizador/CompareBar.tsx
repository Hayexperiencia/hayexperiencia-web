'use client';

import { useState, useMemo } from 'react';
import { generatePaymentPlan } from '@/lib/quotation-engine';
import { formatCOP } from '@/lib/format';
import { buildEngineInput, formatArea, pricePerM2, type Project, type Unit } from './types';

export default function CompareBar({ project, units, onRemove, onClear, onPick }: {
  project: Project;
  units: Unit[];
  onRemove: (id: number) => void;
  onClear: () => void;
  onPick: (unit: Unit) => void;
}) {
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => units.map(u => {
    const plan = generatePaymentPlan(buildEngineInput(project, Number(u.list_price)));
    return { unit: u, plan };
  }), [project, units]);

  if (units.length === 0) return null;

  const isParcelacion = project.project_type === 'parcelacion';

  return (
    <>
      {/* Barra flotante */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[var(--color-primary)] text-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 max-w-[calc(100vw-2rem)]">
        <span className="text-sm font-semibold whitespace-nowrap">Comparar ({units.length}/3):</span>
        <div className="flex gap-2 overflow-x-auto">
          {units.map(u => (
            <span key={u.id} className="inline-flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1 text-xs whitespace-nowrap">
              {u.unit_code}
              <button onClick={() => onRemove(u.id)} aria-label={`Quitar ${u.unit_code}`} className="text-gray-300 hover:text-white">×</button>
            </span>
          ))}
        </div>
        <button onClick={() => setOpen(true)} disabled={units.length < 2}
          className="px-4 py-1.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-bold disabled:opacity-50 whitespace-nowrap">
          Comparar
        </button>
        <button onClick={onClear} className="text-xs text-gray-300 hover:text-white whitespace-nowrap">Limpiar</button>
      </div>

      {/* Modal comparativo */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-[var(--color-primary)]">Comparador — {project.name}</h3>
              <button onClick={() => setOpen(false)} aria-label="Cerrar" className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[var(--color-border)]">
                    <th className="text-left p-2 text-[var(--color-text-light)] font-medium"></th>
                    {rows.map(({ unit }) => (
                      <th key={unit.id} className="text-center p-2 font-bold text-[var(--color-primary)]">{unit.unit_code}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-2 text-[var(--color-text-light)]">Precio</td>
                    {rows.map(({ unit, plan }) => <td key={unit.id} className="p-2 text-center font-bold">{plan.list_price_fmt}</td>)}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-2 text-[var(--color-text-light)]">Área</td>
                    {rows.map(({ unit }) => <td key={unit.id} className="p-2 text-center">{formatArea(unit.area_total_m2 || unit.area_private_m2)}</td>)}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-2 text-[var(--color-text-light)]">Precio por m²</td>
                    {rows.map(({ unit }) => <td key={unit.id} className="p-2 text-center">{pricePerM2(unit.list_price, unit.area_total_m2 || unit.area_private_m2)}</td>)}
                  </tr>
                  {!isParcelacion && (
                    <tr className="border-b border-gray-100">
                      <td className="p-2 text-[var(--color-text-light)]">Hab / Baños</td>
                      {rows.map(({ unit }) => <td key={unit.id} className="p-2 text-center">{unit.bedrooms ?? '—'} / {unit.bathrooms ?? '—'}</td>)}
                    </tr>
                  )}
                  <tr className="border-b border-gray-100">
                    <td className="p-2 text-[var(--color-text-light)]">Tipo</td>
                    {rows.map(({ unit }) => <td key={unit.id} className="p-2 text-center">{unit.unit_type || '—'}</td>)}
                  </tr>
                  <tr className="border-b border-gray-100 bg-blue-50/40">
                    <td className="p-2 text-[var(--color-text-light)]">Cuota inicial ({rows[0]?.plan.ci_percentage}%)</td>
                    {rows.map(({ unit, plan }) => <td key={unit.id} className="p-2 text-center font-medium">{plan.ci_amount_fmt}</td>)}
                  </tr>
                  <tr className="border-b border-gray-100 bg-blue-50/40">
                    <td className="p-2 text-[var(--color-text-light)]">{rows[0]?.plan.ci_installments} cuotas de</td>
                    {rows.map(({ unit, plan }) => <td key={unit.id} className="p-2 text-center font-medium">{plan.ci_monthly_fmt}</td>)}
                  </tr>
                  <tr className="border-b border-gray-100 bg-purple-50/40">
                    <td className="p-2 text-[var(--color-text-light)]">Cuota crédito est.</td>
                    {rows.map(({ unit, plan }) => <td key={unit.id} className="p-2 text-center font-medium">{plan.total_monthly_fmt}</td>)}
                  </tr>
                  <tr className="border-b border-gray-100 bg-orange-50/40">
                    <td className="p-2 text-[var(--color-text-light)]">Ingreso requerido</td>
                    {rows.map(({ unit, plan }) => <td key={unit.id} className="p-2 text-center">{plan.income_required_fmt}</td>)}
                  </tr>
                  {Number(project.cash_discount_pct) > 0 && (
                    <tr className="border-b border-gray-100 bg-green-50/40">
                      <td className="p-2 text-[var(--color-text-light)]">De contado (-{Number(project.cash_discount_pct)}%)</td>
                      {rows.map(({ unit, plan }) => <td key={unit.id} className="p-2 text-center font-medium text-green-700">{plan.cash_price_fmt}</td>)}
                    </tr>
                  )}
                  <tr>
                    <td className="p-2"></td>
                    {rows.map(({ unit }) => (
                      <td key={unit.id} className="p-2 text-center">
                        <button onClick={() => { setOpen(false); onPick(unit); }}
                          className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] text-xs font-bold hover:bg-[var(--color-accent-light)]">
                          Cotizar esta
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--color-text-light)] mt-3">
              Cuotas calculadas con el plan estándar del proyecto ({formatCOP(Number(project.separation_value))} separación,
              CI {Number(project.ci_percentage)}%, tasa {Number(project.reference_rate_ea)}% E.A.).
            </p>
          </div>
        </div>
      )}
    </>
  );
}
