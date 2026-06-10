'use client';

import SectionCard from '../mercado/SectionCard';
import { useAnalyticsData } from './useAnalyticsData';
import { formatInt } from '@/lib/format';

interface VisitasData {
  ok: boolean;
  tendencia: Array<{ dia: string; views: number; sesiones: number }>;
  topProps: Array<{ wasi_id: string; views: number; sesiones: number; ultima: string }>;
  fuentes: Array<{ fuente: string; n: number }>;
  dispositivos: Array<{ device: string; n: number }>;
  ciudades: Array<{ city: string; n: number }>;
}

function MiniBar({ items, labelKey, valueKey }: { items: Array<Record<string, string | number>>; labelKey: string; valueKey: string }) {
  const max = Math.max(...items.map((i) => Number(i[valueKey])), 1);
  return (
    <div className="space-y-1.5">
      {items.map((i) => (
        <div key={String(i[labelKey])} className="flex items-center gap-2 text-xs">
          <span className="w-28 truncate text-[var(--color-text)]">{String(i[labelKey])}</span>
          <div className="flex-1 bg-gray-100 rounded h-3 overflow-hidden">
            <div className="h-3 bg-[var(--color-accent)]/70 rounded" style={{ width: `${(Number(i[valueKey]) / max) * 100}%` }} />
          </div>
          <span className="w-10 text-right font-mono">{formatInt(Number(i[valueKey]))}</span>
        </div>
      ))}
    </div>
  );
}

export default function VisitasSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useAnalyticsData<VisitasData>('visitas', refreshKey);
  return (
    <SectionCard
      numero={1}
      titulo="Visitas a propiedades (analytics propio)"
      pregunta="¿Qué propiedades miran, desde dónde llegan y en qué dispositivo?"
      loading={loading}
      error={error}
      accion="Las propiedades top en vistas sin cotización merecen revisión de precio/fotos."
      responsable="Cesar"
    >
      {data && (
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <h3 className="text-sm font-semibold mb-2">Top propiedades (30d)</h3>
            {data.topProps.length === 0 && <p className="text-xs text-[var(--color-text-light)]">Sin vistas en los últimos 30 días.</p>}
            <table className="w-full text-xs">
              <tbody>
                {data.topProps.map((p) => (
                  <tr key={p.wasi_id} className="border-b border-gray-100">
                    <td className="py-1.5">
                      <a className="text-[var(--color-accent)] hover:underline" href={`/propiedades/${p.wasi_id}`} target="_blank">
                        {p.wasi_id}
                      </a>
                    </td>
                    <td className="text-right font-mono">{p.views} vistas</td>
                    <td className="text-right font-mono text-[var(--color-text-light)]">{p.sesiones} ses.</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-sm font-semibold mt-4 mb-2">Tendencia diaria (30d)</h3>
            <MiniBar items={data.tendencia.map((t) => ({ dia: new Date(t.dia).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }), views: t.views }))} labelKey="dia" valueKey="views" />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Fuentes (histórico)</h3>
              <MiniBar items={data.fuentes} labelKey="fuente" valueKey="n" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Dispositivos</h3>
              <MiniBar items={data.dispositivos} labelKey="device" valueKey="n" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Ciudades (Cloudflare geo)</h3>
              <MiniBar items={data.ciudades} labelKey="city" valueKey="n" />
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
