'use client';

import SectionCard from '../mercado/SectionCard';
import { useAnalyticsData } from './useAnalyticsData';
import { formatInt } from '@/lib/format';

interface CotizacionesData {
  ok: boolean;
  porProyecto: Array<{ proyecto: string; n: number; d30: number }>;
  porCanal: Array<{ canal: string; n: number }>;
  porMes: Array<{ mes: string; n: number }>;
  recientes: Array<{ quotation_code: string; proyecto: string; nombre: string; ciudad: string; en_ghl: boolean; created_at: string }>;
}

export default function CotizacionesSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useAnalyticsData<CotizacionesData>('cotizaciones', refreshKey);
  return (
    <SectionCard
      numero={2}
      titulo="Cotizador HEI"
      pregunta="¿Quién cotiza, qué proyecto y por qué canal?"
      loading={loading}
      error={error}
      accion="Cotización sin contacto en GHL = lead que se pierde. Revisar los ✗ y registrarlos."
      responsable="Cesar"
    >
      {data && (
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <h3 className="text-sm font-semibold mb-2">Por proyecto</h3>
            <table className="w-full text-xs">
              <thead><tr className="text-[var(--color-text-light)] text-left"><th className="py-1">Proyecto</th><th className="text-right">Total</th><th className="text-right">30d</th></tr></thead>
              <tbody>
                {data.porProyecto.map((p) => (
                  <tr key={p.proyecto} className="border-b border-gray-100">
                    <td className="py-1.5">{p.proyecto}</td>
                    <td className="text-right font-mono">{formatInt(p.n)}</td>
                    <td className="text-right font-mono">{formatInt(p.d30)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-sm font-semibold mt-4 mb-2">Por canal</h3>
            <p className="text-xs">
              {data.porCanal.map((c) => `${c.canal}: ${c.n}`).join(' · ')}
            </p>
            <h3 className="text-sm font-semibold mt-4 mb-2">Por mes</h3>
            <p className="text-xs font-mono">
              {data.porMes.map((m) => `${m.mes}: ${m.n}`).join(' · ')}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Últimas 10</h3>
            <table className="w-full text-xs">
              <thead><tr className="text-[var(--color-text-light)] text-left"><th className="py-1">Código</th><th>Proyecto</th><th>Cliente</th><th className="text-center">GHL</th><th className="text-right">Fecha</th></tr></thead>
              <tbody>
                {data.recientes.map((q) => (
                  <tr key={q.quotation_code} className="border-b border-gray-100">
                    <td className="py-1.5 font-mono">{q.quotation_code}</td>
                    <td>{q.proyecto}</td>
                    <td>{q.nombre} <span className="text-[var(--color-text-light)]">{q.ciudad}</span></td>
                    <td className="text-center">{q.en_ghl ? '✓' : <span className="text-red-500">✗</span>}</td>
                    <td className="text-right text-[var(--color-text-light)]">{new Date(q.created_at).toLocaleDateString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
