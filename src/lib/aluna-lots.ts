// Snapshot de datos reales del cotizador (hei_inventory_units, ALUNA).
// v1: estático. TODO: leer en vivo de /api/quotation/units?proyecto=aluna.
export type Lot = {
  code: string;
  element: "LUZ" | "BOSQUE" | "AGUA" | "AIRE" | "—";
  area: number;
  price: number;
  status: "disponible" | "vendido";
  view?: string;
  image?: string; // sirve desde hayexperiencia.com/media
};

const M = "https://hayexperiencia.com";

export const lots: Lot[] = [
  { code: "Lote 4",  element: "LUZ",    area: 2500.0,  price: 524851921, status: "disponible", image: M + "/media/units/1776802693462-4.jpg" },
  { code: "Lote 14", element: "LUZ",    area: 2504.97, price: 483863958, status: "disponible", image: M + "/media/units/1777396680564-14.jpg" },
  { code: "Lote 16", element: "LUZ",    area: 2547.93, price: 534492598, status: "disponible", image: M + "/media/units/1776801301067-dji_0452.jpg" },
  { code: "Lote 19", element: "BOSQUE", area: 2620.35, price: 443734432, status: "disponible", image: M + "/media/units/1776801467742-19.jpg" },
  { code: "Lote 20", element: "BOSQUE", area: 2627.30, price: 506419046, status: "disponible", image: M + "/media/units/1776801551973-20.jpg" },
  { code: "Lote 21", element: "BOSQUE", area: 2507.99, price: 526459036, status: "disponible", image: M + "/media/units/1776801701089-21.jpg" },
  { code: "Lote 29", element: "BOSQUE", area: 2500.33, price: 524918297, status: "disponible", image: M + "/media/units/1776801849893-29.jpg" },
  { code: "Lote 5",  element: "—",      area: 2500.0,  price: 0,         status: "vendido",    image: M + "/media/units/1776802770546-5.jpg" },
];

export const cop = (n: number) => (n > 0 ? "$" + n.toLocaleString("es-CO") : "—");
export const elementLabel: Record<Lot["element"], string> = {
  LUZ: "Luz", BOSQUE: "Bosque", AGUA: "Agua", AIRE: "Aire", "—": "—",
};
