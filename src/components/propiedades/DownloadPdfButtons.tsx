'use client';

import { useState } from 'react';

interface DownloadPdfButtonsProps {
  propertyId: string | number;
}

export default function DownloadPdfButtons({ propertyId }: DownloadPdfButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleDownload(modo: 'con-marca' | 'sin-marca') {
    setLoading(modo);
    try {
      const res = await fetch(`/api/pdf?id=${propertyId}&modo=${modo}`);
      if (!res.ok) throw new Error('Error generando PDF');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const prefix = modo === 'sin-marca' ? 'propiedad' : 'HE';
      a.download = `${prefix}-${propertyId}-ficha.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Error al generar la ficha PDF. Intenta de nuevo.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-[var(--color-primary)]">Descargar ficha</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleDownload('con-marca')}
          disabled={loading !== null}
          className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-colors bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 disabled:opacity-50 disabled:cursor-wait"
        >
          {loading === 'con-marca' ? 'Generando...' : 'Ficha con marca'}
        </button>
        <button
          onClick={() => handleDownload('sin-marca')}
          disabled={loading !== null}
          className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-wait"
        >
          {loading === 'sin-marca' ? 'Generando...' : 'Modo colega (sin marca)'}
        </button>
      </div>
    </div>
  );
}
