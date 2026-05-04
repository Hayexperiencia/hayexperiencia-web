'use client';

import SectionCard from './SectionCard';
import { useMercadoData } from './useMercadoData';
import { formatInt } from '@/lib/format';

interface Row {
  city: string;
  tipo: string;
  trans: string;
  n_mkt: number;
  n_hei: number;
  gap: number;
  pct_hei: number;
}

export default function BrechasSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useMercadoData<{ rows: Row[] }>('brechas', refreshKey);
  const rows = data?.rows ?? [];
  const max = Math.max(1, ...rows.map((r) => r.n_mkt));
  return (
    <SectionCard
      numero={8}
      titulo="Brechas de cobertura"
      pregunta="¿Qué tipologías × municipio tiene mucho mercado y poco/nada de inventario HEI?"
      loading={loading}
      error={error}
      accion="Cesar/Yoko priorizan captación en top 5 brechas. Yesica genera contenido SEO + landings por par (ciudad, tipo)."
      responsable="Cesar / Yoko / Yesica"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-[var(--color-text-light)] border-b border-[var(--color-border)]">
            <tr>
              <th className="py-2 pr-2">Ciudad</th>
              <th className="py-2 pr-2">Tipo</th>
              <th className="py-2 pr-2">Trans</th>
              <th className="py-2 pr-2 text-right">Mercado</th>
              <th className="py-2 pr-2 text-right">HEI</th>
              <th className="py-2 pr-2 text-right">Gap</th>
              <th className="py-2 pr-2">Cobertura HEI</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2 pr-2">{r.city}</td>
                <td className="py-2 pr-2 capitalize">{r.tipo.replace('_', ' ')}</td>
                <td className="py-2 pr-2 text-xs text-[var(--color-text-light)]">{r.trans}</td>
                <td className="py-2 pr-2 text-right tabular-nums font-medium">{formatInt(r.n_mkt)}</td>
                <td className="py-2 pr-2 text-right tabular-nums">{formatInt(r.n_hei)}</td>
                <td className="py-2 pr-2 text-right tabular-nums font-bold text-[var(--color-primary)]">{formatInt(r.gap)}</td>
                <td className="py-2 pr-2 min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded h-2 overflow-hidden">
                      <div className="h-full bg-[var(--color-primary)]" style={{ width: `${(r.n_mkt / max) * 100}%` }}>
                        <div className="h-full bg-amber-500" style={{ width: `${r.n_mkt > 0 ? (r.n_hei / r.n_mkt) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-[var(--color-text-light)] tabular-nums w-10 text-right">{r.pct_hei}%</span>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-center text-sm text-[var(--color-text-light)]">Sin brechas detectadas (umbral n_mercado ≥ 10).</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
