'use client';

import { ReactNode } from 'react';

interface Props {
  numero: string | number;
  titulo: string;
  pregunta: string;
  loading?: boolean;
  error?: string | null;
  children?: ReactNode;
  accion?: string;
  responsable?: string;
}

export default function SectionCard({ numero, titulo, pregunta, loading, error, children, accion, responsable }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      <header className="px-5 py-4 border-b border-[var(--color-border)] bg-gray-50">
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-mono text-[var(--color-text-light)] bg-white border border-[var(--color-border)] rounded-full px-2 py-0.5">
            {String(numero).padStart(2, '0')}
          </span>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">{titulo}</h2>
        </div>
        <p className="text-sm text-[var(--color-text-light)] mt-1 italic">{pregunta}</p>
      </header>
      <div className="px-5 py-4 min-h-[80px]">
        {loading && (
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
          </div>
        )}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-200">
            Error cargando datos: {error}
          </div>
        )}
        {!loading && !error && children}
      </div>
      {(accion || responsable) && (
        <footer className="px-5 py-3 border-t border-[var(--color-border)] bg-amber-50/40">
          <p className="text-sm">
            {accion && <span className="text-[var(--color-text)]"><strong>Acción:</strong> {accion}</span>}
            {accion && responsable && <span className="mx-2 text-[var(--color-text-light)]">·</span>}
            {responsable && <span className="text-[var(--color-text-light)]"><strong>Responsable:</strong> {responsable}</span>}
          </p>
        </footer>
      )}
    </section>
  );
}
