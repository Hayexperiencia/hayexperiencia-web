import { NextResponse } from "next/server";
import type { Attribution } from "@/lib/attribution";
import { upsertAlunaLead, sendAlunaCapiLead, INTERES_LABEL } from "@/lib/aluna-lead";
import { notifyVentasTelegram, escapeHtml } from "@/lib/property-lead";

function validPhoneCO(v: string): boolean {
  const d = v.replace(/\D/g, "");
  return d.length === 10 || (d.length === 12 && d.startsWith("57"));
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Honeypot anti-bot: si viene lleno, fingimos éxito y descartamos.
  if (String(body.company ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = body.email ? String(body.email).trim().toLowerCase() : null;
  const interes = body.interes ? String(body.interes) : "";
  const eventId = String(body.event_id ?? "").trim() || `srv-${Date.now()}`;
  const attribution = (body.attribution && typeof body.attribution === "object"
    ? body.attribution
    : {}) as Attribution;

  if (name.length < 3 || !validPhoneCO(phone)) {
    return NextResponse.json({ error: "Faltan datos o el celular no es válido" }, { status: 400 });
  }

  const contactId = await upsertAlunaLead({ name, phone, email, interes, attribution });

  // CAPI (no bloquea la respuesta al usuario).
  const clientIp =
    req.headers.get("cf-connecting-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    null;
  const userAgent = req.headers.get("user-agent");
  void sendAlunaCapiLead({ eventId, name, phone, email, interes, attribution, clientIp, userAgent });

  // Aviso a Ventas con la fuente (HTML escapado, sin emojis).
  const digits = phone.replace(/\D/g, "").slice(-10);
  const a = attribution;
  const fuente = [a.utm_source, a.utm_medium].filter(Boolean).join("/") || "directo";
  const lines = [
    "<b>Nuevo lead ALUNA (web)</b>",
    `<b>${escapeHtml(name)}</b> · ${escapeHtml(phone)}${email ? " · " + escapeHtml(email) : ""}`,
    `Interés: ${escapeHtml(INTERES_LABEL[interes] || "—")}`,
    `Fuente: ${escapeHtml(fuente)}${a.utm_campaign ? " · Campaña: " + escapeHtml(a.utm_campaign) : ""}${a.utm_content ? " · Anuncio: " + escapeHtml(a.utm_content) : ""}`,
    `Contactar: https://wa.me/57${digits}`,
    contactId ? `CRM: contacto ${escapeHtml(contactId)}` : "CRM: (no se registró, revisar)",
  ];
  await notifyVentasTelegram(lines.join("\n"));

  return NextResponse.json({ ok: true, contactId });
}
