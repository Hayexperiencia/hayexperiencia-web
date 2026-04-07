'use client';

import { useState, useEffect, useCallback } from 'react';

function formatCOP(n: number | string): string {
  const num = typeof n === 'string' ? parseInt(n) : n;
  if (!num) return '$0';
  return '$' + Math.round(num).toLocaleString('es-CO');
}

const STATUS_COLORS: Record<string, string> = {
  disponible: 'bg-green-100 text-green-800',
  reservado: 'bg-yellow-100 text-yellow-800',
  vendido: 'bg-gray-200 text-gray-700',
  bloqueado: 'bg-red-100 text-red-800',
};

// ============================================================
// Image Upload Component
// ============================================================
function ImageUpload({ folder, currentUrl, onUploaded }: { folder: string; currentUrl: string | null; onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) onUploaded(data.url);
    } catch { /* ignore */ }
    setUploading(false);
  }

  return (
    <div>
      {currentUrl && (
        <img src={currentUrl} alt="" className="w-20 h-14 object-cover rounded-lg mb-2 border" />
      )}
      <label className="cursor-pointer text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[var(--color-primary)] font-medium transition-colors">
        {uploading ? 'Subiendo...' : currentUrl ? 'Cambiar' : 'Subir imagen'}
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}

// ============================================================
// Project Form (Create/Edit)
// ============================================================
function ProjectForm({ project, onSave, onCancel }: {
  project: Record<string, unknown> | null;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const isEdit = !!project?.id;
  const [form, setForm] = useState<Record<string, unknown>>(project || {
    slug: '', name: '', project_type: 'parcelacion', status: 'preventa',
    location: '', delivery_date_text: '', separation_value: 5000000,
    ci_percentage: 30, ci_target_date: '2027-06-30', ci_date_mode: 'fixed',
    ci_dynamic_months: 6, reference_rate_ea: 12.50, loan_term_years: 15,
    max_loan_pct: 70, life_insurance_monthly: 90000, fire_insurance_rate_annual: 0.002520,
    cover_image_url: '', logo_url: '', sort_order: 0,
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const fields: { key: string; label: string; type: string; options?: string[] }[] = [
    { key: 'name', label: 'Nombre del proyecto', type: 'text' },
    { key: 'slug', label: 'Slug (URL)', type: 'text' },
    { key: 'project_type', label: 'Tipo', type: 'select', options: ['parcelacion', 'vertical', 'mixto'] },
    { key: 'status', label: 'Estado', type: 'select', options: ['preventa', 'construccion', 'entrega', 'inactivo'] },
    { key: 'location', label: 'Ubicación', type: 'text' },
    { key: 'delivery_date_text', label: 'Entrega (texto)', type: 'text' },
    { key: 'separation_value', label: 'Separación (COP)', type: 'number' },
    { key: 'ci_percentage', label: 'CI (%)', type: 'number' },
    { key: 'ci_target_date', label: 'Fecha meta CI', type: 'date' },
    { key: 'ci_date_mode', label: 'Modo fecha CI', type: 'select', options: ['fixed', 'dynamic'] },
    { key: 'ci_dynamic_months', label: 'Meses dinámicos CI', type: 'number' },
    { key: 'reference_rate_ea', label: 'Tasa referencia (% EA)', type: 'number' },
    { key: 'loan_term_years', label: 'Plazo crédito (años)', type: 'number' },
    { key: 'max_loan_pct', label: 'Máx financiación (%)', type: 'number' },
    { key: 'life_insurance_monthly', label: 'Seguro vida mensual (COP)', type: 'number' },
    { key: 'fire_insurance_rate_annual', label: 'Tasa seguro incendio anual', type: 'number' },
    { key: 'sort_order', label: 'Orden', type: 'number' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
      <h3 className="font-bold text-lg text-[var(--color-primary)] mb-4">
        {isEdit ? `Editar: ${form.name}` : 'Crear proyecto'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">{f.label}</label>
            {f.type === 'select' ? (
              <select value={String(form[f.key] || '')} onChange={e => set(f.key, e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type} value={String(form[f.key] ?? '')}
                onChange={e => set(f.key, f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                step={f.key.includes('rate') || f.key.includes('percentage') ? '0.01' : undefined}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Logo del proyecto</label>
          <ImageUpload folder={`projects/${form.slug || 'new'}`} currentUrl={form.logo_url as string | null}
            onUploaded={url => set('logo_url', url)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Imagen de portada</label>
          <ImageUpload folder={`projects/${form.slug || 'new'}`} currentUrl={form.cover_image_url as string | null}
            onUploaded={url => set('cover_image_url', url)} />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSave(form)}
          className="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary)]/90 transition-colors">
          {isEdit ? 'Guardar cambios' : 'Crear proyecto'}
        </button>
        <button onClick={onCancel}
          className="px-6 py-2.5 rounded-lg border border-[var(--color-border)] text-sm font-medium hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Unit Form (Create/Edit)
// ============================================================
function UnitForm({ unit, projectId, projectType, onSave, onCancel }: {
  unit: Record<string, unknown> | null;
  projectId: number;
  projectType: string;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const isEdit = !!unit?.id;
  const isParcelacion = projectType === 'parcelacion';
  const [form, setForm] = useState<Record<string, unknown>>(unit || {
    project_id: projectId, unit_code: '', unit_type: '', list_price: 0,
    unit_status: 'disponible', area_total_m2: '', area_private_m2: '',
    area_built_m2: '', area_terrace_m2: '', bedrooms: '', bathrooms: '',
    has_parking: false, parking_type: '', has_storage: false,
    tower: '', floor_number: '', view_description: '', image_url: '',
    internal_notes: '',
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-5 mb-4">
      <h4 className="font-semibold text-[var(--color-primary)] mb-3">
        {isEdit ? `Editar ${form.unit_code}` : 'Agregar unidad'}
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Código *</label>
          <input type="text" value={String(form.unit_code || '')} onChange={e => set('unit_code', e.target.value)}
            placeholder="Lote 1, N1V1, Apto 101" className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Tipo</label>
          <input type="text" value={String(form.unit_type || '')} onChange={e => set('unit_type', e.target.value)}
            placeholder="LUZ, VILLA, etc." className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Precio (COP) *</label>
          <input type="number" value={String(form.list_price || '')} onChange={e => set('list_price', parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Estado</label>
          <select value={String(form.unit_status || 'disponible')} onChange={e => set('unit_status', e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none">
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
        </div>
        {isParcelacion ? (
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Área total (m²)</label>
            <input type="number" step="0.01" value={String(form.area_total_m2 || '')} onChange={e => set('area_total_m2', e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Área privada (m²)</label>
              <input type="number" step="0.01" value={String(form.area_private_m2 || '')} onChange={e => set('area_private_m2', e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Área construida (m²)</label>
              <input type="number" step="0.01" value={String(form.area_built_m2 || '')} onChange={e => set('area_built_m2', e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Terraza (m²)</label>
              <input type="number" step="0.01" value={String(form.area_terrace_m2 || '')} onChange={e => set('area_terrace_m2', e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Habitaciones</label>
              <input type="number" value={String(form.bedrooms || '')} onChange={e => set('bedrooms', parseInt(e.target.value) || null)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Baños</label>
              <input type="number" value={String(form.bathrooms || '')} onChange={e => set('bathrooms', parseInt(e.target.value) || null)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Torre/Núcleo</label>
              <input type="text" value={String(form.tower || '')} onChange={e => set('tower', e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Piso</label>
              <input type="number" value={String(form.floor_number || '')} onChange={e => set('floor_number', parseInt(e.target.value) || null)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
            </div>
          </>
        )}
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Vista</label>
          <input type="text" value={String(form.view_description || '')} onChange={e => set('view_description', e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Notas internas</label>
          <input type="text" value={String(form.internal_notes || '')} onChange={e => set('internal_notes', e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none" />
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.has_parking} onChange={e => set('has_parking', e.target.checked)} className="rounded" />
            Parqueadero
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.has_storage} onChange={e => set('has_storage', e.target.checked)} className="rounded" />
            Depósito
          </label>
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Imagen de la unidad</label>
        <ImageUpload folder="units" currentUrl={form.image_url as string | null} onUploaded={url => set('image_url', url)} />
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSave({ ...form, project_id: projectId })}
          className="px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary)]/90 transition-colors">
          {isEdit ? 'Guardar' : 'Crear unidad'}
        </button>
        <button onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Main Admin Component
// ============================================================
export default function AdminCotizador() {
  const [tab, setTab] = useState<'projects' | 'inventory' | 'quotations'>('projects');
  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [units, setUnits] = useState<Record<string, unknown>[]>([]);
  const [quotations, setQuotations] = useState<Record<string, unknown>[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Record<string, unknown> | null>(null);
  const [creatingProject, setCreatingProject] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Record<string, unknown> | null>(null);
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [message, setMessage] = useState('');

  const showMessage = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const selectedProject = projects.find(p => p.id === selectedProjectId) as Record<string, unknown> | undefined;

  const loadProjects = useCallback(() => {
    fetch('/api/admin/projects').then(r => r.json()).then(setProjects);
  }, []);

  const loadUnits = useCallback(() => {
    if (selectedProjectId) {
      fetch(`/api/admin/units?project_id=${selectedProjectId}`).then(r => r.json()).then(setUnits);
    }
  }, [selectedProjectId]);

  useEffect(() => { loadProjects(); }, [loadProjects]);
  useEffect(() => { if (tab === 'inventory') loadUnits(); }, [tab, loadUnits]);
  useEffect(() => {
    if (tab === 'quotations') {
      const url = selectedProjectId ? `/api/admin/quotations?project_id=${selectedProjectId}` : '/api/admin/quotations';
      fetch(url).then(r => r.json()).then(setQuotations);
    }
  }, [tab, selectedProjectId]);

  async function saveProject(data: Record<string, unknown>) {
    const isEdit = !!data.id;
    const res = await fetch('/api/admin/projects', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      showMessage(isEdit ? 'Proyecto actualizado' : 'Proyecto creado');
      loadProjects();
      setEditingProject(null);
      setCreatingProject(false);
    }
  }

  async function deleteProject(id: number, name: string) {
    if (!confirm(`Eliminar "${name}"? Esto borrara todas las unidades y cotizaciones del proyecto.`)) return;
    await fetch('/api/admin/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    showMessage('Proyecto eliminado');
    loadProjects();
    if (selectedProjectId === id) setSelectedProjectId(null);
  }

  async function saveUnit(data: Record<string, unknown>) {
    const isEdit = !!data.id;
    const res = await fetch('/api/admin/units', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      showMessage(isEdit ? 'Unidad actualizada' : 'Unidad creada');
      loadUnits();
      loadProjects();
      setEditingUnit(null);
      setCreatingUnit(false);
    }
  }

  async function deleteUnit(id: number, code: string) {
    if (!confirm(`Eliminar "${code}"?`)) return;
    await fetch('/api/admin/units', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    showMessage('Unidad eliminada');
    loadUnits();
    loadProjects();
  }

  async function quickUpdateUnit(id: number, field: string, value: unknown) {
    await fetch('/api/admin/units', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, [field]: value }),
    });
    loadUnits();
    loadProjects();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Admin Cotizador</h1>
          <p className="text-sm text-[var(--color-text-light)]">Gestiona proyectos, inventario y cotizaciones</p>
        </div>
        {message && <span className="px-4 py-2 rounded-lg bg-green-100 text-green-800 text-sm font-medium animate-pulse">{message}</span>}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-[var(--color-border)] p-1">
        {(['projects', 'inventory', 'quotations'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-light)] hover:bg-gray-50'}`}>
            {t === 'projects' ? 'Proyectos' : t === 'inventory' ? 'Inventario' : 'Cotizaciones'}
          </button>
        ))}
      </div>

      {/* Project selector */}
      {(tab === 'inventory' || tab === 'quotations') && (
        <div className="mb-6">
          <select value={selectedProjectId || ''} onChange={e => setSelectedProjectId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full sm:w-auto rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
            <option value="">— Seleccionar proyecto —</option>
            {projects.map((p: Record<string, unknown>) => (
              <option key={p.id as number} value={p.id as number}>{p.name as string} ({p.units_available as string} disp.)</option>
            ))}
          </select>
        </div>
      )}

      {/* ======== PROYECTOS ======== */}
      {tab === 'projects' && (
        <div>
          {!creatingProject && !editingProject && (
            <button onClick={() => setCreatingProject(true)}
              className="mb-4 px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold text-sm hover:bg-[var(--color-accent-light)] transition-colors">
              + Crear proyecto
            </button>
          )}

          {creatingProject && (
            <div className="mb-4">
              <ProjectForm project={null} onSave={saveProject} onCancel={() => setCreatingProject(false)} />
            </div>
          )}

          {editingProject && (
            <div className="mb-4">
              <ProjectForm project={editingProject} onSave={saveProject} onCancel={() => setEditingProject(null)} />
            </div>
          )}

          <div className="space-y-4">
            {projects.map((p: Record<string, unknown>) => (
              <div key={p.id as number} className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex gap-4">
                    {p.cover_image_url ? (
                      <img src={String(p.cover_image_url)} alt="" className="w-24 h-16 object-cover rounded-lg" />
                    ) : null}
                    <div>
                      <h3 className="font-bold text-lg text-[var(--color-primary)]">{p.name as string}</h3>
                      <p className="text-sm text-[var(--color-text-light)]">/{p.slug as string} | {p.project_type as string} | {p.status as string} | {p.location as string || '—'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs flex-wrap">
                    <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 font-semibold">{p.units_available as string} disp.</span>
                    <span className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold">{p.units_reserved as string} res.</span>
                    <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 font-semibold">{p.units_sold as string} vend.</span>
                    <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-800 font-semibold">{p.units_blocked as string} bloq.</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-xs text-[var(--color-text-light)]">
                  <span>Sep: <strong className="text-[var(--color-primary)]">{formatCOP(p.separation_value as string)}</strong></span>
                  <span>CI: <strong className="text-[var(--color-primary)]">{p.ci_percentage as string}%</strong></span>
                  <span>Tasa: <strong className="text-[var(--color-primary)]">{p.reference_rate_ea as string}% EA</strong></span>
                  <span>Plazo: <strong className="text-[var(--color-primary)]">{p.loan_term_years as string} años</strong></span>
                  <span>Total: <strong className="text-[var(--color-primary)]">{p.units_total as string} uds</strong></span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setEditingProject(p)}
                    className="text-xs px-4 py-1.5 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 transition-colors">
                    Editar
                  </button>
                  <button onClick={() => { setTab('inventory'); setSelectedProjectId(p.id as number); }}
                    className="text-xs px-4 py-1.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors">
                    Ver inventario
                  </button>
                  <button onClick={() => deleteProject(p.id as number, p.name as string)}
                    className="text-xs px-4 py-1.5 rounded-lg border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======== INVENTARIO ======== */}
      {tab === 'inventory' && selectedProjectId && (
        <div>
          {!creatingUnit && !editingUnit && (
            <button onClick={() => setCreatingUnit(true)}
              className="mb-4 px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold text-sm hover:bg-[var(--color-accent-light)] transition-colors">
              + Agregar unidad
            </button>
          )}

          {creatingUnit && (
            <UnitForm unit={null} projectId={selectedProjectId} projectType={selectedProject?.project_type as string || 'parcelacion'}
              onSave={saveUnit} onCancel={() => setCreatingUnit(false)} />
          )}

          {editingUnit && (
            <UnitForm unit={editingUnit} projectId={selectedProjectId} projectType={selectedProject?.project_type as string || 'parcelacion'}
              onSave={saveUnit} onCancel={() => setEditingUnit(null)} />
          )}

          <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                  <tr>
                    <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Código</th>
                    <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Tipo</th>
                    <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Img</th>
                    <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Área</th>
                    <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Precio</th>
                    <th className="text-center p-3 font-semibold text-[var(--color-primary)]">Estado</th>
                    <th className="text-center p-3 font-semibold text-[var(--color-primary)]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((u: Record<string, unknown>) => (
                    <tr key={u.id as number} className="border-t border-gray-100 hover:bg-gray-50/50">
                      <td className="p-3 font-medium">{u.unit_code as string}</td>
                      <td className="p-3 text-[var(--color-text-light)]">{(u.unit_type as string) || '—'}</td>
                      <td className="p-3">
                        {u.image_url ? <img src={u.image_url as string} alt="" className="w-10 h-7 object-cover rounded" /> : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="p-3 text-right text-xs">
                        {u.area_total_m2 ? `${parseFloat(u.area_total_m2 as string).toLocaleString()} m²` :
                         u.area_private_m2 ? `${parseFloat(u.area_private_m2 as string).toLocaleString()} m² priv.` : '—'}
                      </td>
                      <td className="p-3 text-right font-medium">{formatCOP(u.list_price as string)}</td>
                      <td className="p-3 text-center">
                        <select value={u.unit_status as string}
                          onChange={e => quickUpdateUnit(u.id as number, 'unit_status', e.target.value)}
                          className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ${STATUS_COLORS[(u.unit_status as string)] || 'bg-gray-100'}`}>
                          <option value="disponible">Disponible</option>
                          <option value="reservado">Reservado</option>
                          <option value="vendido">Vendido</option>
                          <option value="bloqueado">Bloqueado</option>
                        </select>
                      </td>
                      <td className="p-3 text-center space-x-2">
                        <button onClick={() => setEditingUnit(u)} className="text-xs text-[var(--color-primary)] hover:underline font-medium">Editar</button>
                        <button onClick={() => deleteUnit(u.id as number, u.unit_code as string)} className="text-xs text-red-500 hover:underline font-medium">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                  {units.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-[var(--color-text-light)]">No hay unidades.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======== COTIZACIONES ======== */}
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
                {quotations.map((q: Record<string, unknown>) => (
                  <tr key={q.id as number} className="border-t border-gray-100 hover:bg-gray-50/50">
                    <td className="p-3 font-mono font-medium text-[var(--color-primary)]">{q.quotation_code as string}</td>
                    <td className="p-3">{q.project_name as string}</td>
                    <td className="p-3">{q.unit_code as string}</td>
                    <td className="p-3 text-right font-medium">{formatCOP(q.list_price as string)}</td>
                    <td className="p-3">{(q.client_name as string) || <span className="text-gray-400">—</span>}</td>
                    <td className="p-3 text-[var(--color-text-light)]">{(q.client_phone as string) || '—'}</td>
                    <td className="p-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        q.channel === 'web' ? 'bg-blue-100 text-blue-700' : q.channel === 'harry' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>{q.channel as string}</span>
                    </td>
                    <td className="p-3 text-center">
                      {q.ghl_contact_id ? <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">Si</span> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="p-3 text-[var(--color-text-light)] text-xs">
                      {new Date(q.created_at as string).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
                {quotations.length === 0 && (
                  <tr><td colSpan={9} className="p-8 text-center text-[var(--color-text-light)]">No hay cotizaciones.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
