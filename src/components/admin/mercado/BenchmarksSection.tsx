'use client';

import { useState } from 'react';
import SectionCard from './SectionCard';
import { useMercadoData } from './useMercadoData';
import { formatInt, formatM } from '@/lib/format';

interface Row {
  city: string;
  property_type: string;
  transaction: string;
  area_band: string;
  muestra: number;
  precio_mediana_m: number;
  pxm2_p25_m: number;
  pxm2_mediana_m: number;
  pxm2_p75_m: number;
}

export default function BenchmarksSection({ refreshKey }: { refreshKey: number }) {
  const [city, setCity] = useState('');
  const [transaction, setTransaction] = useState('');

  const { data, loading, error } = useMercadoData<{ cities: string[]; rows: Row[] }>(
    'benchmarks',
    refreshKey,
    { city, transaction },
  );

  const rows = data?.rows ?? [];
  const max = Math.max(0.01, ...rows.map((r) => r.pxm2_p75_m));

  return (
    <SectionCard
      numero={5}
      titulo="Benchmarks de precio por banda de área"
      pregunta="¿Cuál es el rango justo por ciudad + tipo + tamaño?"
      loading={loading}
      error={error}
      accion="Consultar al listar nueva propiedad o asesorar dueño. Si propiedad cae fuera de p25-p75 hay que justificar."
      responsable="Cesar / Yoko"
    >
      <div className="flex flex-wrap gap-2 mb-4 text-sm">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-[var(--color-border)] rounded-lg px-3 py-1.5 bg-white"
        >
          <option value="">Todas las ciudades</option>
          {(data?.cities ?? []).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={transaction}
          onChange={(e) => setTransaction(e.target.value)}
          className="border border-[var(--color-border)] rounded-lg px-3 py-1.5 bg-white"
        >
          <option value="">Venta + arriendo</option>
          <option value="venta">Solo venta</option>
          <option value="arriendo">Solo arriendo</option>
        </select>
        <span className="text-xs text-[var(--color-text-light)] self-center">
          {rows.length} segmentos
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-[var(--color-text-light)] border-b border-[var(--color-border)]">
            <tr>
              <th className="py-2 pr-2">Ciudad</th>
              <th className="py-2 pr-2">Tipo / banda</th>
              <th className="py-2 pr-2">Trans</th>
              <th className="py-2 pr-2 text-right">n</th>
              <th className="py-2 pr-2 text-right">Mediana</th>
              <th className="py-2 pr-2">$/m² rango (p25 → p75)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const left = (r.pxm2_p25_m / max) * 100;
              const right = (r.pxm2_p75_m / max) * 100;
              const mid = (r.pxm2_mediana_m / max) * 100;
              return (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 pr-2">{r.city}</td>
                  <td className="py-2 pr-2 capitalize">{r.property_type.replace('_', ' ')} · <span className="text-xs text-[var(--color-text-light)]">{r.area_band}</span></td>
                  <td className="py-2 pr-2 text-xs text-[var(--color-text-light)]">{r.transaction}</td>
                  <td className="py-2 pr-2 text-right tabular-nums">{formatInt(r.muestra)}</td>
                  <td className="py-2 pr-2 text-right tabular-nums font-medium">{formatM(r.precio_mediana_m)}</td>
                  <td className="py-2 pr-2 min-w-[180px]">
                    <div className="relative h-3 bg-gray-100 rounded">
                      <div
                        className="absolute h-full bg-[var(--color-accent)]/30 rounded"
                        style={{ left: `${left}%`, width: `${Math.max(2, right - left)}%` }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-1.5 h-4 bg-[var(--color-primary)] rounded-sm"
                        style={{ left: `calc(${mid}% - 3px)` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[var(--color-text-light)] mt-0.5 tabular-nums">
                      <span>{formatM(r.pxm2_p25_m, 2)}/m²</span>
                      <span>{formatM(r.pxm2_p75_m, 2)}/m²</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-center text-sm text-[var(--color-text-light)]">Sin datos para este filtro.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
