'use client';

import { useState, useEffect } from 'react';
import { FOLLOWUP_COLORS, type Row } from './shared';

const EVENT_LABELS: Record<string, string> = {
  started: 'Cotizador abierto',
  project_selected: 'Proyecto elegido',
  unit_selected: 'Unidad elegida',
  plan_adjusted: 'Plan ajustado (sliders)',
  lead_gate_shown: 'Formulario visto',
  quote_saved: 'Cotización guardada',
  pdf_downloaded: 'PDF descargado',
  whatsapp_clicked: 'Click a WhatsApp',
  share_viewed: 'Link compartido visto',
  share_copied: 'Link copiado',
};

const FUNNEL_ORDER = ['started', 'project_selected', 'unit_selected', 'lead_gate_shown', 'quote_saved'];

interface Stats {
  weekly: { week: string; n: string }[];
  by_channel: { channel: string; n: string; n_30d: string }[];
  by_project: { name: string; slug: string; n: string; n_30d: string }[];
  funnel_30d: { event: string; n: string; sessions: string }[];
  followup: { followup_status: string; n: string }[];
}

export default function FunnelTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/admin/cotizador-stats')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  if (error) return <div className="p-8 text-center text-[var(--color-text-light)]">No se pudieron cargar las estadísticas.</div>;
  if (!stats) return <div className="p-8 text-center text-[var(--color-text-light)]">Cargando…</div>;

  const maxWeekly = Math.max(1, ...stats.weekly.map(w => Number(w.n)));
  const funnelMap = new Map(stats.funnel_30d.map(f => [f.event, f]));
  const startedSessions = Number(funnelMap.get('started')?.sessions ?? 0);

  const card = 'bg-white rounded-2xl border border-[var(--color-border)] p-5';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* Cotizaciones por semana */}
      <div className={card}>
        <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-4">Cotizaciones por semana (8 sem)</h3>
        {stats.weekly.length === 0 ? (
          <p className="text-sm text-[var(--color-text-light)]">Sin cotizaciones en las últimas 8 semanas.</p>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {stats.weekly.map(w => (
              <div key={w.week} className="flex-1 flex flex-col items-center">
                <span className="text-xs font-semibold text-[var(--color-primary)] mb-1">{w.n}</span>
                <div className="w-full rounded-t bg-[var(--color-accent)]" style={{ height: `${(Number(w.n) / maxWeekly) * 100}%`, minHeight: 2 }} />
                <span className="text-[9px] text-[var(--color-text-light)] mt-1">{w.week.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Funnel 30d */}
      <div className={card}>
        <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-4">Funnel últimos 30 días (sesiones)</h3>
        {startedSessions === 0 ? (
          <p className="text-sm text-[var(--color-text-light)]">
            Aún no hay eventos registrados. El tracking arranca con esta versión del cotizador.
          </p>
        ) : (
          <div className="space-y-2">
            {FUNNEL_ORDER.map(ev => {
              const f = funnelMap.get(ev);
              const sessions = Number(f?.sessions ?? 0);
              const pct = startedSessions > 0 ? Math.round((sessions / startedSessions) * 100) : 0;
              return (
                <div key={ev}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-[var(--color-text)]">{EVENT_LABELS[ev] ?? ev}</span>
                    <span className="font-semibold text-[var(--color-primary)]">{sessions} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="pt-2 text-xs text-[var(--color-text-light)]">
              Otros: {['pdf_downloaded', 'whatsapp_clicked', 'share_viewed', 'plan_adjusted'].map(ev =>
                `${EVENT_LABELS[ev]}: ${funnelMap.get(ev)?.n ?? 0}`).join(' · ')}
            </div>
          </div>
        )}
      </div>

      {/* Por canal */}
      <div className={card}>
        <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-4">Por canal</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-xs text-[var(--color-text-light)]"><th className="text-left pb-2">Canal</th><th className="text-right pb-2">Últimos 30d</th><th className="text-right pb-2">Histórico</th></tr></thead>
          <tbody>
            {stats.by_channel.map(c => (
              <tr key={c.channel} className="border-t border-gray-100">
                <td className="py-2 font-medium">{c.channel}</td>
                <td className="py-2 text-right">{c.n_30d}</td>
                <td className="py-2 text-right text-[var(--color-text-light)]">{c.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Por proyecto + seguimiento */}
      <div className={card}>
        <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-4">Por proyecto</h3>
        <table className="w-full text-sm mb-5">
          <thead><tr className="text-xs text-[var(--color-text-light)]"><th className="text-left pb-2">Proyecto</th><th className="text-right pb-2">Últimos 30d</th><th className="text-right pb-2">Histórico</th></tr></thead>
          <tbody>
            {stats.by_project.map(p => (
              <tr key={p.slug} className="border-t border-gray-100">
                <td className="py-2 font-medium">{p.name}</td>
                <td className="py-2 text-right">{p.n_30d}</td>
                <td className="py-2 text-right text-[var(--color-text-light)]">{p.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wide mb-3">Seguimiento</h3>
        <div className="flex flex-wrap gap-2">
          {stats.followup.map(f => (
            <span key={f.followup_status} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${FOLLOWUP_COLORS[f.followup_status] ?? 'bg-gray-100'}`}>
              {f.followup_status}: {f.n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
