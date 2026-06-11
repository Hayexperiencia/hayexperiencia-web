'use client';

import { useState, useEffect, useCallback } from 'react';
import ProjectsTab from './cotizador/ProjectsTab';
import InventoryTab from './cotizador/InventoryTab';
import QuotationsTab from './cotizador/QuotationsTab';
import FunnelTab from './cotizador/FunnelTab';
import type { Row } from './cotizador/shared';

type Tab = 'projects' | 'inventory' | 'quotations' | 'funnel';

const TAB_LABELS: Record<Tab, string> = {
  projects: 'Proyectos',
  inventory: 'Inventario',
  quotations: 'Cotizaciones',
  funnel: 'Funnel',
};

export default function AdminCotizador() {
  const [tab, setTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<Row[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const showMessage = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const loadProjects = useCallback(() => {
    fetch('/api/admin/projects').then(r => r.json()).then(d => setProjects(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Admin Cotizador</h1>
          <p className="text-sm text-[var(--color-text-light)]">Proyectos, inventario, cotizaciones y funnel</p>
        </div>
        {message && <span className="px-4 py-2 rounded-lg bg-green-100 text-green-800 text-sm font-medium animate-pulse">{message}</span>}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-[var(--color-border)] p-1">
        {(Object.keys(TAB_LABELS) as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-light)] hover:bg-gray-50'}`}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Selector de proyecto (solo inventario) */}
      {tab === 'inventory' && (
        <div className="mb-6">
          <select value={selectedProjectId || ''} onChange={e => setSelectedProjectId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full sm:w-auto rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label="Seleccionar proyecto">
            <option value="">— Seleccionar proyecto —</option>
            {projects.map(p => (
              <option key={p.id as number} value={p.id as number}>{p.name as string} ({p.units_available as string} disp.)</option>
            ))}
          </select>
        </div>
      )}

      {tab === 'projects' && (
        <ProjectsTab
          projects={projects}
          reload={loadProjects}
          showMessage={showMessage}
          goToInventory={id => { setSelectedProjectId(id); setTab('inventory'); }}
        />
      )}

      {tab === 'inventory' && selectedProjectId && (
        <InventoryTab
          projectId={selectedProjectId}
          projectType={(selectedProject?.project_type as string) || 'parcelacion'}
          reloadProjects={loadProjects}
          showMessage={showMessage}
        />
      )}
      {tab === 'inventory' && !selectedProjectId && (
        <div className="p-8 text-center text-[var(--color-text-light)]">Selecciona un proyecto para ver su inventario.</div>
      )}

      {tab === 'quotations' && <QuotationsTab projects={projects} showMessage={showMessage} />}

      {tab === 'funnel' && <FunnelTab />}
    </div>
  );
}
