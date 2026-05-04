'use client';

import { useState } from 'react';
import SectionCard from './SectionCard';
import { useMercadoData, postRefresh } from './useMercadoData';
import { formatInt, formatRelativeDate, freshnessColor } from '@/lib/format';

interface SaludData {
  ok: boolean;
  runs: { scraper_name: string; last_started: string; last_finished: string | null; ok_7d: boolean | null; inserted_7d: number | null; runs_7d: number }[];
  matRefresh: { pricing_benchmarks_size_bands: string };
  heiInventory: { total: number; con_precio: number; con_area: number; con_ciudad: number; ultimo_sync: string };
  matchTypes: { match_type: string; n: number }[];
  enrichmentInfo: {
    nota: string;
    confidence: { high: number; medium: number; low: number; insufficient: number };
    yearBuiltPobladas: number;
    yearBuiltTotal: number;
    planeTask: string;
  };
}

const dotColor = { green: 'bg-green-500', yellow: 'bg-yellow-500', red: 'bg-red-500', gray: 'bg-gray-300' };

export default function SaludSection({ refreshKey, onRefreshed }: { refreshKey: number; onRefreshed: () => void }) {
  const { data, loading, error } = useMercadoData<SaludData>('salud', refreshKey);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState<string | null>(null);

  const triggerRefresh = async () => {
    setRefreshing(true);
    setRefreshMsg(null);
    const r = await postRefresh();
    setRefreshing(false);
    if (r.ok) {
      setRefreshMsg(`Refrescado en ${r.duration_ms}ms${r.skipped?.length ? ` (saltó ${r.skipped.join(', ')})` : ''}.`);
      onRefreshed();
    } else {
      setRefreshMsg(`Error: ${r.error ?? 'desconocido'}`);
    }
  };

  return (
    <SectionCard
      numero={9}
      titulo="Salud de los datos"
      pregunta="¿Confiamos en lo que vemos?"
      loading={loading}
      error={error}
      accion="Si algún spider está rojo (>7 días sin correr), abrir ticket. Yoko/Cesar pueblan yearBuilt en Wasi (HEI-83 vence 2026-05-31)."
      responsable="Yesica + Yoko + Cesar"
    >
      {data && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2 text-[var(--color-primary)]">Spiders (últimos 7 días)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-[var(--color-text-light)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="py-1 pr-2"></th>
                    <th className="py-1 pr-2">Spider</th>
                    <th className="py-1 pr-2 text-right">Runs 7d</th>
                    <th className="py-1 pr-2 text-right">Insertados 7d</th>
                    <th className="py-1 pr-2">Última corrida</th>
                  </tr>
                </thead>
                <tbody>
                  {data.runs.map((r) => {
                    const c = freshnessColor(r.last_started);
                    return (
                      <tr key={r.scraper_name} className="border-b border-gray-100">
                        <td className="py-1.5 pr-2"><span className={`inline-block w-2.5 h-2.5 rounded-full ${dotColor[c]}`} /></td>
                        <td className="py-1.5 pr-2 font-mono text-xs">{r.scraper_name}</td>
                        <td className="py-1.5 pr-2 text-right tabular-nums">{formatInt(r.runs_7d)}</td>
                        <td className="py-1.5 pr-2 text-right tabular-nums">{r.inserted_7d != null ? formatInt(r.inserted_7d) : '—'}</td>
                        <td className="py-1.5 pr-2 text-[var(--color-text-light)]">{formatRelativeDate(r.last_started)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm mb-2 text-[var(--color-primary)]">Inventario HEI sincronizado</h3>
              <ul className="text-sm space-y-1">
                <li>Total: <strong>{formatInt(data.heiInventory.total)}</strong></li>
                <li>Con precio: {formatInt(data.heiInventory.con_precio)}</li>
                <li>Con área: {formatInt(data.heiInventory.con_area)}</li>
                <li>Con ciudad: {formatInt(data.heiInventory.con_ciudad)}</li>
                <li className="text-xs text-[var(--color-text-light)]">Último sync: {formatRelativeDate(data.heiInventory.ultimo_sync)}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2 text-[var(--color-primary)]">Enrichment v1 (al 2026-05-01)</h3>
              <p className="text-xs text-[var(--color-text-light)] mb-2 italic">{data.enrichmentInfo.nota}</p>
              <ul className="text-sm space-y-1">
                <li>Confianza alta: <strong>{data.enrichmentInfo.confidence.high}</strong></li>
                <li>Confianza media: {data.enrichmentInfo.confidence.medium}</li>
                <li>Confianza baja: {data.enrichmentInfo.confidence.low}</li>
                <li>Insuficiente: {data.enrichmentInfo.confidence.insufficient} <span className="text-xs text-[var(--color-text-light)]">(tipo &quot;otro&quot; o segmentos heterogéneos)</span></li>
                <li className="pt-2 text-amber-700">
                  yearBuilt poblado en {data.enrichmentInfo.yearBuiltPobladas}/{data.enrichmentInfo.yearBuiltTotal} props · Plane <strong>{data.enrichmentInfo.planeTask}</strong>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-[var(--color-text-light)]">
                Materialized views computed: {formatRelativeDate(data.matRefresh.pricing_benchmarks_size_bands)}
              </div>
              <button
                onClick={triggerRefresh}
                disabled={refreshing}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors disabled:opacity-50"
              >
                {refreshing ? 'Refrescando…' : 'Refrescar materialized views'}
              </button>
            </div>
            {refreshMsg && (
              <p className="text-xs text-[var(--color-text-light)] mt-2">{refreshMsg}</p>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
