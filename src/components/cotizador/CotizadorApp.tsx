'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { formatCOP } from '@/lib/format';
import { trackCotizadorStart } from '@/components/analytics/events';
import { sendTrack, formatArea, type Project, type Unit } from './types';
import PlanPanel from './PlanPanel';
import LeadGate from './LeadGate';
import CompareBar from './CompareBar';
import type { PlanOverrides } from '@/lib/quotation-engine';

type SortKey = 'precio-asc' | 'precio-desc' | 'area-asc' | 'area-desc';

interface UnitWithDesc extends Unit {
  description?: string | null;
}

export default function CotizadorApp({ initialSlug }: { initialSlug?: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [units, setUnits] = useState<UnitWithDesc[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<UnitWithDesc | null>(null);
  const [loading, setLoading] = useState({ projects: true, units: false });

  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [sortKey, setSortKey] = useState<SortKey>('precio-asc');
  const [compareIds, setCompareIds] = useState<number[]>([]);

  const [gateOpen, setGateOpen] = useState(false);
  const [gateOverrides, setGateOverrides] = useState<PlanOverrides | undefined>(undefined);

  const isEmbedded = !!initialSlug;
  const channel: 'web' | 'embed' = isEmbedded ? 'embed' : 'web';
  const isParcelacion = selectedProject?.project_type === 'parcelacion';
  const startTracked = useRef(false);
  const planRef = useRef<HTMLDivElement>(null);

  // Load projects
  useEffect(() => {
    sendTrack('started', { channel, project_slug: initialSlug });
    fetch('/api/quotation/projects')
      .then(r => r.json())
      .then((data: Project[]) => {
        setProjects(data);
        if (initialSlug) {
          const match = data.find(p => p.slug === initialSlug);
          if (match) setSelectedProject(match);
        }
        setLoading(l => ({ ...l, projects: false }));
      })
      .catch(() => setLoading(l => ({ ...l, projects: false })));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSlug]);

  // Load units when project changes
  useEffect(() => {
    if (!selectedProject) { setUnits([]); return; }
    setLoading(l => ({ ...l, units: true }));
    setSelectedUnit(null);
    setTypeFilter('todos');
    setCompareIds([]);
    fetch(`/api/quotation/units?project_slug=${selectedProject.slug}`)
      .then(r => r.json())
      .then((data: UnitWithDesc[]) => { setUnits(Array.isArray(data) ? data : []); setLoading(l => ({ ...l, units: false })); })
      .catch(() => setLoading(l => ({ ...l, units: false })));
  }, [selectedProject]);

  function selectProject(p: Project) {
    setSelectedProject(p);
    if (!startTracked.current) {
      trackCotizadorStart(p.slug);
      startTracked.current = true;
    }
    sendTrack('project_selected', { project_slug: p.slug, channel });
  }

  function selectUnit(u: UnitWithDesc) {
    setSelectedUnit(u);
    sendTrack('unit_selected', { project_slug: selectedProject?.slug, unit_id: u.id, channel });
    // En mobile el panel queda fuera de pantalla: scroll suave
    setTimeout(() => planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  function toggleCompare(id: number) {
    setCompareIds(ids =>
      ids.includes(id) ? ids.filter(i => i !== id) : ids.length >= 3 ? ids : [...ids, id]
    );
  }

  function openGate(overrides: PlanOverrides | undefined) {
    setGateOverrides(overrides);
    setGateOpen(true);
    sendTrack('lead_gate_shown', { project_slug: selectedProject?.slug, unit_id: selectedUnit?.id, channel });
  }

  // Tipos disponibles + filtrado + orden
  const unitTypes = useMemo(() => {
    const set = new Set<string>();
    units.forEach(u => set.add(u.unit_type || 'General'));
    return Array.from(set);
  }, [units]);

  const visibleUnits = useMemo(() => {
    let list = units;
    if (typeFilter !== 'todos') list = list.filter(u => (u.unit_type || 'General') === typeFilter);
    const area = (u: Unit) => Number(u.area_total_m2 || u.area_private_m2 || 0);
    const sorted = [...list];
    switch (sortKey) {
      case 'precio-asc': sorted.sort((a, b) => Number(a.list_price) - Number(b.list_price)); break;
      case 'precio-desc': sorted.sort((a, b) => Number(b.list_price) - Number(a.list_price)); break;
      case 'area-asc': sorted.sort((a, b) => area(a) - area(b)); break;
      case 'area-desc': sorted.sort((a, b) => area(b) - area(a)); break;
    }
    return sorted;
  }, [units, typeFilter, sortKey]);

  const compareUnits = useMemo(
    () => units.filter(u => compareIds.includes(u.id)),
    [units, compareIds]
  );

  const stepNum = (n: number) => isEmbedded ? n - 1 : n;
  const totalSteps = isEmbedded ? 2 : 3;
  const currentStep = selectedUnit ? totalSteps : selectedProject ? stepNum(2) : 1;

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ---- Header + progreso ---- */}
        {!isEmbedded && (
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">Cotizador</h1>
            <p className="mt-2 text-[var(--color-text-light)]">
              Arma tu plan de pagos en menos de un minuto. Sin registrarte: tus datos solo
              se piden si quieres recibir la cotización.
            </p>
          </div>
        )}
        <div className="mb-8 flex items-center gap-2" aria-label={`Paso ${currentStep} de ${totalSteps}`}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < currentStep ? 'bg-[var(--color-accent)]' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* ---- Paso 1: Proyecto ---- */}
        {!isEmbedded && (
          loading.projects ? (
            <div className="text-center py-12 text-[var(--color-text-light)]">Cargando proyectos...</div>
          ) : (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-[var(--color-text-light)] uppercase tracking-wide mb-4">1. Elige tu proyecto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {projects.map(p => {
                  const avail = parseInt(p.units_available);
                  const isSel = selectedProject?.id === p.id;
                  return (
                    <button key={p.id} onClick={() => selectProject(p)} disabled={avail === 0}
                      className={`relative text-left p-4 rounded-2xl border-2 transition-all ${isSel ? 'border-[var(--color-accent)] bg-[var(--color-primary)] text-white shadow-lg' : avail === 0 ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' : 'border-[var(--color-border)] bg-white hover:border-[var(--color-accent)] hover:shadow-md'}`}>
                      {p.cover_image_url && (
                        <div className="mb-3 rounded-xl overflow-hidden aspect-[16/9]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.cover_image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <h3 className="font-bold text-base leading-tight">{p.name}</h3>
                      <p className={`text-xs mt-1 ${isSel ? 'text-gray-300' : 'text-[var(--color-text-light)]'}`}>{p.location}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-semibold text-[var(--color-accent)]">{avail > 0 ? `${avail} disponibles` : 'Agotado'}</span>
                        {Number(p.cash_discount_pct) > 0 && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isSel ? 'bg-[var(--color-accent)] text-[var(--color-primary)]' : 'bg-green-100 text-green-700'}`}>
                            -{Number(p.cash_discount_pct)}% contado
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )
        )}

        {/* ---- Info del proyecto ---- */}
        {selectedProject && (
          <div className="mb-8 bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {selectedProject.cover_image_url && (
                <div className="sm:w-1/3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedProject.cover_image_url} alt={selectedProject.name} loading="lazy" className="w-full h-48 sm:h-full object-cover" />
                </div>
              )}
              <div className="flex-1 p-6">
                <div className="flex items-start gap-4 mb-3">
                  {selectedProject.logo_url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={selectedProject.logo_url} alt={`Logo ${selectedProject.name}`} className="h-10 object-contain" />
                  )}
                  <div>
                    <h3 className="font-bold text-xl text-[var(--color-primary)]">{selectedProject.name}</h3>
                    <p className="text-sm text-[var(--color-text-light)]">{selectedProject.location} {selectedProject.delivery_date_text ? `| ${selectedProject.delivery_date_text}` : ''}</p>
                  </div>
                </div>
                {selectedProject.description && <p className="text-sm text-[var(--color-text)] leading-relaxed">{selectedProject.description}</p>}
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-[var(--color-text-light)]">
                  <span>Separación: <strong className="text-[var(--color-primary)]">{formatCOP(selectedProject.separation_value)}</strong></span>
                  <span>Cuota inicial desde: <strong className="text-[var(--color-primary)]">{Number(selectedProject.ci_percentage)}%</strong></span>
                  {Number(selectedProject.cash_discount_pct) > 0 && (
                    <span>Contado: <strong className="text-green-700">-{Number(selectedProject.cash_discount_pct)}%</strong></span>
                  )}
                  <span><strong className="text-green-700">{selectedProject.units_available}</strong> disponibles</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---- Paso 2: Unidad ---- */}
        {selectedProject && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-sm font-semibold text-[var(--color-text-light)] uppercase tracking-wide">
                {stepNum(2)}. Elige tu {isParcelacion ? 'lote' : 'unidad'}
              </h2>
              {units.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  {unitTypes.length > 1 && (
                    <div className="flex gap-1 flex-wrap">
                      <button onClick={() => setTypeFilter('todos')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${typeFilter === 'todos' ? 'bg-[var(--color-primary)] text-white' : 'bg-white border border-[var(--color-border)] text-[var(--color-text-light)] hover:border-[var(--color-accent)]'}`}>
                        Todos ({units.length})
                      </button>
                      {unitTypes.map(t => (
                        <button key={t} onClick={() => setTypeFilter(t)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${typeFilter === t ? 'bg-[var(--color-primary)] text-white' : 'bg-white border border-[var(--color-border)] text-[var(--color-text-light)] hover:border-[var(--color-accent)]'}`}>
                          {t} ({units.filter(u => (u.unit_type || 'General') === t).length})
                        </button>
                      ))}
                    </div>
                  )}
                  <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}
                    aria-label="Ordenar unidades"
                    className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                    <option value="precio-asc">Precio: menor a mayor</option>
                    <option value="precio-desc">Precio: mayor a menor</option>
                    <option value="area-asc">Área: menor a mayor</option>
                    <option value="area-desc">Área: mayor a menor</option>
                  </select>
                </div>
              )}
            </div>

            {loading.units ? (
              <div className="text-center py-8 text-[var(--color-text-light)]">Cargando unidades...</div>
            ) : visibleUnits.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-text-light)]">No hay unidades disponibles.</div>
            ) : (
              <div className={`grid gap-3 ${isParcelacion ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-4'}`}>
                {visibleUnits.map(u => {
                  const isSel = selectedUnit?.id === u.id;
                  const inCompare = compareIds.includes(u.id);
                  return (
                    <div key={u.id} className={`relative rounded-xl border-2 transition-all ${isSel ? 'border-[var(--color-accent)] bg-[var(--color-primary)] text-white' : 'border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]'}`}>
                      <button onClick={() => selectUnit(u)} className="w-full p-3 text-left">
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
                        <div className="font-bold text-sm pr-4">{u.unit_code}</div>
                        <div className={`text-xs mt-0.5 ${isSel ? 'text-gray-300' : 'text-[var(--color-text-light)]'}`}>
                          {formatArea(u.area_total_m2 || u.area_private_m2)}
                          {!isParcelacion && u.bedrooms ? ` · ${u.bedrooms}H/${u.bathrooms ?? '—'}B` : ''}
                          {u.tower ? ` · ${u.tower}` : ''}
                        </div>
                        {u.unit_type && (
                          <div className={`text-[10px] mt-0.5 ${isSel ? 'text-gray-400' : 'text-[var(--color-text-light)]'}`}>Tipo {u.unit_type}</div>
                        )}
                        <div className="text-xs font-semibold mt-1 text-[var(--color-accent)]">
                          {formatCOP(u.list_price)}
                        </div>
                      </button>
                      <label className={`flex items-center gap-1.5 px-3 pb-2 text-[10px] cursor-pointer select-none ${isSel ? 'text-gray-300' : 'text-[var(--color-text-light)]'}`}>
                        <input type="checkbox" checked={inCompare} onChange={() => toggleCompare(u.id)}
                          disabled={!inCompare && compareIds.length >= 3} className="rounded w-3 h-3 accent-[var(--color-accent)]" />
                        Comparar
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ---- Paso 3: Plan interactivo ---- */}
        {selectedUnit && selectedProject && (
          <div ref={planRef} className="mb-8 scroll-mt-24">
            <h2 className="text-sm font-semibold text-[var(--color-text-light)] uppercase tracking-wide mb-4">
              {stepNum(3)}. Tu plan de pagos
            </h2>
            <PlanPanel
              project={selectedProject}
              unit={selectedUnit}
              unitDescription={selectedUnit.description ?? null}
              resolvedImageUrl={selectedUnit.resolved_image_url}
              onRequestQuote={(overrides) => openGate(overrides)}
            />
            <div className="text-center text-xs text-[var(--color-text-light)] mt-4 max-w-2xl mx-auto">
              Esta cotización es referencial y no constituye una oferta comercial vinculante.
              Precios, condiciones y disponibilidad sujetos a cambio sin previo aviso.
            </div>
          </div>
        )}

        {/* ---- Lead gate ---- */}
        {gateOpen && selectedUnit && selectedProject && (
          <LeadGate
            project={selectedProject}
            unit={selectedUnit}
            overrides={gateOverrides}
            channel={channel}
            onClose={() => setGateOpen(false)}
          />
        )}

        {/* ---- Comparador ---- */}
        {selectedProject && (
          <CompareBar
            project={selectedProject}
            units={compareUnits}
            onRemove={id => toggleCompare(id)}
            onClear={() => setCompareIds([])}
            onPick={u => selectUnit(u)}
          />
        )}
      </div>
    </section>
  );
}
