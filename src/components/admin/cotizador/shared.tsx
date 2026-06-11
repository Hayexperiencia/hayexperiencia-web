'use client';

import { useState } from 'react';

export { formatCOP } from '@/lib/format';

export const STATUS_COLORS: Record<string, string> = {
  disponible: 'bg-green-100 text-green-800',
  reservado: 'bg-yellow-100 text-yellow-800',
  vendido: 'bg-gray-200 text-gray-700',
  bloqueado: 'bg-red-100 text-red-800',
};

export const FOLLOWUP_OPTIONS = ['nueva', 'contactado', 'negociacion', 'cerrada', 'descartada'] as const;

export const FOLLOWUP_COLORS: Record<string, string> = {
  nueva: 'bg-blue-100 text-blue-800',
  contactado: 'bg-yellow-100 text-yellow-800',
  negociacion: 'bg-purple-100 text-purple-800',
  cerrada: 'bg-green-100 text-green-800',
  descartada: 'bg-gray-200 text-gray-600',
};

export type Row = Record<string, unknown>;

export function ImageUpload({ folder, currentUrl, onUploaded }: {
  folder: string;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
}) {
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
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentUrl} alt="" className="w-20 h-14 object-cover rounded-lg mb-2 border" />
      )}
      <label className="cursor-pointer text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[var(--color-primary)] font-medium transition-colors">
        {uploading ? 'Subiendo...' : currentUrl ? 'Cambiar' : 'Subir imagen'}
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}

export function downloadCSV(filename: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  const esc = (v: string | number | null | undefined) => {
    const s = String(v ?? '');
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.map(esc).join(';'), ...rows.map(r => r.map(esc).join(';'))].join('\n');
  // BOM para que Excel en es-CO abra UTF-8 bien
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
