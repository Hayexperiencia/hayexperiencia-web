'use client';

import SectionCard from '../mercado/SectionCard';
import { useAnalyticsData } from './useAnalyticsData';
import { formatInt } from '@/lib/format';

interface ResumenData {
  ok: boolean;
  visitas: { total: number; d7: number; d30: number; sesiones30: number; desde: string };
  cotizaciones: { total: number; d7: number; d30: number; con_ghl: number };
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-[var(--color-border)] px-4 py-3">
      <p className="text-xs text-[var(--color-text-light)]">{label}</p>
      <p className="text-2xl font-bold text-[var(--color-primary)]">{value}</p>
      {sub && <p className="text-xs text-[var(--color-text-light)] mt-0.5">{sub}</p>}
    </div>
  );
}

export default function EmbudoSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useAnalyticsData<ResumenData>('resumen', refreshKey);
  return (
    <SectionCard
      numero={0}
      titulo="Embudo del sitio (analytics propio)"
      pregunta="¿Cuánta gente ve propiedades y cuántos llegan a cotizar?"
      loading={loading}
      error={error}
      accion="Si visitas 7d sigue en un dígito, el problema es tráfico (pauta/SEO), no conversión."
      responsable="Gabriel"
    >
      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi label="Vistas de propiedad (30d)" value={formatInt(data.visitas.d30)} sub={`${formatInt(data.visitas.d7)} en 7d`} />
            <Kpi label="Sesiones únicas (30d)" value={formatInt(data.visitas.sesiones30)} />
            <Kpi label="Cotizaciones (30d)" value={formatInt(data.cotizaciones.d30)} sub={`${formatInt(data.cotizaciones.total)} históricas`} />
            <Kpi label="Cotizaciones → GHL" value={formatInt(data.cotizaciones.con_ghl)} sub="con contacto creado" />
          </div>
          <p className="text-xs text-[var(--color-text-light)] mt-3">
            Solo se registran aquí las VISTAS de propiedades usadas (página /propiedades/[id]) y las cotizaciones
            guardadas. Los pasos intermedios (inicio de cotizador, clicks de WhatsApp) hoy van solo a GA4/Meta —
            ver sección Instrumentación. Datos propios desde {new Date(data.visitas.desde).toLocaleDateString('es-CO')}.
          </p>
        </>
      )}
    </SectionCard>
  );
}
