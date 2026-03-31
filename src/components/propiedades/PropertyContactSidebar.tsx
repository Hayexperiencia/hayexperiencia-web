"use client";

import { useState } from "react";
import Script from "next/script";
import MobileBottomBar from "./MobileBottomBar";

interface PropertyContactSidebarProps {
  price: string;
  priceLabel: string;
  waLink: string;
  propertyId: number;
  propertyTitle: string;
}

export default function PropertyContactSidebar({
  price,
  priceLabel,
  waLink,
  propertyId,
  propertyTitle,
}: PropertyContactSidebarProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="sticky top-24 space-y-4">
        <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-white">
          <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">Te interesa esta propiedad?</h3>
          <p className="text-xs text-[var(--color-text-light)] mb-4">Ref. Wasi: {propertyId}</p>

          {/* CTA Solicitar visita */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Solicitar visita
          </button>

          {/* WhatsApp */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Escribir por WhatsApp
          </a>

          {/* PDF placeholders */}
          <div className="mt-4 flex gap-2">
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-light)] opacity-50 cursor-not-allowed"
              title="Proximamente"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              PDF
            </button>
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-light)] opacity-50 cursor-not-allowed"
              title="Proximamente"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              PDF colega
            </button>
          </div>

          <p className="mt-4 text-xs text-center text-[var(--color-text-light)]">
            Respuesta en menos de 24 horas
          </p>
        </div>

        {/* Inline GHL Form */}
        {showForm && (
          <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-[var(--color-primary)]">Solicitar visita</h4>
              <button onClick={() => setShowForm(false)} className="text-[var(--color-text-light)] hover:text-[var(--color-primary)]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-light)] mb-3">
              Propiedad: {propertyTitle} (Ref: {propertyId})
            </p>
            <div className="rounded-xl overflow-hidden">
              <iframe
                src="https://links.capiolab.com/widget/form/giw7Q3Kz4jQWprjZztSb"
                style={{ width: "100%", height: "515px", border: "none" }}
                id={`inline-form-${propertyId}`}
                data-layout='{"id":"INLINE"}'
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Real Estate Consulting Lead"
                data-height="515"
                data-layout-iframe-id={`inline-form-${propertyId}`}
                data-form-id="giw7Q3Kz4jQWprjZztSb"
                title="Solicitar visita"
              />
            </div>
            <Script src="https://links.capiolab.com/js/form_embed.js" strategy="lazyOnload" />
          </div>
        )}
      </div>

      {/* Mobile bottom bar */}
      <MobileBottomBar
        price={price}
        priceLabel={priceLabel}
        waLink={waLink}
        onRequestVisit={() => setShowForm(true)}
      />
    </>
  );
}
