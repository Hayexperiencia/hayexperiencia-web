'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatCOP, FOLLOWUP_OPTIONS, FOLLOWUP_COLORS, downloadCSV, type Row } from './shared';

export default function QuotationsTab({ projects, showMessage }: {
  projects: Row[];
  showMessage: (m: string) => void;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [projectId, setProjectId] = useState('');
  const [channel, setChannel] = useState('');
  const [followup, setFollowup] = useState('');
  const [limit, setLimit] = useState(100);
  const [notesFor, setNotesFor] = useState<Row | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (projectId) params.set('project_id', projectId);
    if (channel) params.set('channel', channel);
    if (followup) params.set('followup_status', followup);
    params.set('limit', String(limit));
    fetch(`/api/admin/quotations?${params.toString()}`)
      .then(r => r.json())
      .then(d => { setRows(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, projectId, channel, followup, limit]);

  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  async function updateQuotation(id: number, fields: Record<string, unknown>) {
    const res = await fetch('/api/admin/quotations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields }),
    });
    if (res.ok) { load(); } else { showMessage('Error actualizando'); }
  }

  function exportCSV() {
    downloadCSV(
      `cotizaciones-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Codigo', 'Fecha', 'Proyecto', 'Unidad', 'Precio', 'Cliente', 'Telefono', 'Email', 'Canal', 'Seguimiento', 'GHL', 'Cuota CI', 'Cuota credito', 'Link', 'Notas'],
      rows.map(q => [
        q.quotation_code as string,
        new Date(q.created_at as string).toLocaleString('es-CO'),
        q.project_name as string,
        q.unit_code as string,
        q.list_price as string,
        q.client_name as string,
        q.client_phone as string,
        q.client_email as string,
        q.channel as string,
        q.followup_status as string,
        q.ghl_contact_id ? 'si' : 'no',
        q.ci_monthly as string,
        q.monthly_payment_est as string,
        q.share_token ? `https://hayexperiencia.com/cotizacion/${q.share_token}` : '',
        q.admin_notes as string,
      ])
    );
  }

  async function copyShare(q: Row) {
    if (!q.share_token) return;
    try {
      await navigator.clipboard.writeText(`https://hayexperiencia.com/cotizacion/${q.share_token}`);
      showMessage(`Link de ${q.quotation_code} copiado`);
    } catch { /* clipboard no disponible */ }
  }

  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  const sel = 'rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]';

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input type="search" placeholder="Buscar código, nombre, teléfono…" value={search} onChange={e => setSearch(e.target.value)}
          className={`${sel} w-full sm:w-64`} aria-label="Buscar cotizaciones" />
        <select value={projectId} onChange={e => setProjectId(e.target.value)} className={sel} aria-label="Filtrar por proyecto">
          <option value="">Todos los proyectos</option>
          {projects.map(p => <option key={p.id as number} value={String(p.id)}>{p.name as string}</option>)}
        </select>
        <select value={channel} onChange={e => setChannel(e.target.value)} className={sel} aria-label="Filtrar por canal">
          <option value="">Todos los canales</option>
          <option value="web">web</option>
          <option value="harry">harry</option>
          <option value="embed">embed</option>
        </select>
        <select value={followup} onChange={e => setFollowup(e.target.value)} className={sel} aria-label="Filtrar por seguimiento">
          <option value="">Todo seguimiento</option>
          {FOLLOWUP_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <button onClick={exportCSV} disabled={rows.length === 0}
          className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary)]/90 disabled:opacity-50">
          Exportar CSV ({rows.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-[var(--color-border)]">
              <tr>
                <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Código</th>
                <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Proyecto / Unidad</th>
                <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Precio</th>
                <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Cliente</th>
                <th className="text-center p-3 font-semibold text-[var(--color-primary)]">Canal</th>
                <th className="text-center p-3 font-semibold text-[var(--color-primary)]">Seguimiento</th>
                <th className="text-center p-3 font-semibold text-[var(--color-primary)]">Links</th>
                <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(q => (
                <tr key={q.id as number} className="border-t border-gray-100 hover:bg-gray-50/50 align-top">
                  <td className="p-3 font-mono font-medium text-[var(--color-primary)] whitespace-nowrap">{q.quotation_code as string}</td>
                  <td className="p-3">
                    <div>{q.project_name as string}</div>
                    <div className="text-xs text-[var(--color-text-light)]">{q.unit_code as string}</div>
                  </td>
                  <td className="p-3 text-right font-medium whitespace-nowrap">{formatCOP(q.list_price as string)}</td>
                  <td className="p-3">
                    <div>{(q.client_name as string) || <span className="text-gray-400">—</span>}</div>
                    <div className="text-xs text-[var(--color-text-light)]">{(q.client_phone as string) || ''}</div>
                    {!!q.admin_notes && <div className="text-xs text-amber-700 mt-1 max-w-[200px] truncate" title={String(q.admin_notes)}>📝 {q.admin_notes as string}</div>}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      q.channel === 'web' ? 'bg-blue-100 text-blue-700' : q.channel === 'harry' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'
                    }`}>{q.channel as string}</span>
                    {q.ghl_contact_id ? <div className="text-[10px] text-green-600 mt-1">GHL ✓</div> : null}
                  </td>
                  <td className="p-3 text-center">
                    <select value={(q.followup_status as string) || 'nueva'}
                      onChange={e => updateQuotation(q.id as number, { followup_status: e.target.value })}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer ${FOLLOWUP_COLORS[(q.followup_status as string) || 'nueva']}`}>
                      {FOLLOWUP_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <button onClick={() => { setNotesFor(q); setNotesDraft(String(q.admin_notes || '')); }}
                      className="block mx-auto text-[10px] text-[var(--color-primary)] hover:underline mt-1">notas</button>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    {q.pdf_url ? (
                      <a href={String(q.pdf_url)} target="_blank" rel="noopener noreferrer"
                        className="text-xs px-2 py-1 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 mr-1">PDF</a>
                    ) : null}
                    {q.share_token ? (
                      <button onClick={() => copyShare(q)}
                        className="text-xs px-2 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-primary)] font-semibold hover:bg-gray-50">Link</button>
                    ) : null}
                  </td>
                  <td className="p-3 text-[var(--color-text-light)] text-xs whitespace-nowrap">
                    {new Date(q.created_at as string).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-[var(--color-text-light)]">{loading ? 'Cargando…' : 'No hay cotizaciones con esos filtros.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {total > rows.length && (
          <div className="p-3 text-center border-t border-[var(--color-border)]">
            <button onClick={() => setLimit(l => l + 100)} className="text-sm text-[var(--color-primary)] font-semibold hover:underline">
              Mostrar más ({rows.length} de {total})
            </button>
          </div>
        )}
      </div>

      {/* Modal de notas */}
      {notesFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setNotesFor(null)}>
          <div className="bg-white w-full max-w-md rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-[var(--color-primary)] mb-1">Notas — {notesFor.quotation_code as string}</h3>
            <p className="text-xs text-[var(--color-text-light)] mb-3">{notesFor.client_name as string} · {notesFor.unit_code as string}</p>
            <textarea value={notesDraft} onChange={e => setNotesDraft(e.target.value)} rows={4} autoFocus
              placeholder="Ej: Llamado 12-jun, pide rebaja de separación, volver a contactar el lunes."
              className="w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            <div className="flex gap-2 mt-3">
              <button onClick={async () => { await updateQuotation(notesFor.id as number, { admin_notes: notesDraft }); setNotesFor(null); showMessage('Notas guardadas'); }}
                className="px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold">Guardar</button>
              <button onClick={() => setNotesFor(null)} className="px-5 py-2 rounded-lg border border-[var(--color-border)] text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
