'use client';

import { useState } from 'react';
import { trackCotizadorSubmit } from '@/components/analytics/events';
import { sendTrack, type Project, type Unit } from './types';
import type { PlanOverrides } from '@/lib/quotation-engine';

interface SaveResponse {
  quotation_code?: string;
  pdf_url?: string | null;
  pdf_status?: string;
  share_url?: string;
  valid_until?: string;
  error?: string;
}

function validEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

function validPhoneCO(v: string): boolean {
  const d = v.replace(/\D/g, '');
  return d.length === 10 || (d.length === 12 && d.startsWith('57'));
}

export default function LeadGate({ project, unit, overrides, channel, onClose }: {
  project: Project;
  unit: Unit;
  overrides: PlanOverrides | undefined;
  channel: 'web' | 'embed';
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SaveResponse | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 3) errs.name = 'Escribe tu nombre completo';
    if (!validPhoneCO(phone)) errs.phone = 'Celular colombiano de 10 dígitos (ej: 3001234567)';
    if (email && !validEmail(email)) errs.email = 'Email inválido';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/quotation/quick-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_id: unit.id,
          client_data: { name: name.trim(), phone, email: email || undefined },
          overrides,
          channel,
        }),
      });
      const data: SaveResponse = await res.json();
      if (!res.ok || !data.quotation_code) {
        setErrors({ form: data.error || 'No pudimos guardar la cotización. Intenta de nuevo.' });
      } else {
        setResult(data);
        trackCotizadorSubmit(project.slug);
        sendTrack('quote_saved', { project_slug: project.slug, unit_id: unit.id, quotation_code: data.quotation_code, channel });
      }
    } catch {
      setErrors({ form: 'Error de conexión. Intenta de nuevo.' });
    }
    setSubmitting(false);
  }

  async function copyShare() {
    if (!result?.share_url) return;
    try {
      await navigator.clipboard.writeText(result.share_url);
      setCopied(true);
      sendTrack('share_copied', { project_slug: project.slug, quotation_code: result.quotation_code });
      setTimeout(() => setCopied(false), 2500);
    } catch { /* clipboard no disponible */ }
  }

  const wa = project.contact_whatsapp?.replace(/\D/g, '') || '573022343659';
  const waText = encodeURIComponent(
    result?.quotation_code
      ? `Hola, acabo de generar la cotización ${result.quotation_code} de ${unit.unit_code} en ${project.name}. Quiero más información.`
      : `Hola, me interesa ${unit.unit_code} del proyecto ${project.name}.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {!result ? (
          <>
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-xl font-bold text-[var(--color-primary)]">Recibe tu cotización</h3>
              <button onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <p className="text-sm text-[var(--color-text-light)] mb-5">
              {unit.unit_code} · {project.name}. Te enviamos el PDF y un asesor te acompaña sin compromiso.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-[var(--color-primary)] mb-1" htmlFor="lg-name">Nombre completo *</label>
                <input id="lg-name" type="text" value={name} onChange={e => setName(e.target.value)} autoComplete="name"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${errors.name ? 'border-red-400' : 'border-[var(--color-border)]'}`} />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-primary)] mb-1" htmlFor="lg-phone">Celular / WhatsApp *</label>
                <input id="lg-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="3001234567"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${errors.phone ? 'border-red-400' : 'border-[var(--color-border)]'}`} />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-primary)] mb-1" htmlFor="lg-email">Email <span className="font-normal text-[var(--color-text-light)]">(opcional)</span></label>
                <input id="lg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${errors.email ? 'border-red-400' : 'border-[var(--color-border)]'}`} />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              {errors.form && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{errors.form}</p>}

              <button type="submit" disabled={submitting}
                className="w-full px-6 py-3.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-bold hover:bg-[var(--color-accent-light)] transition-colors disabled:opacity-60">
                {submitting ? 'Generando tu cotización…' : 'Generar mi cotización'}
              </button>
              <p className="text-[11px] text-[var(--color-text-light)] text-center">
                Al continuar aceptas nuestra <a href="/privacidad" target="_blank" className="underline">política de datos</a> (Ley 1581/2012).
              </p>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-5">
              <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl mb-3">✓</div>
              <h3 className="text-xl font-bold text-[var(--color-primary)]">¡Cotización lista!</h3>
              <p className="text-sm text-[var(--color-text-light)] mt-1">
                Código <strong className="font-mono text-[var(--color-primary)]">{result.quotation_code}</strong>
                {result.valid_until ? ` · válida hasta ${new Date(result.valid_until + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}` : ''}
              </p>
            </div>

            <div className="space-y-3">
              {result.pdf_url && result.pdf_status !== 'missing' && (
                <a href={result.pdf_url} target="_blank" rel="noopener noreferrer"
                  onClick={() => sendTrack('pdf_downloaded', { project_slug: project.slug, quotation_code: result.quotation_code })}
                  className="block w-full text-center px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 transition-colors">
                  Descargar PDF
                </a>
              )}
              <a href={`https://wa.me/${wa}?text=${waText}`} target="_blank" rel="noopener noreferrer"
                onClick={() => sendTrack('whatsapp_clicked', { project_slug: project.slug, unit_id: unit.id, quotation_code: result.quotation_code })}
                className="block w-full text-center px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors">
                Hablar con {project.advisor_name?.split(' ')[0] || 'un asesor'} por WhatsApp
              </a>
              {result.share_url && (
                <button onClick={copyShare}
                  className="block w-full text-center px-6 py-3 rounded-xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-gray-50 transition-colors">
                  {copied ? '¡Link copiado!' : 'Copiar link para compartir'}
                </button>
              )}
              <button onClick={onClose} className="block w-full text-center text-sm text-[var(--color-text-light)] hover:underline pt-1">
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
