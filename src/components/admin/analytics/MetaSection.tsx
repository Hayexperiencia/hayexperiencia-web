'use client';

import SectionCard from '../mercado/SectionCard';
import { useAnalyticsData } from './useAnalyticsData';
import { formatInt } from '@/lib/format';

interface MetaData {
  ok: boolean;
  pendiente: boolean;
  capturedAt: string | null;
  payload: {
    pixelEventos7d: Record<string, number>;
    cuentas: Array<{ cuenta: string; currency: string; spend: number; impressions: number; clicks: number; leads: number }>;
  } | null;
}

export default function MetaSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useAnalyticsData<MetaData>('meta', refreshKey);
  return (
    <SectionCard
      numero={7}
      titulo="Meta — Pixel y pauta"
      pregunta="¿El Pixel recibe eventos y qué rinde la pauta activa?"
      loading={loading}
      error={error}
      accion="Costo por lead = gasto / leads. Si leads = 0 con gasto > 0, revisar el objetivo de la campaña."
      responsable="Gabriel"
    >
      {data?.pendiente && (
        <p className="text-sm text-[var(--color-text-light)]">Esperando el primer snapshot (cada 6h).</p>
      )}
      {data?.payload && (
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <h3 className="text-sm font-semibold mb-2">Pauta activa (últimos 30 días)</h3>
            {data.payload.cuentas.length === 0 && (
              <p className="text-xs text-[var(--color-text-light)]">Sin cuentas publicitarias activas.</p>
            )}
            {data.payload.cuentas.map((c) => (
              <div key={c.cuenta} className="bg-gray-50 rounded-xl border border-[var(--color-border)] px-4 py-3 mb-2">
                <p className="text-sm font-medium">{c.cuenta}</p>
                <div className="grid grid-cols-2 gap-x-4 text-xs mt-1">
                  <p>Gasto: <strong>${formatInt(c.spend)} {c.currency}</strong></p>
                  <p>Impresiones: <strong>{formatInt(c.impressions)}</strong></p>
                  <p>Clicks: <strong>{formatInt(c.clicks)}</strong></p>
                  <p>Leads: <strong>{formatInt(c.leads)}</strong>{c.leads > 0 && c.spend > 0 && (
                    <span className="text-[var(--color-text-light)]"> · CPL ${formatInt(Math.round(c.spend / c.leads))}</span>
                  )}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Eventos recibidos por el Pixel (7d)</h3>
            <table className="w-full text-xs">
              <tbody>
                {Object.entries(data.payload.pixelEventos7d).sort((a, b) => b[1] - a[1]).map(([ev, n]) => (
                  <tr key={ev} className="border-b border-gray-100">
                    <td className="py-1.5">{ev}</td>
                    <td className="text-right font-mono">{formatInt(n)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.capturedAt && (
              <p className="text-xs text-[var(--color-text-light)] mt-3">
                Snapshot: {new Date(data.capturedAt).toLocaleString('es-CO')}
              </p>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
