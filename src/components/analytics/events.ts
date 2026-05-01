"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackPropertyView(wasiId: string | number, extra?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", "view_property", { wasi_id: String(wasiId), ...extra });
  } catch {}
  try {
    window.fbq?.("trackCustom", "ViewProperty", { wasi_id: String(wasiId), content_type: "property", ...extra });
  } catch {}
}

export function trackWhatsAppClick(wasiId?: string | number) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", "whatsapp_click", { wasi_id: wasiId ? String(wasiId) : undefined });
  } catch {}
  try {
    window.fbq?.("trackCustom", "WhatsAppClick", { wasi_id: wasiId ? String(wasiId) : undefined });
  } catch {}
}

export function trackCotizadorStart(proyecto?: string) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", "cotizador_start", { proyecto });
  } catch {}
  try {
    window.fbq?.("track", "InitiateCheckout", { content_category: "cotizador", proyecto });
  } catch {}
}

export function trackCotizadorSubmit(proyecto?: string) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", "cotizador_submit", { proyecto });
  } catch {}
  try {
    window.fbq?.("track", "Lead", { content_category: "cotizador", proyecto });
  } catch {}
}

export function trackContactFormSubmit() {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", "contact_form_submit", {});
  } catch {}
  try {
    window.fbq?.("track", "Contact", {});
  } catch {}
}
