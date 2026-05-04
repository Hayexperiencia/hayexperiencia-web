'use client';

import { useState } from 'react';
import ResumenSection from './ResumenSection';
import PulsoSection from './PulsoSection';
import OfertaSection from './OfertaSection';
import VelocidadSection from './VelocidadSection';
import TipologiasSection from './TipologiasSection';
import BenchmarksSection from './BenchmarksSection';
import AlertasSection from './AlertasSection';
import RepublicacionSection from './RepublicacionSection';
import BrechasSection from './BrechasSection';
import SaludSection from './SaludSection';

export default function MercadoPanel() {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-[var(--color-primary)]">Inteligencia de Mercado · Oriente Antioqueño</h1>
            <p className="text-xs text-[var(--color-text-light)]">
              Reporte para el equipo Hay Experiencia · Datos de scraping + 92 propiedades propias
            </p>
          </div>
          <button
            onClick={triggerRefresh}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90"
          >
            Refrescar datos
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col gap-4 md:gap-5">
        <ResumenSection refreshKey={refreshKey} />
        <PulsoSection refreshKey={refreshKey} />
        <OfertaSection refreshKey={refreshKey} />
        <VelocidadSection refreshKey={refreshKey} />
        <TipologiasSection refreshKey={refreshKey} />
        <BenchmarksSection refreshKey={refreshKey} />
        <AlertasSection refreshKey={refreshKey} />
        <RepublicacionSection refreshKey={refreshKey} />
        <BrechasSection refreshKey={refreshKey} />
        <SaludSection refreshKey={refreshKey} onRefreshed={triggerRefresh} />
      </div>

      <footer className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-[var(--color-text-light)]">
        Hay Experiencia · Inteligencia de Mercado · Sprint 5 · Datos en vivo desde Postgres market_intel
      </footer>
    </div>
  );
}
