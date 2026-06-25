import { formatArea } from "./utils";
import { segmentoDeTipo } from "./zonas";
import type { WasiProperty } from "./types";

// Título con gancho + SEO para la propiedad, en vez del genérico de Wasi ("Lote en vereda X").
// Forma: "{tipo} {atributo clave} en {zona}, {ciudad}". El atributo se elige según el tipo:
// habitaciones para vivienda, área (o hectáreas) para lote/finca. Sirve para el H1 del hero,
// el title de SEO y los datos estructurados.
export function buildPropertyHeadline(p: WasiProperty, typeLabel: string): string {
  const ciudad = p.zone_label ? `${p.zone_label}, ${p.city_label}` : p.city_label;
  const seg = segmentoDeTipo(typeLabel);
  const area = parseFloat(p.area || "0");
  const beds = parseInt(p.bedrooms || "0", 10);

  let attr = "";
  if (seg === "apartamento" || seg === "casa") {
    if (beds > 0) attr = `de ${beds} habitacion${beds > 1 ? "es" : ""}`;
    else if (area > 0) attr = `de ${formatArea(p.area)}`;
  } else if (seg === "finca") {
    if (area >= 10000) {
      const ha = area / 10000;
      attr = `de ${Number.isInteger(ha) ? ha : ha.toFixed(1).replace(".", ",")} hectárea${ha > 1 ? "s" : ""}`;
    } else if (area > 0) {
      attr = `de ${formatArea(p.area)}`;
    }
  } else if (area > 0) {
    // lote, local, oficina, bodega, etc.
    attr = `de ${formatArea(p.area)}`;
  }

  return attr ? `${typeLabel} ${attr} en ${ciudad}` : `${typeLabel} en ${ciudad}`;
}
