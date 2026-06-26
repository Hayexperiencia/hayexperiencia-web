// Backend del lead-magnet de propiedad (Opción C híbrido, ver
// investigaciones/2026-06-25-cotizador-lead-magnet-propiedades.md):
// la UI custom captura y liga a la propiedad; Capiolab/GHL es el cerebro (CRM, asesor,
// seguimiento). Aquí solo: upsert a GHL (reusa el endpoint del cotizador) + aviso Telegram.
// Wasi NO se toca.

const GHL_SERVICE_URL = process.env.GHL_SERVICE_URL || "http://host.docker.internal:3002";
const GHL_SERVICE_API_KEY = process.env.GHL_SERVICE_API_KEY || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_VENTAS_CHAT_ID = process.env.TELEGRAM_VENTAS_CHAT_ID || "";

// Escapa para parse_mode HTML de Telegram (regla telegram_grupo_ventas_bot_main).
export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Upsert del lead a la location HE de GHL. Reusa /cotizador/upsert-contact (dedup nativo
// phone→email, custom fields, tags multi-cuenta). quotation_code marca el origen como
// intención de propiedad (no una cotización real); codigo_inmueble = wasiId.
export async function upsertPropertyLead(args: {
  name: string;
  phone: string;
  email: string | null;
  wasiId: string;
  presupuesto: number | null;
  extraTags: string[];
}): Promise<string | null> {
  if (!GHL_SERVICE_API_KEY) {
    console.warn("GHL_SERVICE_API_KEY no configurado; lead no enviado a GHL");
    return null;
  }
  const body = {
    name: args.name,
    phone: args.phone,
    email: args.email,
    project_slug: "propiedad",
    quotation_code: `INTENT-${args.wasiId}`,
    pdf_url: null,
    channel: "web-propiedad",
    presupuesto: args.presupuesto,
    codigo_inmueble: args.wasiId,
    extra_tags: args.extraTags,
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
      console.error(`ghl lead upsert ${res.status}: ${await res.text()}`);
      return null;
    }
    const data = await res.json();
    return data.contact_id || null;
  } catch (e) {
    console.error("ghl lead upsert error:", e);
    return null;
  }
}

// Aviso al grupo Ventas HEI. Fire-and-forget: nunca rompe el flujo del lead.
export async function notifyVentasTelegram(htmlText: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_VENTAS_CHAT_ID) {
    console.warn("Telegram no configurado; aviso omitido");
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_VENTAS_CHAT_ID,
        text: htmlText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    console.error("telegram notify error:", e);
  }
}
