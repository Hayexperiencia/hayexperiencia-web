'use client';

import SectionCard from '../mercado/SectionCard';
import { useAnalyticsData } from './useAnalyticsData';
import { formatInt } from '@/lib/format';

interface Ga4Data {
  ok: boolean;
  pendiente: boolean;
  capturedAt: string | null;
  payload: {
    diario: Array<{ date: string; activeUsers: number; sessions: number }>;
    eventos: Array<{ eventName: string; eventCount: number }>;
    fuentes: Array<{ sessionSource: string; sessions: number }>;
  } | null;
}

const NOMBRES: Record<string, string> = {
  page_view: 'Vistas de página',
  view_property: 'Vistas de propiedad',
  whatsapp_click: 'Clicks WhatsApp',
  cotizador_start: 'Cotizador iniciado',
  cotizador_submit: 'Cotizador enviado',
  contact_form_submit: 'Formulario contacto',
};

export default function Ga4Section({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useAnalyticsData<Ga4Data>('ga4', refreshKey);
  const totalUsers = data?.payload?.diario.reduce((a, d) => a + d.activeUsers, 0) ?? 0;
  const totalSessions = data?.payload?.diario.reduce((a, d) => a + d.sessions, 0) ?? 0;
  return (
    <SectionCard
      numero={6}
      titulo="Google Analytics 4 (sitio completo)"
      pregunta="¿Cuánta gente entra al sitio, de dónde, y qué eventos dispara?"
      loading={loading}
      error={error}
      accion="Snapshot cada 6h desde la Data API. Comparar fuentes con la pauta activa."
      responsable="Gabriel"
    >
      {data?.pendiente && (
        <p className="text-sm text-[var(--color-text-light)]">
          Conexión configurada, esperando el primer snapshot de la Data API (corre cada 6h, o
          Claude puede dispararlo manualmente).
        </p>
      )}
      {data?.payload && (
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl border border-[var(--color-border)] px-4 py-3">
                <p className="text-xs text-[var(--color-text-light)]">Usuarios activos (30d)</p>
                <p className="text-2xl font-bold text-[var(--color-primary)]">{formatInt(totalUsers)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl border border-[var(--color-border)] px-4 py-3">
                <p className="text-xs text-[var(--color-text-light)]">Sesiones (30d)</p>
                <p className="text-2xl font-bold text-[var(--color-primary)]">{formatInt(totalSessions)}</p>
              </div>
            </div>
            <h3 className="text-sm font-semibold mb-2">Eventos clave (30d)</h3>
            <table className="w-full text-xs">
              <tbody>
                {data.payload.eventos.sort((a, b) => b.eventCount - a.eventCount).map((e) => (
                  <tr key={e.eventName} className="border-b border-gray-100">
                    <td className="py-1.5">{NOMBRES[e.eventName] ?? e.eventName}</td>
                    <td className="text-right font-mono">{formatInt(e.eventCount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Fuentes de sesiones (30d)</h3>
            <table className="w-full text-xs">
              <tbody>
                {data.payload.fuentes.map((f) => (
                  <tr key={f.sessionSource} className="border-b border-gray-100">
                    <td className="py-1.5">{f.sessionSource}</td>
                    <td className="text-right font-mono">{formatInt(f.sessions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.capturedAt && (
              <p className="text-xs text-[var(--color-text-light)] mt-3">
                Snapshot: {new Date(data.capturedAt).toLocaleString('es-CO')}
              </p>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
