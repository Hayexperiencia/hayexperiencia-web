'use client';

import { useState } from 'react';
import EmbudoSection from './EmbudoSection';
import VisitasSection from './VisitasSection';
import CotizacionesSection from './CotizacionesSection';
import CrmSection from './CrmSection';
import InstrumentacionSection from './InstrumentacionSection';
import ConexionesSection from './ConexionesSection';
import Ga4Section from './Ga4Section';

export default function AnalyticsPanel() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-[var(--color-primary)]">Analytics de Operación · Hay Experiencia</h1>
            <p className="text-xs text-[var(--color-text-light)]">
              Embudo del sitio + cotizador + CRM · Las 3 patas: GA4, Meta Pixel y analytics propio
            </p>
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90"
          >
            Refrescar datos
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col gap-4 md:gap-5">
        <EmbudoSection refreshKey={refreshKey} />
        <VisitasSection refreshKey={refreshKey} />
        <CotizacionesSection refreshKey={refreshKey} />
        <CrmSection refreshKey={refreshKey} />
        <InstrumentacionSection />
        <Ga4Section refreshKey={refreshKey} />
        <ConexionesSection />
      </div>

      <footer className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-[var(--color-text-light)]">
        Hay Experiencia · Analytics de Operación · Datos en vivo desde Postgres + GHL service · Ver también /admin/mercado
      </footer>
    </div>
  );
}
