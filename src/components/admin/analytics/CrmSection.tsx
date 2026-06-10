'use client';

import SectionCard from '../mercado/SectionCard';
import { useAnalyticsData } from './useAnalyticsData';
import { formatInt } from '@/lib/format';

interface CrmData {
  ok: boolean;
  contactosTotal: number | null;
  nuevos7d: number;
  nuevos30d: number;
  nuevos30dCapado: boolean;
  porPipeline: Array<{ pipeline: string; total: number }>;
}

export default function CrmSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useAnalyticsData<CrmData>('crm', refreshKey);
  return (
    <SectionCard
      numero={3}
      titulo="CRM GoHighLevel (cuenta Hay Experiencia)"
      pregunta="¿Están entrando leads y dónde se acumulan en el pipeline?"
      loading={loading}
      error={error}
      accion="Complementa el reporte diario de las 22:00 en el grupo Ventas HEI."
      responsable="Cesar"
    >
      {data && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl border border-[var(--color-border)] px-4 py-3">
              <p className="text-xs text-[var(--color-text-light)]">Contactos totales</p>
              <p className="text-2xl font-bold text-[var(--color-primary)]">{data.contactosTotal != null ? formatInt(data.contactosTotal) : '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-[var(--color-border)] px-4 py-3">
              <p className="text-xs text-[var(--color-text-light)]">Nuevos 7d / 30d</p>
              <p className="text-2xl font-bold text-[var(--color-primary)]">
                {formatInt(data.nuevos7d)} / {formatInt(data.nuevos30d)}{data.nuevos30dCapado ? '+' : ''}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Oportunidades abiertas por pipeline</h3>
            <table className="w-full text-xs">
              <tbody>
                {data.porPipeline.map((p) => (
                  <tr key={p.pipeline} className="border-b border-gray-100">
                    <td className="py-1.5">{p.pipeline}</td>
                    <td className="text-right font-mono">{p.total < 0 ? 'error' : formatInt(p.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
