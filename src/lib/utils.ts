import { PROPERTY_TYPES } from "./types";

export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseInt(price, 10) : price;
  if (!num || isNaN(num)) return "$0";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatArea(area: string | number): string {
  const num = typeof area === "string" ? parseFloat(area) : area;
  if (!num || isNaN(num)) return "0 m\u00B2";
  return `${num.toLocaleString("es-CO")} m\u00B2`;
}

export function getPropertyType(id: number): string {
  return PROPERTY_TYPES[id] || "Propiedad";
}

export function getPricePerM2(price: string | number, area: string | number): string {
  const p = typeof price === "string" ? parseInt(price, 10) : price;
  const a = typeof area === "string" ? parseFloat(area) : area;
  if (!p || !a || isNaN(p) || isNaN(a) || a === 0) return "";
  return formatPrice(Math.round(p / a)) + "/m\u00B2";
}

export function getWhatsAppLink(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "573022343659";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getPropertyWhatsAppMessage(title: string, id: number): string {
  return `Hola, me interesa la propiedad ${id} - ${title} en hayexperiencia.com`;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "...";
}
