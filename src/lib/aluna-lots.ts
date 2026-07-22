// Client-safe: tipo, helpers y coordenadas del mapa. SIN acceso a BD (lo usa el
// componente cliente LotSelector). La data en vivo la inyecta la página server
// (src/lib/aluna-inventory.ts -> getAlunaLots()).
export type Element = "LUZ" | "BOSQUE" | "AGUA" | "AIRE" | "—";
export type Lot = {
  code: string;
  element: Element;
  area: number;
  price: number;
  status: "disponible" | "vendido";
  image?: string; // sirve desde hayexperiencia.com/media
  mapX?: number;
  mapY?: number;
};

export const cop = (n: number) => (n > 0 ? "$" + n.toLocaleString("es-CO") : "—");

export const elementLabel: Record<Element, string> = {
  LUZ: "Luz", BOSQUE: "Bosque", AGUA: "Agua", AIRE: "Aire", "—": "—",
};

// Posición del centro de cada lote sobre el plano ambientado (public/images/aluna-plano.jpg),
// en % del ancho/alto. Leído del plano oficial (LOTE 40/43/44 = protección ambiental, no vendibles).
export const LOT_COORDS: Record<string, { mapX: number; mapY: number }> = {
  "1":  { mapX: 27.0, mapY: 20.2 },
  "2":  { mapX: 19.0, mapY: 15.0 },
  "3":  { mapX: 14.5, mapY: 22.0 },
  "4":  { mapX: 14.5, mapY: 34.5 },
  "5":  { mapX: 14.5, mapY: 45.0 },
  "6":  { mapX: 14.5, mapY: 55.0 },
  "7":  { mapX: 21.0, mapY: 59.0 },
  "8":  { mapX: 28.0, mapY: 60.0 },
  "9":  { mapX: 38.0, mapY: 57.0 },
  "10": { mapX: 26.0, mapY: 47.0 },
  "11": { mapX: 26.0, mapY: 39.0 },
  "12": { mapX: 25.0, mapY: 30.5 },
  "13": { mapX: 35.5, mapY: 32.0 },
  "14": { mapX: 36.0, mapY: 45.0 },
  "15": { mapX: 44.0, mapY: 37.0 },
  "16": { mapX: 44.0, mapY: 48.0 },
  "17": { mapX: 48.0, mapY: 63.0 },
  "18": { mapX: 54.0, mapY: 60.5 },
  "19": { mapX: 60.5, mapY: 62.0 },
  "20": { mapX: 66.5, mapY: 60.0 },
  "21": { mapX: 69.0, mapY: 47.5 },
  "22": { mapX: 57.5, mapY: 47.0 },
  "23": { mapX: 56.5, mapY: 37.5 },
  "24": { mapX: 53.0, mapY: 29.5 },
  "25": { mapX: 69.5, mapY: 38.5 },
  "26": { mapX: 74.5, mapY: 31.0 },
  "27": { mapX: 79.0, mapY: 39.0 },
  "28": { mapX: 75.5, mapY: 48.0 },
  "29": { mapX: 73.5, mapY: 59.5 },
  "30": { mapX: 80.5, mapY: 77.0 },
  "31": { mapX: 84.0, mapY: 67.5 },
  "32": { mapX: 86.0, mapY: 57.0 },
  "33": { mapX: 89.0, mapY: 45.0 },
  "34": { mapX: 86.5, mapY: 29.5 },
  "35": { mapX: 89.0, mapY: 17.0 },
  "36": { mapX: 81.5, mapY: 18.0 },
  "37": { mapX: 66.5, mapY: 18.0 },
  "38": { mapX: 50.0, mapY: 17.0 },
  "39": { mapX: 40.0, mapY: 20.5 },
};
