"use client";

// Atribución de marketing para la pauta de ALUNA. Captura en el primer load de
// /aluna y persiste en sessionStorage; viaja con el lead al enviarse el form.
// UTM = first-touch (no se pisan). fbclid/fbc/fbp = last-touch (match de Meta).

export const ALUNA_PIXEL_ID =
  process.env.NEXT_PUBLIC_ALUNA_META_PIXEL_ID || "894787075010721";

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  fbc?: string;
  fbp?: string;
  landing?: string;
  referrer?: string;
  first_seen?: string;
};

const KEY = "aluna_attribution";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const esc = name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&");
  const m = document.cookie.match(new RegExp("(?:^|; )" + esc + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {}

  const q = new URLSearchParams(window.location.search);
  const g = (k: string) => q.get(k) || undefined;

  const fbclid = g("fbclid");
  const fbc = readCookie("_fbc") || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

  const merged: Attribution = {
    // first-touch
    utm_source: stored.utm_source ?? g("utm_source"),
    utm_medium: stored.utm_medium ?? g("utm_medium"),
    utm_campaign: stored.utm_campaign ?? g("utm_campaign"),
    utm_content: stored.utm_content ?? g("utm_content"),
    utm_term: stored.utm_term ?? g("utm_term"),
    landing: stored.landing ?? window.location.pathname + window.location.search,
    referrer: stored.referrer ?? (document.referrer || undefined),
    first_seen: stored.first_seen ?? new Date().toISOString(),
    // last-touch (ids de click / cookies del pixel)
    fbclid: fbclid ?? stored.fbclid,
    gclid: g("gclid") ?? stored.gclid,
    fbc: fbc ?? stored.fbc,
    fbp: readCookie("_fbp") ?? stored.fbp,
  };

  try {
    sessionStorage.setItem(KEY, JSON.stringify(merged));
  } catch {}
  return merged;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function newEventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return "ev-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }
}
