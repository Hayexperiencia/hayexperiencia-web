'use client';

import SectionCard from './SectionCard';
import { useMercadoData } from './useMercadoData';
import { formatInt, formatM, formatRelativeDate } from '@/lib/format';

interface Cobertura {
  wasi_id: string;
  title: string | null;
  city: string | null;
  property_type: string | null;
  match_type: string;
  num_dominios: number;
  en_dominios: string[];
  ultima_vez_visto: string;
}

interface Shared {
  wasi_id: string;
  title: string;
  city: string;
  property_type: string;
  transaction: string;
  hei_price: number;
  competidores: string[];
  urls: string[];
}

const matchBadge = (mt: string) =>
  mt === 'wasi_portal'
    ? 'bg-blue-100 text-blue-800'
    : mt === 'shared_listing'
    ? 'bg-purple-100 text-purple-800'
    : 'bg-gray-100 text-gray-700';

export default function RepublicacionSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useMercadoData<{ cobertura: Cobertura[]; shared: Shared[] }>('republicacion', refreshKey);
  return (
    <SectionCard
      numero={7}
      titulo="Re-publicación HEI y shared listings"
      pregunta="¿En cuántos portales aparece cada propiedad y dónde compartimos con la competencia?"
      loading={loading}
      error={error}
      accion="Toda propiedad activa debe estar en ≥3 portales pagos. Si shared_listing tiene precio distinto, conversar con dueño."
      responsable="Cesar / Yoko"
    >
      {data && (
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-sm mb-2 text-[var(--color-primary)]">
              Cobertura por portales ({data.cobertura.length} propiedades republicadas)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-[var(--color-text-light)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="py-2 pr-2">Wasi ID</th>
                    <th className="py-2 pr-2">Título</th>
                    <th className="py-2 pr-2">Ciudad</th>
                    <th className="py-2 pr-2 text-right">Portales</th>
                    <th className="py-2 pr-2">Tipo match</th>
                    <th className="py-2 pr-2">Visto</th>
                  </tr>
                </thead>
                <tbody>
                  {data.cobertura.map((c) => (
                    <tr key={c.wasi_id} className="border-b border-gray-100">
                      <td className="py-2 pr-2 font-mono text-xs">{c.wasi_id}</td>
                      <td className="py-2 pr-2 truncate max-w-[200px]">{c.title || '—'}</td>
                      <td className="py-2 pr-2">{c.city || '—'}</td>
                      <td className="py-2 pr-2 text-right">
                        <span className="font-semibold tabular-nums">{formatInt(c.num_dominios)}</span>
                        <div className="text-[10px] text-[var(--color-text-light)]">{c.en_dominios?.slice(0, 3).join(', ')}</div>
                      </td>
                      <td className="py-2 pr-2">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${matchBadge(c.match_type)}`}>
                          {c.match_type}
                        </span>
                      </td>
                      <td className="py-2 pr-2 text-xs text-[var(--color-text-light)]">{formatRelativeDate(c.ultima_vez_visto)}</td>
                    </tr>
                  ))}
                  {data.cobertura.length === 0 && (
                    <tr><td colSpan={6} className="py-4 text-center text-[var(--color-text-light)]">Sin re-publicaciones detectadas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2 text-[var(--color-primary)]">
              Shared listings — propiedades de otros brokers también ({data.shared.length})
            </h3>
            <div className="space-y-2">
              {data.shared.map((s) => (
                <div key={s.wasi_id} className="bg-purple-50/40 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-sm">{s.title}</div>
                      <div className="text-xs text-[var(--color-text-light)] capitalize">
                        {s.city} · {s.property_type} · {s.transaction}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm tabular-nums">{formatM(s.hei_price / 1e6)}</div>
                      <div className="text-[10px] text-[var(--color-text-light)]">precio HE</div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(s.competidores ?? []).map((c) => (
                      <span key={c} className="text-[10px] font-mono bg-white border border-purple-200 rounded px-1.5 py-0.5">{c}</span>
                    ))}
                  </div>
                </div>
              ))}
              {data.shared.length === 0 && (
                <div className="text-center text-sm text-[var(--color-text-light)] py-4">Sin shared listings.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
