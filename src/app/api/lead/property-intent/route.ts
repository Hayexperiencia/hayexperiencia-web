import { NextResponse } from "next/server";
import { getProperty } from "@/lib/wasi";
import { getPropertyType } from "@/lib/utils";
import { upsertPropertyLead, notifyVentasTelegram, escapeHtml } from "@/lib/property-lead";

const USO: Record<string, string> = {
  vivir: "Para vivir",
  inversion: "Inversión",
  descanso: "Casa de descanso",
  lote: "Lote para construir",
  negocio: "Negocio / local",
};
const PAGO: Record<string, string> = {
  contado: "De contado",
  credito: "Crédito hipotecario",
  permuta: "Permuta",
  mixto: "Mixto",
  indeciso: "Aún no sabe",
};
const PLAZO: Record<string, string> = {
  ya: "Lo antes posible",
  "1-3m": "1 a 3 meses",
  "3-6m": "3 a 6 meses",
  "6m+": "Más de 6 meses",
  explorando: "Solo explorando",
};

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

  const wasiId = String(body.wasiId ?? "").trim();
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = body.email ? String(body.email).trim() : null;
  const uso = body.uso ? String(body.uso) : "";
  const pago = body.pago ? String(body.pago) : "";
  const plazo = body.plazo ? String(body.plazo) : "";
  const presupuesto = typeof body.presupuesto === "number" ? body.presupuesto : null;

  if (!wasiId || name.length < 3 || !validPhoneCO(phone)) {
    return NextResponse.json({ error: "Faltan datos o el celular no es válido" }, { status: 400 });
  }

  // Re-resolver la propiedad server-side: NO se confía en lo que mande el cliente
  // (mismo guardrail anti-spoofing del cotizador v2). El precio/título salen de la fuente.
  const prop = await getProperty(wasiId);
  if (!prop) {
    return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
  }
  const tipo = getPropertyType(prop.id_property_type);
  const isSale = prop.for_sale === "true";
  const precioLabel = (isSale ? prop.sale_price_label : prop.rent_price_label) || "Precio a consultar";

  const extraTags = ["lead-intencion", `propiedad-${wasiId}`];
  if (uso) extraTags.push(`uso-${uso}`);
  if (pago) extraTags.push(`pago-${pago}`);
  if (plazo) extraTags.push(`plazo-${plazo}`);
  if (pago === "credito") extraTags.push("derivar-credito");

  const contactId = await upsertPropertyLead({
    name,
    phone,
    email,
    wasiId,
    presupuesto,
    extraTags,
  });

  // Aviso al grupo Ventas HEI (fire-and-forget, HTML escapado, sin emojis).
  const digits = phone.replace(/\D/g, "").slice(-10);
  const lines = [
    "<b>Nuevo lead de propiedad</b>",
    `<b>${escapeHtml(name)}</b> · ${escapeHtml(phone)}`,
    `${escapeHtml(tipo)} en ${escapeHtml(prop.city_label || "")} · ${escapeHtml(precioLabel)}`,
    `Ref ${escapeHtml(String(prop.id_property))} · wasi ${escapeHtml(wasiId)}`,
    `Uso: ${escapeHtml(USO[uso] || "—")} · Pago: ${escapeHtml(PAGO[pago] || "—")} · Plazo: ${escapeHtml(PLAZO[plazo] || "—")}`,
    presupuesto ? `Presupuesto aprox: $${Math.round(presupuesto / 1_000_000)}M` : null,
    `Contactar: https://wa.me/57${digits}`,
    contactId ? `CRM: contacto ${escapeHtml(contactId)}` : "CRM: (no se pudo registrar, revisar)",
  ].filter(Boolean);
  await notifyVentasTelegram(lines.join("\n"));

  return NextResponse.json({ ok: true, contactId });
}
