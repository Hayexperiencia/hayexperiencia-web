'use client';

import { useState } from 'react';
import { formatCOP, ImageUpload, type Row } from './shared';

function ProjectForm({ project, onSave, onCancel }: {
  project: Row | null;
  onSave: (data: Row) => void;
  onCancel: () => void;
}) {
  const isEdit = !!project?.id;
  const [form, setForm] = useState<Row>(project || {
    slug: '', name: '', project_type: 'parcelacion', status: 'preventa',
    location: '', delivery_date_text: '', separation_value: 5000000,
    ci_percentage: 30, ci_target_date: '2027-06-30', ci_date_mode: 'fixed',
    ci_dynamic_months: 6, reference_rate_ea: 12.50, loan_term_years: 15,
    max_loan_pct: 70, life_insurance_monthly: 90000, fire_insurance_rate_annual: 0.002520,
    cash_discount_pct: 0, appreciation_rate_annual: 0, quote_validity_days: 15,
    contact_whatsapp: '', advisor_name: '',
    cover_image_url: '', logo_url: '', sort_order: 0, description: '',
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const fields: { key: string; label: string; type: string; options?: string[]; hint?: string }[] = [
    { key: 'name', label: 'Nombre del proyecto', type: 'text' },
    { key: 'slug', label: 'Slug (URL)', type: 'text' },
    { key: 'project_type', label: 'Tipo', type: 'select', options: ['parcelacion', 'vertical', 'mixto'] },
    { key: 'status', label: 'Estado', type: 'select', options: ['preventa', 'construccion', 'entrega', 'inactivo'] },
    { key: 'location', label: 'Ubicación', type: 'text' },
    { key: 'delivery_date_text', label: 'Entrega (texto)', type: 'text' },
    { key: 'separation_value', label: 'Separación (COP)', type: 'number' },
    { key: 'ci_percentage', label: 'CI mínima (%)', type: 'number' },
    { key: 'ci_target_date', label: 'Fecha meta CI', type: 'date' },
    { key: 'ci_date_mode', label: 'Modo fecha CI', type: 'select', options: ['fixed', 'dynamic'] },
    { key: 'ci_dynamic_months', label: 'Meses dinámicos CI', type: 'number' },
    { key: 'reference_rate_ea', label: 'Tasa referencia (% EA)', type: 'number' },
    { key: 'loan_term_years', label: 'Plazo crédito (años)', type: 'number' },
    { key: 'max_loan_pct', label: 'Máx financiación (%)', type: 'number' },
    { key: 'life_insurance_monthly', label: 'Seguro vida mensual (COP)', type: 'number' },
    { key: 'fire_insurance_rate_annual', label: 'Tasa seguro incendio anual', type: 'number' },
    { key: 'cash_discount_pct', label: 'Descuento contado (%)', type: 'number', hint: '0 = sin escenario de contado' },
    { key: 'appreciation_rate_annual', label: 'Valorización anual (%)', type: 'number', hint: '0 = sin proyección' },
    { key: 'quote_validity_days', label: 'Vigencia cotización (días)', type: 'number' },
    { key: 'contact_whatsapp', label: 'WhatsApp del proyecto', type: 'text', hint: 'Ej: 573022343659' },
    { key: 'advisor_name', label: 'Asesor comercial', type: 'text' },
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
                step={f.key.includes('rate') || f.key.includes('percentage') || f.key.includes('pct') ? '0.01' : undefined}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            )}
            {f.hint && <p className="text-[10px] text-[var(--color-text-light)] mt-0.5">{f.hint}</p>}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Descripción (visible en el cotizador y el PDF)</label>
        <textarea value={String(form.description ?? '')} onChange={e => set('description', e.target.value)} rows={3}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
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

export default function ProjectsTab({ projects, reload, showMessage, goToInventory }: {
  projects: Row[];
  reload: () => void;
  showMessage: (m: string) => void;
  goToInventory: (projectId: number) => void;
}) {
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);

  async function saveProject(data: Row) {
    const isEdit = !!data.id;
    const res = await fetch('/api/admin/projects', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      showMessage(isEdit ? 'Proyecto actualizado' : 'Proyecto creado');
      reload();
      setEditing(null);
      setCreating(false);
    } else {
      const err = await res.json().catch(() => ({}));
      showMessage(`Error: ${err.error || res.status}`);
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
    reload();
  }

  return (
    <div>
      {!creating && !editing && (
        <button onClick={() => setCreating(true)}
          className="mb-4 px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold text-sm hover:bg-[var(--color-accent-light)] transition-colors">
          + Crear proyecto
        </button>
      )}

      {creating && <div className="mb-4"><ProjectForm project={null} onSave={saveProject} onCancel={() => setCreating(false)} /></div>}
      {editing && <div className="mb-4"><ProjectForm project={editing} onSave={saveProject} onCancel={() => setEditing(null)} /></div>}

      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id as number} className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex gap-4">
                {p.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={String(p.cover_image_url)} alt="" className="w-24 h-16 object-cover rounded-lg" />
                ) : null}
                <div>
                  <h3 className="font-bold text-lg text-[var(--color-primary)]">{p.name as string}</h3>
                  <p className="text-sm text-[var(--color-text-light)]">/{p.slug as string} | {p.project_type as string} | {p.status as string} | {(p.location as string) || '—'}</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs flex-wrap">
                <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 font-semibold">{p.units_available as string} disp.</span>
                <span className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold">{p.units_reserved as string} res.</span>
                <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 font-semibold">{p.units_sold as string} vend.</span>
                <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-800 font-semibold">{p.units_blocked as string} bloq.</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-3 text-xs text-[var(--color-text-light)]">
              <span>Sep: <strong className="text-[var(--color-primary)]">{formatCOP(p.separation_value as string)}</strong></span>
              <span>CI: <strong className="text-[var(--color-primary)]">{Number(p.ci_percentage)}%</strong></span>
              <span>Tasa: <strong className="text-[var(--color-primary)]">{Number(p.reference_rate_ea)}% EA</strong></span>
              <span>Plazo: <strong className="text-[var(--color-primary)]">{p.loan_term_years as number} años</strong></span>
              <span>Contado: <strong className={Number(p.cash_discount_pct) > 0 ? 'text-green-700' : 'text-[var(--color-primary)]'}>{Number(p.cash_discount_pct) || 0}%</strong></span>
              <span>Valoriz.: <strong className="text-[var(--color-primary)]">{Number(p.appreciation_rate_annual) || 0}%</strong></span>
              <span>Total: <strong className="text-[var(--color-primary)]">{p.units_total as string} uds</strong></span>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditing(p)}
                className="text-xs px-4 py-1.5 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 transition-colors">
                Editar
              </button>
              <button onClick={() => goToInventory(p.id as number)}
                className="text-xs px-4 py-1.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors">
                Ver inventario
              </button>
              <a href={`/cotizador?proyecto=${p.slug}`} target="_blank" rel="noopener noreferrer"
                className="text-xs px-4 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-primary)] font-semibold hover:bg-gray-50 transition-colors">
                Ver cotizador
              </a>
              <button onClick={() => deleteProject(p.id as number, p.name as string)}
                className="text-xs px-4 py-1.5 rounded-lg border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
