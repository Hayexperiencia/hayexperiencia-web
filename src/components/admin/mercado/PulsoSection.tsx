'use client';

import SectionCard from './SectionCard';
import { useMercadoData } from './useMercadoData';
import { formatInt, formatRelativeDate, freshnessColor } from '@/lib/format';

interface PulsoData {
  ok: boolean;
  kpis: { total: number; pct_foto: number; pct_geo: number; dominios: number };
  sources: { source_domain: string; n: number; last_scrape: string; last_seen: string }[];
}

const dotColor = { green: 'bg-green-500', yellow: 'bg-yellow-500', red: 'bg-red-500', gray: 'bg-gray-300' };

export default function PulsoSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useMercadoData<PulsoData>('pulso', refreshKey);
  const k = data?.kpis;
  return (
    <SectionCard
      numero={1}
      titulo="Pulso del mercado"
      pregunta="¿Qué tan grande, fresco y completo es el universo competitivo?"
      loading={loading}
      error={error}
      accion="Si algún dominio crítico (Doomos, Mobilia, Vivanuncios) lleva más de 7 días sin scrapear, abrir ticket."
      responsable="Yesica reporta a Gabriel"
    >
      {k && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <Kpi label="Listings activos" valor={formatInt(k.total)} />
            <Kpi label="Dominios scrapeados" valor={formatInt(k.dominios)} />
            <Kpi label="Con foto" valor={`${k.pct_foto ?? 0}%`} />
            <Kpi label="Con geo (lat/lng)" valor={`${k.pct_geo ?? 0}%`} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-[var(--color-text-light)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="py-2 pr-2">Dominio</th>
                  <th className="py-2 pr-2 text-right">Listings</th>
                  <th className="py-2 pr-2">Último scrape</th>
                  <th className="py-2 pr-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data!.sources.map((s) => {
                  const c = freshnessColor(s.last_scrape);
                  return (
                    <tr key={s.source_domain} className="border-b border-gray-100">
                      <td className="py-2 pr-2 font-mono text-xs">{s.source_domain}</td>
                      <td className="py-2 pr-2 text-right tabular-nums">{formatInt(s.n)}</td>
                      <td className="py-2 pr-2 text-[var(--color-text-light)]">{formatRelativeDate(s.last_scrape)}</td>
                      <td className="py-2 pr-2">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${dotColor[c]}`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </SectionCard>
  );
}

function Kpi({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-3 border border-[var(--color-border)]">
      <div className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] tabular-nums">{valor}</div>
      <div className="text-xs text-[var(--color-text-light)] mt-1">{label}</div>
    </div>
  );
}
