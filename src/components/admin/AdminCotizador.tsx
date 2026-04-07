'use client';

import { useState, useEffect, useCallback } from 'react';

// ============================================================
// Types
// ============================================================

interface Project {
  id: number;
  slug: string;
  name: string;
  project_type: string;
  status: string;
  separation_value: string;
  ci_percentage: string;
  reference_rate_ea: string;
  is_active: boolean;
  units_available: string;
  units_sold: string;
  units_reserved: string;
  units_blocked: string;
  units_total: string;
}

interface Unit {
  id: number;
  unit_code: string;
  unit_type: string | null;
  unit_status: string;
  list_price: string;
  area_total_m2: string | null;
  area_private_m2: string | null;
  stage_name: string | null;
  internal_notes: string | null;
  project_slug: string;
}

interface Quotation {
  id: number;
  quotation_code: string;
  project_name: string;
  unit_code: string;
  unit_type: string | null;
  list_price: string;
  client_name: string | null;
  client_phone: string | null;
  client_email: string | null;
  channel: string;
  ghl_contact_id: string | null;
  created_at: string;
}

function formatCOP(n: number | string): string {
  const num = typeof n === 'string' ? parseInt(n) : n;
  if (!num) return '$0';
  return '$' + Math.round(num).toLocaleString('es-CO');
}

const STATUS_COLORS: Record<string, string> = {
  disponible: 'bg-green-100 text-green-800',
  reservado: 'bg-yellow-100 text-yellow-800',
  vendido: 'bg-gray-100 text-gray-600',
  bloqueado: 'bg-red-100 text-red-800',
};

// ============================================================
// Component
// ============================================================

