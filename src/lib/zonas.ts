// Datos de mercado por zona del Oriente Antioqueno para las paginas de zona (SEO/GEO).
// Snapshot fechado del seguimiento de market_intel (scraper_listings_external). Sustituible
// por una consulta en vivo en el siguiente ciclo; por ahora snapshot con `asOf` explicito
// (honesto y citable). Actualizar al re-correr el market_intel.

export type ZonaSegmento = {
  tipo: string;
  etiqueta: string;
  activos: number;
  medianaPrecioMM: number;
  medianaPxM2MM: number | null;
};

export type Zona = {
  slug: string;
  nombre: string;
  asOf: string; // "junio de 2026"
  totalActivos: number;
  intro: string;
  segmentos: ZonaSegmento[];
  faqs: { q: string; a: string }[];
};

export const ZONAS: Record<string, Zona> = {
  marinilla: {
    slug: "marinilla",
    nombre: "Marinilla",
    asOf: "junio de 2026",
    totalActivos: 1758,
    intro:
      "Marinilla es uno de los municipios de mayor demanda del Oriente Antioqueno. A junio de 2026, un apartamento en Marinilla se vende en una mediana de 320 millones de pesos (4,72 millones por metro cuadrado), una casa en 720 millones y un lote en 360 millones, segun el seguimiento de Hay Experiencia a 1.758 propiedades activas del mercado. Su cercania al Aeropuerto Jose Maria Cordova y la conexion con Medellin por la autopista Medellin-Bogota la posicionan como una de las zonas de mejor valorizacion del Oriente.",
    segmentos: [
      { tipo: "apartamento", etiqueta: "Apartamentos", activos: 954, medianaPrecioMM: 320, medianaPxM2MM: 4.72 },
      { tipo: "casa", etiqueta: "Casas", activos: 239, medianaPrecioMM: 720, medianaPxM2MM: 2.5 },
      { tipo: "lote", etiqueta: "Lotes", activos: 433, medianaPrecioMM: 360, medianaPxM2MM: 0.12 },
      { tipo: "finca", etiqueta: "Fincas", activos: 132, medianaPrecioMM: 850, medianaPxM2MM: 0.27 },
    ],
    faqs: [
      {
        q: "¿Cuanto cuesta un apartamento en Marinilla?",
        a: "A junio de 2026, la mediana de un apartamento en venta en Marinilla es de 320 millones de pesos, equivalente a 4,72 millones por metro cuadrado, segun el seguimiento de Hay Experiencia a 954 apartamentos activos del mercado. Es una estimacion referencial de mercado, no un avaluo certificado.",
      },
      {
        q: "¿Cuanto vale un lote en Marinilla?",
        a: "La mediana de un lote en venta en Marinilla es de 360 millones de pesos (datos a junio de 2026, sobre 433 lotes activos). El precio por metro cuadrado de lote varia mucho segun ubicacion, servicios y uso del suelo.",
      },
      {
        q: "¿Cuanto cuesta una casa en Marinilla?",
        a: "La mediana de una casa en venta en Marinilla es de 720 millones de pesos a junio de 2026, sobre 239 casas activas en el mercado. El rango es amplio porque incluye desde casas urbanas hasta casas campestres.",
      },
      {
        q: "¿Es buena inversion comprar en Marinilla?",
        a: "Marinilla es una de las zonas de mayor valorizacion del Oriente Antioqueno por su cercania al Aeropuerto Jose Maria Cordova, la conexion con Medellin por la autopista y su crecimiento urbano. Hay Experiencia te ayuda a comparar cada propiedad contra el mercado real para que compres a un precio justo.",
      },
      {
        q: "¿Por que comprar o vender con Hay Experiencia en Marinilla?",
        a: "Somos una inmobiliaria del Oriente Antioqueno con inteligencia de mercado propia: comparamos cada propiedad contra cientos de listings reales de la zona, te acompanamos en credito y escrituracion, y presentamos tu propiedad con datos, no con adjetivos.",
      },
    ],
  },
};

export function getZona(slug: string): Zona | null {
  return ZONAS[slug] ?? null;
}

export function listZonaSlugs(): string[] {
  return Object.keys(ZONAS);
}
