"use client";

import { useState, useEffect } from "react";
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showForm]);

  return (
    <>
      {/* Hide global WhatsApp button on this page in mobile (bottom bar replaces it) */}
      <style>{`@media (max-width: 1023px) { .whatsapp-global { display: none !important; } }`}</style>

      <div className="sticky top-24 space-y-4">
        <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-white">
          <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">Te interesa esta propiedad?</h3>
          <p className="text-xs text-[var(--color-text-light)] mb-4">Ref. Wasi: {propertyId}</p>

          {/* CTA Solicitar visita */}
          <button
            onClick={() => setShowForm(true)}
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

          {/* PDF downloads */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = `/api/pdf?id=${propertyId}&modo=con-marca`;
                a.download = `HE-${propertyId}-ficha.pdf`;
                a.click();
              }}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-primary)] hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              PDF
            </button>
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = `/api/pdf?id=${propertyId}&modo=sin-marca`;
                a.download = `propiedad-${propertyId}-ficha.pdf`;
                a.click();
              }}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-primary)] hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              PDF colega
            </button>
          </div>

          <p className="mt-4 text-xs text-center text-[var(--color-text-light)]">
            Respuesta en menos de 24 horas
          </p>
        </div>
      </div>

      {/* Modal GHL Form */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <div>
                <h4 className="text-lg font-semibold text-[var(--color-primary)]">Solicitar visita</h4>
                <p className="text-xs text-[var(--color-text-light)]">
                  {propertyTitle} (Ref: {propertyId})
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4">
              <iframe
                src="https://links.capiolab.com/widget/form/giw7Q3Kz4jQWprjZztSb"
                style={{ width: "100%", height: "515px", border: "none" }}
                id={`modal-form-${propertyId}`}
                data-layout='{"id":"INLINE"}'
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Real Estate Consulting Lead"
                data-height="515"
                data-layout-iframe-id={`modal-form-${propertyId}`}
                data-form-id="giw7Q3Kz4jQWprjZztSb"
                title="Solicitar visita"
              />
            </div>
            <Script src="https://links.capiolab.com/js/form_embed.js" strategy="lazyOnload" />
          </div>
        </div>
      )}

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
