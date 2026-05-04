'use client';

import SectionCard from './SectionCard';
import { useMercadoData } from './useMercadoData';
import { formatInt } from '@/lib/format';

interface ResumenData {
  ok: boolean;
  universo: { total: number; ciudades: number; dominios: number };
  alertas: { ALTO: number; BAJO: number; EN_RANGO: number };
  topCiudad: { city: string; n: number } | null;
  topBrecha: { city: string; tipo: string; trans: string; gap: number } | null;
  republicaciones: { total: number; promedio_dominios: number };
  sharedListings: number;
}

export default function ResumenSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useMercadoData<ResumenData>('resumen', refreshKey);
  return (
    <SectionCard
      numero={0}
      titulo="Resumen ejecutivo"
      pregunta="¿Qué pasa esta semana en una mirada?"
      loading={loading}
      error={error}
      accion="Gabriel revisa cada lunes y prioriza acciones del equipo en reunión semanal."
      responsable="Gabriel"
    >
      {data && (
        <div className="prose prose-sm max-w-none text-[var(--color-text)]">
          <p>
            Tenemos visibilidad de <strong>{formatInt(data.universo.total)}</strong> propiedades de competidores
            en <strong>{data.universo.ciudades}</strong> municipios del Oriente, scrapeadas de{' '}
            <strong>{data.universo.dominios}</strong> portales distintos.
            {data.topCiudad && (
              <> Mayor concentración en <strong>{data.topCiudad.city}</strong> con {formatInt(data.topCiudad.n)} listings activos.</>
            )}
          </p>
          <p>
            Sobre nuestras 92 propiedades HEI, hay{' '}
            <strong className="text-red-700">{data.alertas.ALTO} con sobre-precio</strong> (revisar con dueño antes de bajar) y{' '}
            <strong className="text-amber-700">{data.alertas.BAJO} con sub-precio</strong> (oportunidad de subir).{' '}
            <strong className="text-green-700">{data.alertas.EN_RANGO}</strong> están en rango competitivo.
          </p>
          <p>
            Hay <strong>{data.republicaciones.total}</strong> propiedades HEI republicadas en otros portales (promedio{' '}
            {data.republicaciones.promedio_dominios?.toString?.() ?? '—'} portales por propiedad). De esas,{' '}
            <strong>{data.sharedListings}</strong> son shared listings (mismo dueño aportó a HE + competencia — vale revisar).
          </p>
          {data.topBrecha && (
            <p>
              La brecha más grande de cobertura: <strong className="capitalize">{data.topBrecha.tipo.replace('_', ' ')}</strong> en{' '}
              <strong>{data.topBrecha.city}</strong> ({data.topBrecha.trans}) — el mercado tiene {formatInt(data.topBrecha.gap)}{' '}
              listings más que nosotros. Oportunidad de captación clara para Cesar/Yoko.
            </p>
          )}
          <p className="text-xs text-[var(--color-text-light)] italic">
            Datos de scraping y benchmarks. Las acciones específicas por propiedad están en cada sección.
          </p>
        </div>
      )}
    </SectionCard>
  );
}
