'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatCOP, ImageUpload, STATUS_COLORS, type Row } from './shared';

function UnitForm({ unit, projectId, projectType, onSave, onCancel }: {
  unit: Row | null;
  projectId: number;
  projectType: string;
  onSave: (data: Row) => void;
  onCancel: () => void;
}) {
  const isEdit = !!unit?.id;
  const isParcelacion = projectType === 'parcelacion';
  const [form, setForm] = useState<Row>(unit || {
    project_id: projectId, unit_code: '', unit_type: '', list_price: 0,
    unit_status: 'disponible', area_total_m2: '', area_private_m2: '',
    area_built_m2: '', area_terrace_m2: '', bedrooms: '', bathrooms: '',
    has_parking: false, parking_type: '', has_storage: false,
    tower: '', floor_number: '', view_description: '', image_url: '',
    internal_notes: '', description: '',
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const input = 'w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none';

  return (
    <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-5 mb-4">
      <h4 className="font-semibold text-[var(--color-primary)] mb-3">
        {isEdit ? `Editar ${form.unit_code}` : 'Agregar unidad'}
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Código *</label>
          <input type="text" value={String(form.unit_code || '')} onChange={e => set('unit_code', e.target.value)}
            placeholder="Lote 1, N1V1, Apto 101" className={input} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Tipo</label>
          <input type="text" value={String(form.unit_type || '')} onChange={e => set('unit_type', e.target.value)}
            placeholder="LUZ, VILLA, etc." className={input} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Precio (COP) *</label>
          <input type="number" value={String(form.list_price || '')} onChange={e => set('list_price', parseInt(e.target.value) || 0)} className={input} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Estado</label>
          <select value={String(form.unit_status || 'disponible')} onChange={e => set('unit_status', e.target.value)} className={input}>
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
        </div>
        {isParcelacion ? (
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Área total (m²)</label>
            <input type="number" step="0.01" value={String(form.area_total_m2 || '')} onChange={e => set('area_total_m2', e.target.value)} className={input} />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Área privada (m²)</label>
              <input type="number" step="0.01" value={String(form.area_private_m2 || '')} onChange={e => set('area_private_m2', e.target.value)} className={input} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Área construida (m²)</label>
              <input type="number" step="0.01" value={String(form.area_built_m2 || '')} onChange={e => set('area_built_m2', e.target.value)} className={input} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Terraza (m²)</label>
              <input type="number" step="0.01" value={String(form.area_terrace_m2 || '')} onChange={e => set('area_terrace_m2', e.target.value)} className={input} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Habitaciones</label>
              <input type="number" value={String(form.bedrooms || '')} onChange={e => set('bedrooms', parseInt(e.target.value) || null)} className={input} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Baños</label>
              <input type="number" value={String(form.bathrooms || '')} onChange={e => set('bathrooms', parseInt(e.target.value) || null)} className={input} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Torre/Núcleo</label>
              <input type="text" value={String(form.tower || '')} onChange={e => set('tower', e.target.value)} className={input} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Piso</label>
              <input type="number" value={String(form.floor_number || '')} onChange={e => set('floor_number', parseInt(e.target.value) || null)} className={input} />
            </div>
          </>
        )}
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Vista</label>
          <input type="text" value={String(form.view_description || '')} onChange={e => set('view_description', e.target.value)} className={input} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Notas internas</label>
          <input type="text" value={String(form.internal_notes || '')} onChange={e => set('internal_notes', e.target.value)} className={input} />
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
        <label className="block text-xs font-medium text-[var(--color-text-light)] mb-1">Descripción (visible al cliente)</label>
        <input type="text" value={String(form.description || '')} onChange={e => set('description', e.target.value)} className={input} />
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

function TypeImagesPanel({ projectId, unitTypes, showMessage }: {
  projectId: number;
  unitTypes: string[];
  showMessage: (m: string) => void;
}) {
  const [images, setImages] = useState<Row[]>([]);
  const [type, setType] = useState(unitTypes[0] || '');

  const load = useCallback(() => {
    fetch(`/api/admin/unit-type-images?project_id=${projectId}`)
      .then(r => r.json())
      .then(d => setImages(Array.isArray(d) ? d : []));
  }, [projectId]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (unitTypes.length && !unitTypes.includes(type)) setType(unitTypes[0]); }, [unitTypes, type]);

  async function addImage(url: string) {
    if (!type) return;
    const sorts = images.filter(i => i.unit_type === type).map(i => Number(i.sort_order));
    const next = sorts.length ? Math.max(...sorts) + 1 : 0;
    await fetch('/api/admin/unit-type-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, unit_type: type, image_url: url, sort_order: next }),
    });
    showMessage(`Imagen agregada a tipo ${type}`);
    load();
  }

  async function removeImage(img: Row) {
    await fetch('/api/admin/unit-type-images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, unit_type: img.unit_type, sort_order: img.sort_order }),
    });
    showMessage('Imagen eliminada');
    load();
  }

  if (unitTypes.length === 0) return null;

  return (
    <details className="bg-white rounded-2xl border border-[var(--color-border)] p-5 mt-4">
      <summary className="cursor-pointer text-sm font-bold text-[var(--color-primary)]">
        Imágenes por tipo de unidad ({images.length})
      </summary>
      <p className="text-xs text-[var(--color-text-light)] mt-2 mb-3">
        La imagen con orden 0 es la que ven el cotizador y el PDF cuando la unidad no tiene foto propia.
      </p>
      <div className="flex items-center gap-3 mb-4">
        <select value={type} onChange={e => setType(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
          {unitTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <ImageUpload folder={`unit-types/${projectId}`} currentUrl={null} onUploaded={addImage} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {images.filter(i => i.unit_type === type).map((img, idx) => (
          <div key={idx} className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={String(img.image_url)} alt={String(img.caption || img.unit_type)} className="w-full h-24 object-cover rounded-lg border" />
            <span className="absolute top-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">#{String(img.sort_order)}</span>
            <button onClick={() => removeImage(img)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
          </div>
        ))}
      </div>
    </details>
  );
}

export default function InventoryTab({ projectId, projectType, reloadProjects, showMessage }: {
  projectId: number;
  projectType: string;
  reloadProjects: () => void;
  showMessage: (m: string) => void;
}) {
  const [units, setUnits] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState('status');
  const [bulkValue, setBulkValue] = useState('reservado');

  const loadUnits = useCallback(() => {
    fetch(`/api/admin/units?project_id=${projectId}`)
      .then(r => r.json())
      .then(d => setUnits(Array.isArray(d) ? d : []));
  }, [projectId]);

  useEffect(() => { loadUnits(); setSelected([]); }, [loadUnits]);

  async function saveUnit(data: Row) {
    const isEdit = !!data.id;
    const res = await fetch('/api/admin/units', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      showMessage(isEdit ? 'Unidad actualizada' : 'Unidad creada');
      loadUnits(); reloadProjects();
      setEditing(null); setCreating(false);
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
    loadUnits(); reloadProjects();
  }

  async function quickUpdateUnit(id: number, field: string, value: unknown) {
    await fetch('/api/admin/units', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, [field]: value }),
    });
    loadUnits(); reloadProjects();
  }

  async function applyBulk() {
    if (selected.length === 0) return;
    const value = bulkAction === 'status' ? bulkValue : Number(bulkValue);
    const labels: Record<string, string> = {
      status: `cambiar estado a "${bulkValue}"`,
      price_pct: `ajustar precio ${Number(bulkValue) >= 0 ? '+' : ''}${bulkValue}%`,
      price_set: `fijar precio en ${formatCOP(Number(bulkValue))}`,
    };
    if (!confirm(`${labels[bulkAction]} en ${selected.length} unidades?`)) return;
    const res = await fetch('/api/admin/units/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selected, action: bulkAction, value }),
    });
    const data = await res.json();
    showMessage(res.ok ? `${data.updated} unidades actualizadas` : `Error: ${data.error}`);
    setSelected([]);
    loadUnits(); reloadProjects();
  }

  const toggleAll = () => setSelected(s => s.length === units.length ? [] : units.map(u => u.id as number));
  const unitTypes = Array.from(new Set(units.map(u => (u.unit_type as string) || '').filter(Boolean)));

  return (
    <div>
      {!creating && !editing && (
        <button onClick={() => setCreating(true)}
          className="mb-4 px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold text-sm hover:bg-[var(--color-accent-light)] transition-colors">
          + Agregar unidad
        </button>
      )}

      {creating && <UnitForm unit={null} projectId={projectId} projectType={projectType} onSave={saveUnit} onCancel={() => setCreating(false)} />}
      {editing && <UnitForm unit={editing} projectId={projectId} projectType={projectType} onSave={saveUnit} onCancel={() => setEditing(null)} />}

      {/* Barra de acciones masivas */}
      {selected.length > 0 && (
        <div className="mb-3 p-3 rounded-xl bg-[var(--color-primary)] text-white flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold">{selected.length} seleccionadas:</span>
          <select value={bulkAction} onChange={e => { setBulkAction(e.target.value); setBulkValue(e.target.value === 'status' ? 'reservado' : ''); }}
            className="rounded-lg px-3 py-1.5 text-sm text-[var(--color-primary)]">
            <option value="status">Cambiar estado</option>
            <option value="price_pct">Ajustar precio %</option>
            <option value="price_set">Fijar precio COP</option>
          </select>
          {bulkAction === 'status' ? (
            <select value={bulkValue} onChange={e => setBulkValue(e.target.value)} className="rounded-lg px-3 py-1.5 text-sm text-[var(--color-primary)]">
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
          ) : (
            <input type="number" value={bulkValue} onChange={e => setBulkValue(e.target.value)}
              placeholder={bulkAction === 'price_pct' ? 'Ej: 5 o -3' : 'Ej: 185000000'}
              className="rounded-lg px-3 py-1.5 text-sm text-[var(--color-primary)] w-36" />
          )}
          <button onClick={applyBulk} disabled={bulkAction !== 'status' && bulkValue === ''}
            className="px-4 py-1.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-bold disabled:opacity-50">
            Aplicar
          </button>
          <button onClick={() => setSelected([])} className="text-xs text-gray-300 hover:text-white">Cancelar</button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-[var(--color-border)]">
              <tr>
                <th className="p-3">
                  <input type="checkbox" checked={selected.length === units.length && units.length > 0} onChange={toggleAll} className="rounded" aria-label="Seleccionar todas" />
                </th>
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
              {units.map(u => (
                <tr key={u.id as number} className="border-t border-gray-100 hover:bg-gray-50/50">
                  <td className="p-3 text-center">
                    <input type="checkbox" checked={selected.includes(u.id as number)}
                      onChange={() => setSelected(s => s.includes(u.id as number) ? s.filter(i => i !== u.id) : [...s, u.id as number])}
                      className="rounded" aria-label={`Seleccionar ${u.unit_code}`} />
                  </td>
                  <td className="p-3 font-medium">{u.unit_code as string}</td>
                  <td className="p-3 text-[var(--color-text-light)]">{(u.unit_type as string) || '—'}</td>
                  <td className="p-3">
                    {u.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.image_url as string} alt="" className="w-10 h-7 object-cover rounded" />
                    ) : <span className="text-gray-300 text-xs">—</span>}
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
                    <button onClick={() => setEditing(u)} className="text-xs text-[var(--color-primary)] hover:underline font-medium">Editar</button>
                    <button onClick={() => deleteUnit(u.id as number, u.unit_code as string)} className="text-xs text-red-500 hover:underline font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
              {units.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-[var(--color-text-light)]">No hay unidades.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TypeImagesPanel projectId={projectId} unitTypes={unitTypes} showMessage={showMessage} />
    </div>
  );
}