export default function AdminCotizador() {
  const [tab, setTab] = useState<'projects' | 'inventory' | 'quotations'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load projects
  const loadProjects = useCallback(() => {
    fetch('/api/admin/projects').then(r => r.json()).then(setProjects);
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  // Load units when project selected
  useEffect(() => {
    if (selectedProjectId && tab === 'inventory') {
      fetch(`/api/admin/units?project_id=${selectedProjectId}`).then(r => r.json()).then(setUnits);
    }
  }, [selectedProjectId, tab]);

  // Load quotations
  useEffect(() => {
    if (tab === 'quotations') {
      const url = selectedProjectId
        ? `/api/admin/quotations?project_id=${selectedProjectId}`
        : '/api/admin/quotations';
      fetch(url).then(r => r.json()).then(setQuotations);
    }
  }, [tab, selectedProjectId]);

  async function updateUnit(id: number, fields: Record<string, unknown>) {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/admin/units', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields }),
    });
    if (res.ok) {
      setMessage('Actualizado');
      // Reload
      if (selectedProjectId) {
        fetch(`/api/admin/units?project_id=${selectedProjectId}`).then(r => r.json()).then(setUnits);
      }
      loadProjects();
      setTimeout(() => setMessage(''), 2000);
    }
    setSaving(false);
    setEditingUnit(null);
  }

  async function updateProject(id: number, fields: Record<string, unknown>) {
    setSaving(true);
    await fetch('/api/admin/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields }),
    });
    loadProjects();
    setSaving(false);
    setMessage('Proyecto actualizado');
    setTimeout(() => setMessage(''), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Admin Cotizador</h1>
          <p className="text-sm text-[var(--color-text-light)]">Gestiona proyectos, inventario y cotizaciones</p>
        </div>
        {message && (
          <span className="px-4 py-2 rounded-lg bg-green-100 text-green-800 text-sm font-medium">{message}</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-[var(--color-border)] p-1">
        {(['projects', 'inventory', 'quotations'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors ${
              tab === t
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text-light)] hover:bg-gray-50'
            }`}
          >
            {t === 'projects' ? 'Proyectos' : t === 'inventory' ? 'Inventario' : 'Cotizaciones'}
          </button>
        ))}
      </div>

      {/* Project selector for inventory/quotations */}
      {(tab === 'inventory' || tab === 'quotations') && (
        <div className="mb-6">
          <select
            value={selectedProjectId || ''}
            onChange={e => setSelectedProjectId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full sm:w-auto rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            <option value="">— Seleccionar proyecto —</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.units_available} disp.)</option>
            ))}
          </select>
        </div>
      )}

      {/* ---- TAB: Proyectos ---- */}
      {tab === 'projects' && (
        <div className="space-y-4">
          {projects.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-[var(--color-primary)]">{p.name}</h3>
                  <p className="text-sm text-[var(--color-text-light)]">/{p.slug} | {p.project_type} | {p.status}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 font-semibold">{p.units_available} disp.</span>
                  <span className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold">{p.units_reserved} reserv.</span>
                  <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 font-semibold">{p.units_sold} vend.</span>
                  <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-800 font-semibold">{p.units_blocked} bloq.</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
                <div>
                  <span className="text-[var(--color-text-light)]">Separación: </span>
                  <span className="font-semibold">{formatCOP(p.separation_value)}</span>
                </div>
                <div>
                  <span className="text-[var(--color-text-light)]">CI: </span>
                  <span className="font-semibold">{p.ci_percentage}%</span>
                </div>
                <div>
                  <span className="text-[var(--color-text-light)]">Tasa ref.: </span>
                  <span className="font-semibold">{p.reference_rate_ea}% EA</span>
                </div>
                <div>
                  <span className="text-[var(--color-text-light)]">Total: </span>
                  <span className="font-semibold">{p.units_total} unidades</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <select
                  defaultValue={p.status}
                  onChange={e => updateProject(p.id, { status: e.target.value })}
                  disabled={saving}
                  className="text-xs rounded-lg border border-[var(--color-border)] px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                >
                  <option value="preventa">Preventa</option>
                  <option value="construccion">Construcción</option>
                  <option value="entrega">Entrega</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                <button
                  onClick={() => { setTab('inventory'); setSelectedProjectId(p.id); }}
                  className="text-xs px-4 py-1.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors"
                >
                  Ver inventario
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- TAB: Inventario ---- */}
      {tab === 'inventory' && selectedProjectId && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                <tr>
                  <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Código</th>
                  <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Tipo</th>
                  <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Etapa</th>
                  <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Área</th>
                  <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Precio</th>
                  <th className="text-center p-3 font-semibold text-[var(--color-primary)]">Estado</th>
                  <th className="text-center p-3 font-semibold text-[var(--color-primary)]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {units.map(u => (
                  <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                    <td className="p-3 font-medium">{u.unit_code}</td>
                    <td className="p-3 text-[var(--color-text-light)]">{u.unit_type || '—'}</td>
                    <td className="p-3 text-[var(--color-text-light)]">{u.stage_name || '—'}</td>
                    <td className="p-3 text-right">{u.area_total_m2 ? `${parseFloat(u.area_total_m2).toLocaleString()} m²` : u.area_private_m2 ? `${parseFloat(u.area_private_m2).toLocaleString()} m²` : '—'}</td>
                    <td className="p-3 text-right font-medium">{formatCOP(u.list_price)}</td>
                    <td className="p-3 text-center">
                      <select
                        value={u.unit_status}
                        onChange={e => updateUnit(u.id, { unit_status: e.target.value })}
                        disabled={saving}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ${STATUS_COLORS[u.unit_status] || 'bg-gray-100'}`}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="reservado">Reservado</option>
                        <option value="vendido">Vendido</option>
                        <option value="bloqueado">Bloqueado</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setEditingUnit(editingUnit?.id === u.id ? null : u)}
                        className="text-xs text-[var(--color-primary)] hover:underline font-medium"
                      >
                        {editingUnit?.id === u.id ? 'Cerrar' : 'Editar'}
                      </button>
                    </td>
                  </tr>
                ))}
                {units.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-[var(--color-text-light)]">No hay unidades. Selecciona un proyecto.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Edit panel */}
          {editingUnit && (
            <div className="border-t border-[var(--color-border)] p-6 bg-gray-50">
              <h4 className="font-semibold text-[var(--color-primary)] mb-4">Editar {editingUnit.unit_code}</h4>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget);
                  const fields: Record<string, unknown> = {};
                  const price = form.get('list_price');
                  if (price) fields.list_price = parseInt(price as string);
                  const notes = form.get('internal_notes');
                  if (notes !== null) fields.internal_notes = notes;
                  const unitType = form.get('unit_type');
                  if (unitType !== null) fields.unit_type = unitType;
                  updateUnit(editingUnit.id, fields);
                }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Precio (COP)</label>
                  <input name="list_price" type="number" defaultValue={editingUnit.list_price}
                    className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Tipo</label>
                  <input name="unit_type" type="text" defaultValue={editingUnit.unit_type || ''}
                    className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Notas internas</label>
                  <input name="internal_notes" type="text" defaultValue={editingUnit.internal_notes || ''}
                    className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
                </div>
                <div className="sm:col-span-3">
                  <button type="submit" disabled={saving}
                    className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary)]/90 transition-colors disabled:opacity-50">
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ---- TAB: Cotizaciones ---- */}
      {tab === 'quotations' && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                <tr>
                  <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Código</th>
                  <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Proyecto</th>
                  <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Unidad</th>
                  <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Precio</th>
                  <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Cliente</th>
                  <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Tel.</th>
                  <th className="text-center p-3 font-semibold text-[var(--color-primary)]">Canal</th>
                  <th className="text-center p-3 font-semibold text-[var(--color-primary)]">GHL</th>
                  <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map(q => (
                  <tr key={q.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                    <td className="p-3 font-mono font-medium text-[var(--color-primary)]">{q.quotation_code}</td>
                    <td className="p-3">{q.project_name}</td>
                    <td className="p-3">{q.unit_code} {q.unit_type ? `(${q.unit_type})` : ''}</td>
                    <td className="p-3 text-right font-medium">{formatCOP(q.list_price)}</td>
                    <td className="p-3">{q.client_name || <span className="text-gray-400">—</span>}</td>
                    <td className="p-3 text-[var(--color-text-light)]">{q.client_phone || '—'}</td>
                    <td className="p-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        q.channel === 'web' ? 'bg-blue-100 text-blue-700' :
                        q.channel === 'harry' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{q.channel}</span>
                    </td>
                    <td className="p-3 text-center">
                      {q.ghl_contact_id ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">Sí</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-3 text-[var(--color-text-light)] text-xs">
                      {new Date(q.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
                {quotations.length === 0 && (
                  <tr><td colSpan={9} className="p-8 text-center text-[var(--color-text-light)]">No hay cotizaciones registradas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
