import crypto from "node:crypto";
import type { Attribution } from "@/lib/attribution";

const GHL_SERVICE_URL = process.env.GHL_SERVICE_URL || "http://host.docker.internal:3002";
const GHL_SERVICE_API_KEY = process.env.GHL_SERVICE_API_KEY || "";
// Dominio de marca de la landing (para el event_source_url de CAPI).
const LANDING_URL = process.env.ALUNA_LANDING_URL || "https://alunacampestre.com";

// CAPI (Conversions API). Se activa cuando META_CAPI_ACCESS_TOKEN esté en el env
// de Coolify; si no, se omite sin romper (el pixel de navegador sigue midiendo).
const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || "";
const CAPI_PIXEL_ID =
  process.env.ALUNA_META_PIXEL_ID || process.env.NEXT_PUBLIC_ALUNA_META_PIXEL_ID || "894787075010721";
const CAPI_TEST_CODE = process.env.META_CAPI_TEST_EVENT_CODE || "";

export const INTERES_LABEL: Record<string, string> = {
  vivir: "Vivir / construir",
  inversion: "Inversión",
  descanso: "Casa de descanso",
};

// Fragmento seguro para tag de GHL: minúsculas, sin acentos ni símbolos raros.
function tagFrag(v: string): string {
  return v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function buildLeadTags(interes: string, a: Attribution): string[] {
  const tags = ["aluna", "pauta-web", "lead-aluna-web"];
  if (interes && INTERES_LABEL[interes]) tags.push(`interes-${tagFrag(interes)}`);
  if (a.utm_source) tags.push(`fuente-${tagFrag(a.utm_source)}`);
  if (a.utm_medium) tags.push(`medio-${tagFrag(a.utm_medium)}`);
  if (a.utm_campaign) tags.push(`campana-${tagFrag(a.utm_campaign)}`);
  if (a.utm_content) tags.push(`anuncio-${tagFrag(a.utm_content)}`);
  return tags;
}

// Upsert del lead a la location HE via ghl-service (dedup phone→email, CF por
// proyecto, multi-cuenta). Reusa el mismo endpoint del cotizador.
export async function upsertAlunaLead(args: {
  name: string;
  phone: string;
  email: string | null;
  interes: string;
  attribution: Attribution;
}): Promise<string | null> {
  if (!GHL_SERVICE_API_KEY) {
    console.warn("GHL_SERVICE_API_KEY no configurado; lead ALUNA no enviado a GHL");
    return null;
  }
  const body = {
    name: args.name,
    phone: args.phone,
    email: args.email,
    project_slug: "aluna",
    quotation_code: `LEAD-ALUNA-${Date.now()}`,
    pdf_url: null,
    channel: "web-aluna",
    codigo_inmueble: null,
    extra_tags: buildLeadTags(args.interes, args.attribution),
  };
  try {
    const res = await fetch(`${GHL_SERVICE_URL}/cotizador/upsert-contact`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_SERVICE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      console.error(`ghl aluna lead upsert ${res.status}: ${await res.text()}`);
      return null;
    }
    const data = await res.json();
    return data.contact_id || null;
  } catch (e) {
    console.error("ghl aluna lead upsert error:", e);
    return null;
  }
}

const sha256 = (v: string) => crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

function normPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return "57" + d;
  return d;
}

// Conversions API — evento Lead server-side, deduplicado con el pixel por event_id.
// Fire-and-forget: nunca rompe el flujo. Solo corre si hay token.
export async function sendAlunaCapiLead(args: {
  eventId: string;
  name: string;
  phone: string;
  email: string | null;
  interes: string;
  attribution: Attribution;
  clientIp: string | null;
  userAgent: string | null;
}): Promise<void> {
  if (!CAPI_TOKEN) return;
  const a = args.attribution;
  const firstName = args.name.trim().split(/\s+/)[0] || "";
  const userData: Record<string, unknown> = {
    ph: [sha256(normPhone(args.phone))],
    fn: [sha256(firstName)],
  };
  if (args.email) userData.em = [sha256(args.email)];
  if (a.fbc) userData.fbc = a.fbc;
  if (a.fbp) userData.fbp = a.fbp;
  if (args.clientIp) userData.client_ip_address = args.clientIp;
  if (args.userAgent) userData.client_user_agent = args.userAgent;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: args.eventId,
        action_source: "website",
        event_source_url: `${LANDING_URL}${a.landing || "/"}`,
        user_data: userData,
        custom_data: { content_name: "ALUNA", content_category: "aluna", currency: "COP", value: 0 },
      },
    ],
  };
  if (CAPI_TEST_CODE) payload.test_event_code = CAPI_TEST_CODE;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${CAPI_PIXEL_ID}/events?access_token=${encodeURIComponent(CAPI_TOKEN)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) console.error(`CAPI Lead ${res.status}: ${await res.text()}`);
  } catch (e) {
    console.error("CAPI Lead error:", e);
  }
}
