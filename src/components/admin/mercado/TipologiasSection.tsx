'use client';

import SectionCard from './SectionCard';
import { useMercadoData } from './useMercadoData';
import { formatInt, formatM } from '@/lib/format';

interface Row {
  city: string;
  tipo: string;
  n: number;
  mediana_m: number | null;
}

export default function TipologiasSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useMercadoData<{ rows: Row[] }>('tipologias', refreshKey);
  const rows = data?.rows ?? [];
  const grouped: Record<string, Row[]> = {};
  rows.forEach((r) => {
    if (!grouped[r.city]) grouped[r.city] = [];
    grouped[r.city].push(r);
  });
  return (
    <SectionCard
      numero={4}
      titulo="Tipologías que se mueven"
      pregunta="¿Qué tipo de propiedad domina cada municipio?"
      loading={loading}
      error={error}
      accion="Generar contenido SEO + landings de tipologías top en municipios donde HEI no tiene presencia (cruza con sección 8)."
      responsable="Yesica"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(grouped).map(([city, tipos]) => (
          <div key={city} className="bg-gray-50 border border-[var(--color-border)] rounded-xl p-3">
            <div className="font-semibold text-[var(--color-primary)] mb-2">{city}</div>
            <ul className="space-y-1.5">
              {tipos.map((t) => (
                <li key={`${city}-${t.tipo}`} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{t.tipo.replace('_', ' ')}</span>
                  <span className="text-xs text-[var(--color-text-light)] tabular-nums">
                    {formatInt(t.n)} · {t.mediana_m != null ? formatM(t.mediana_m) : '—'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
