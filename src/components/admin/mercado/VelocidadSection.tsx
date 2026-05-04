'use client';

import SectionCard from './SectionCard';
import { useMercadoData } from './useMercadoData';
import { formatInt, formatDate } from '@/lib/format';

interface VelocidadData {
  ok: boolean;
  stats: { total: number; retirados: number; sin_ver_14d: number; price_changes: number };
  distribucion: { semana: string; nuevos: number }[];
  dataInsuficiente: boolean;
  mensaje: string | null;
}

export default function VelocidadSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useMercadoData<VelocidadData>('velocidad', refreshKey);
  const max = Math.max(1, ...(data?.distribucion ?? []).map((d) => d.nuevos));
  return (
    <SectionCard
      numero={3}
      titulo="Velocidad del mercado"
      pregunta="¿Es mercado de comprador o vendedor? ¿Qué tan rápido se mueve cada cosa?"
      loading={loading}
      error={error}
      accion="Activar tracking de cambios de precio en próximo ciclo de scraping (Plane HEI-87 nuevo). En 60-90 días tendremos DOM y Months of Supply reales."
      responsable="Gabriel + Yesica"
    >
      {data && (
        <>
          {data.dataInsuficiente && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm">
              <strong className="text-amber-900">Histórico insuficiente.</strong>{' '}
              <span className="text-amber-800">{data.mensaje}</span>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Stat label="Listings totales" valor={formatInt(data.stats.total)} />
            <Stat label="Retirados / vendidos" valor={formatInt(data.stats.retirados)} hint={data.stats.retirados === 0 ? 'sin tracking aún' : undefined} />
            <Stat label="Sin ver hace 14d+" valor={formatInt(data.stats.sin_ver_14d)} />
            <Stat label="Cambios de precio" valor={formatInt(data.stats.price_changes)} hint={data.stats.price_changes === 0 ? 'sin tracking aún' : undefined} />
          </div>
          {data.distribucion.length > 0 && (
            <div>
              <div className="text-xs uppercase text-[var(--color-text-light)] mb-2">Nuevos listings por semana (últimas {data.distribucion.length})</div>
              <div className="space-y-1">
                {data.distribucion.map((d) => (
                  <div key={d.semana} className="flex items-center gap-2 text-xs">
                    <span className="w-24 text-[var(--color-text-light)] tabular-nums">{formatDate(d.semana)}</span>
                    <div className="flex-1 bg-gray-100 rounded h-3 overflow-hidden">
                      <div className="h-full bg-[var(--color-primary)]" style={{ width: `${(d.nuevos / max) * 100}%` }} />
                    </div>
                    <span className="w-12 text-right tabular-nums font-medium">{formatInt(d.nuevos)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </SectionCard>
  );
}

function Stat({ label, valor, hint }: { label: string; valor: string; hint?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-3 border border-[var(--color-border)]">
      <div className="text-2xl font-bold text-[var(--color-primary)] tabular-nums">{valor}</div>
      <div className="text-xs text-[var(--color-text-light)] mt-1">{label}</div>
      {hint && <div className="text-[10px] text-amber-700 mt-0.5 italic">{hint}</div>}
    </div>
  );
}
