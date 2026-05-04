'use client';

import { useState } from 'react';
import SectionCard from './SectionCard';
import { useMercadoData } from './useMercadoData';
import { formatInt, formatM, formatPct } from '@/lib/format';

interface Row {
  wasi_id: string;
  title: string;
  city: string;
  tipo: string;
  trans: string;
  area_m2: number;
  area_band: string;
  precio_m: number;
  pxm2_m: number;
  mercado_n: number;
  mercado_pxm2_m: number;
  pxm2_p25_m: number;
  pxm2_p75_m: number;
  posicion: 'BAJO' | 'EN_RANGO' | 'ALTO';
  diff_pxm2_m: number;
  diff_pct: number;
}

const badgeClass: Record<string, string> = {
  ALTO: 'bg-red-100 text-red-800 border-red-300',
  BAJO: 'bg-amber-100 text-amber-800 border-amber-300',
  EN_RANGO: 'bg-green-100 text-green-800 border-green-300',
};

const recomendacion = (r: Row): string => {
  if (r.posicion === 'ALTO')
    return `Sobre-precio. Justificar valor o bajar hacia ${formatM(r.mercado_pxm2_m, 2)}/m² (mediana mercado).`;
  if (r.posicion === 'BAJO')
    return `Sub-precio. Posible subir hasta ${formatM(r.mercado_pxm2_m, 2)}/m² → ${formatM(r.mercado_pxm2_m * r.area_m2)}.`;
  return 'En rango competitivo.';
};

export default function AlertasSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useMercadoData<{ counts: Record<string, number>; rows: Row[] }>('alertas', refreshKey);
  const [filtro, setFiltro] = useState<'TODOS' | 'ALTO' | 'BAJO' | 'EN_RANGO'>('TODOS');
  const rows = (data?.rows ?? []).filter((r) => filtro === 'TODOS' || r.posicion === filtro);
  return (
    <SectionCard
      numero={6}
      titulo="Alertas de precio HEI"
      pregunta="¿Qué propiedades nuestras están BAJO o ALTO vs mercado?"
      loading={loading}
      error={error}
      accion="Yoko ajusta arriendos en alertas, Cesar ajusta ventas. Conversar con dueño antes de cambiar precio."
      responsable="Yoko (arriendo) / Cesar (venta)"
    >
      {data && (
        <>
          <div className="flex flex-wrap gap-2 mb-4 text-sm">
            {(['TODOS', 'ALTO', 'BAJO', 'EN_RANGO'] as const).map((f) => {
              const n = f === 'TODOS' ? data.rows.length : (data.counts[f] ?? 0);
              return (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className={`px-3 py-1 rounded-full border text-xs font-medium ${
                    filtro === f
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-white border-[var(--color-border)] hover:bg-gray-50'
                  }`}
                >
                  {f === 'TODOS' ? 'Todas' : f.replace('_', ' ')} · {n}
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.wasi_id} className="bg-white border border-[var(--color-border)] rounded-xl p-3">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm truncate">{r.title || `Wasi ${r.wasi_id}`}</div>
                    <div className="text-xs text-[var(--color-text-light)] capitalize">
                      {r.city} · {r.tipo.replace('_', ' ')} · {r.trans} · {r.area_band}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${badgeClass[r.posicion]}`}>
                      {r.posicion.replace('_', ' ')}
                    </span>
                    <span className="text-lg font-bold tabular-nums">{formatPct(r.diff_pct)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <Cell label="Tu $/m²" valor={formatM(r.pxm2_m, 2)} />
                  <Cell label="Mediana mercado" valor={formatM(r.mercado_pxm2_m, 2)} />
                  <Cell label="Muestra" valor={formatInt(r.mercado_n)} />
                </div>
                <div className="text-sm text-[var(--color-text)]">{recomendacion(r)}</div>
                <div className="mt-2 flex gap-2 text-xs">
                  <a
                    href={`https://app.wasi.co/property/${r.wasi_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-primary)] hover:underline"
                  >Abrir en Wasi →</a>
                  <a
                    href={`/admin/cotizador/comparables/${r.wasi_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-primary)] hover:underline"
                  >Ver comparables →</a>
                </div>
              </div>
            ))}
            {rows.length === 0 && (
              <div className="text-center text-sm text-[var(--color-text-light)] py-6">Sin alertas en este filtro.</div>
            )}
          </div>
        </>
      )}
    </SectionCard>
  );
}

function Cell({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="bg-gray-50 rounded-lg px-2 py-1.5">
      <div className="text-[10px] text-[var(--color-text-light)] uppercase">{label}</div>
      <div className="font-semibold tabular-nums">{valor}</div>
    </div>
  );
}
