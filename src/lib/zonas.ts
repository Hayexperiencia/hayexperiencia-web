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

  rionegro: {
    slug: "rionegro",
    nombre: "Rionegro",
    asOf: "junio de 2026",
    totalActivos: 1346,
    intro:
      "Rionegro es el corazon urbano y economico del Oriente Antioqueno y sede del Aeropuerto Internacional Jose Maria Cordova. A junio de 2026, un apartamento en Rionegro se vende en una mediana de 450 millones de pesos (6,32 millones por metro cuadrado, el mas alto del Oriente), una casa en 1.100 millones y un lote en 1.300 millones, segun el seguimiento de Hay Experiencia a 1.346 propiedades activas del mercado. Su conectividad, comercio y servicios la convierten en la zona de mayor dinamismo inmobiliario de la region.",
    segmentos: [
      { tipo: "apartamento", etiqueta: "Apartamentos", activos: 567, medianaPrecioMM: 450, medianaPxM2MM: 6.32 },
      { tipo: "casa", etiqueta: "Casas", activos: 345, medianaPrecioMM: 1100, medianaPxM2MM: 4.13 },
      { tipo: "lote", etiqueta: "Lotes", activos: 382, medianaPrecioMM: 1300, medianaPxM2MM: 0.36 },
      { tipo: "finca", etiqueta: "Fincas", activos: 52, medianaPrecioMM: 1825, medianaPxM2MM: 0.34 },
    ],
    faqs: [
      { q: "¿Cuanto cuesta un apartamento en Rionegro?", a: "A junio de 2026, la mediana de un apartamento en venta en Rionegro es de 450 millones de pesos (6,32 millones por metro cuadrado, el mas alto del Oriente Antioqueno), sobre 567 apartamentos activos. Es una estimacion referencial de mercado, no un avaluo certificado." },
      { q: "¿Cuanto vale una casa en Rionegro?", a: "La mediana de una casa en venta en Rionegro es de 1.100 millones de pesos a junio de 2026, sobre 345 casas activas en el mercado." },
      { q: "¿Por que Rionegro es la zona mas dinamica del Oriente?", a: "Rionegro concentra el Aeropuerto Jose Maria Cordova, centros comerciales, salud, universidades y la mayor oferta de vivienda nueva del Oriente Antioqueno, lo que sostiene su demanda y valorizacion." },
      { q: "¿Es buena inversion comprar en Rionegro?", a: "Rionegro tiene la mayor liquidez inmobiliaria del Oriente por su tamano de mercado y conectividad. Hay Experiencia te ayuda a comparar cada propiedad contra cientos de listings reales para comprar a precio justo." },
      { q: "¿Por que vender con Hay Experiencia en Rionegro?", a: "Presentamos tu propiedad con datos de mercado reales, la comparamos contra el mercado activo de Rionegro y te acompanamos en credito y escrituracion. Asi vendemos: con cifras, no con adjetivos." },
    ],
  },

  "la-ceja": {
    slug: "la-ceja",
    nombre: "La Ceja",
    asOf: "junio de 2026",
    totalActivos: 1624,
    intro:
      "La Ceja es uno de los municipios de mayor calidad de vida del Oriente Antioqueno, reconocido por su clima, su entorno campestre y su cercania a Rionegro y al aeropuerto. A junio de 2026, una casa en La Ceja se vende en una mediana de 700 millones de pesos (5,18 millones por metro cuadrado), un apartamento en 365 millones y un lote en 647 millones, segun el seguimiento de Hay Experiencia a 1.624 propiedades activas del mercado. Es una de las zonas preferidas para vivienda campestre y permanente del Oriente.",
    segmentos: [
      { tipo: "casa", etiqueta: "Casas", activos: 629, medianaPrecioMM: 700, medianaPxM2MM: 5.18 },
      { tipo: "apartamento", etiqueta: "Apartamentos", activos: 437, medianaPrecioMM: 365, medianaPxM2MM: 5.61 },
      { tipo: "lote", etiqueta: "Lotes", activos: 527, medianaPrecioMM: 647, medianaPxM2MM: 0.37 },
      { tipo: "finca", etiqueta: "Fincas", activos: 31, medianaPrecioMM: 1780, medianaPxM2MM: 1.08 },
    ],
    faqs: [
      { q: "¿Cuanto cuesta una casa en La Ceja?", a: "A junio de 2026, la mediana de una casa en venta en La Ceja es de 700 millones de pesos (5,18 millones por metro cuadrado), sobre 629 casas activas. Es una estimacion referencial de mercado, no un avaluo certificado." },
      { q: "¿Cuanto cuesta un apartamento en La Ceja?", a: "La mediana de un apartamento en venta en La Ceja es de 365 millones de pesos a junio de 2026, sobre 437 apartamentos activos en el mercado." },
      { q: "¿Por que comprar en La Ceja?", a: "La Ceja ofrece clima agradable, entorno campestre y excelente calidad de vida a pocos minutos de Rionegro y el aeropuerto, lo que la hace ideal para vivienda permanente y de descanso." },
      { q: "¿Es buena inversion comprar en La Ceja?", a: "La Ceja mantiene demanda sostenida por su calidad de vida y cercania a los servicios de Rionegro. Hay Experiencia compara cada propiedad contra el mercado real para que compres a precio justo." },
      { q: "¿Por que vender con Hay Experiencia en La Ceja?", a: "Comparamos tu propiedad contra el mercado activo de La Ceja, la presentamos con datos reales y te acompanamos en todo el proceso de venta y escrituracion." },
    ],
  },

  "el-penol": {
    slug: "el-penol",
    nombre: "El Peñol",
    asOf: "junio de 2026",
    totalActivos: 588,
    intro:
      "El Peñol es uno de los destinos turisticos y de segunda vivienda mas valorados del Oriente Antioqueno, junto al embalse y a pocos minutos de Guatape. A junio de 2026, un lote en El Peñol se vende en una mediana de 660 millones de pesos, una casa campestre en 975 millones y una finca en 1.500 millones, segun el seguimiento de Hay Experiencia a 588 propiedades activas del mercado. Su vocacion nautica y paisajistica la hace ideal para proyectos de descanso e inversion.",
    segmentos: [
      { tipo: "lote", etiqueta: "Lotes", activos: 429, medianaPrecioMM: 660, medianaPxM2MM: 0.15 },
      { tipo: "casa", etiqueta: "Casas", activos: 100, medianaPrecioMM: 975, medianaPxM2MM: 0.47 },
      { tipo: "apartamento", etiqueta: "Apartamentos", activos: 40, medianaPrecioMM: 635, medianaPxM2MM: 3.19 },
      { tipo: "finca", etiqueta: "Fincas", activos: 19, medianaPrecioMM: 1500, medianaPxM2MM: 0.32 },
    ],
    faqs: [
      { q: "¿Cuanto vale un lote en El Peñol?", a: "A junio de 2026, la mediana de un lote en venta en El Peñol es de 660 millones de pesos, sobre 429 lotes activos. El precio varia mucho segun cercania al embalse, vista y servicios. Es una estimacion referencial de mercado, no un avaluo certificado." },
      { q: "¿Cuanto cuesta una casa campestre en El Peñol?", a: "La mediana de una casa en venta en El Peñol es de 975 millones de pesos a junio de 2026, sobre 100 casas activas en el mercado." },
      { q: "¿Por que invertir en El Peñol?", a: "El Peñol es uno de los polos turisticos y de segunda vivienda de mayor valorizacion del Oriente, junto al embalse y a Guatape, con fuerte vocacion nautica y de descanso." },
      { q: "¿Hay proyectos nauticos en El Peñol?", a: "Si. El Oriente Antioqueno, y El Peñol en particular, concentran proyectos de vivienda y descanso junto al embalse. Escribenos para conocer la oferta disponible y como se posiciona frente al mercado." },
      { q: "¿Por que comprar o vender con Hay Experiencia en El Peñol?", a: "Conocemos el mercado nautico y de segunda vivienda del Oriente, comparamos cada propiedad contra listings reales de la zona y te acompanamos en todo el proceso con datos, no con adjetivos." },
    ],
  },

  guarne: {
    slug: "guarne",
    nombre: "Guarne",
    asOf: "junio de 2026",
    totalActivos: 1024,
    intro:
      "Guarne es la puerta de entrada al Oriente Antioqueno desde Medellin, sobre la autopista Medellin-Bogota. A junio de 2026, un lote en Guarne se vende en una mediana de 550 millones de pesos, una casa en 1.300 millones, una finca en 1.040 millones y un apartamento en 305 millones, segun el seguimiento de Hay Experiencia a 1.024 propiedades activas del mercado. Su cercania a Medellin y al aeropuerto la hace ideal para vivienda, fincas de descanso e inversion.",
    segmentos: [
      { tipo: "lote", etiqueta: "Lotes", activos: 663, medianaPrecioMM: 550, medianaPxM2MM: 0.2 },
      { tipo: "casa", etiqueta: "Casas", activos: 176, medianaPrecioMM: 1300, medianaPxM2MM: 0.88 },
      { tipo: "finca", etiqueta: "Fincas", activos: 118, medianaPrecioMM: 1040, medianaPxM2MM: 0.28 },
      { tipo: "apartamento", etiqueta: "Apartamentos", activos: 67, medianaPrecioMM: 305, medianaPxM2MM: 4.58 },
    ],
    faqs: [
      { q: "¿Cuanto vale un lote en Guarne?", a: "A junio de 2026, la mediana de un lote en venta en Guarne es de 550 millones de pesos, sobre 663 lotes activos. Es una estimacion referencial de mercado, no un avaluo certificado." },
      { q: "¿Cuanto cuesta una casa o finca en Guarne?", a: "La mediana de una casa en Guarne es de 1.300 millones y la de una finca de 1.040 millones a junio de 2026, sobre cientos de propiedades activas." },
      { q: "¿Por que invertir en Guarne?", a: "Guarne es el municipio del Oriente mas cercano a Medellin por la autopista, con fuerte demanda de lotes y fincas de descanso e inversion." },
      { q: "¿Por que comprar o vender con Hay Experiencia en Guarne?", a: "Comparamos cada propiedad contra el mercado real de Guarne y el Oriente, y te acompanamos con datos en todo el proceso de compra, venta y escrituracion." },
    ],
  },

  "el-carmen-de-viboral": {
    slug: "el-carmen-de-viboral",
    nombre: "El Carmen de Viboral",
    asOf: "junio de 2026",
    totalActivos: 1325,
    intro:
      "El Carmen de Viboral, reconocido por su tradicion ceramica, es uno de los municipios de mayor crecimiento del Oriente Antioqueno. A junio de 2026, un apartamento en El Carmen de Viboral se vende en una mediana de 255 millones de pesos, una casa en 930 millones y un lote en 410 millones, segun el seguimiento de Hay Experiencia a 1.325 propiedades activas del mercado. Ofrece precios mas accesibles que Rionegro y La Ceja con excelente conectividad.",
    segmentos: [
      { tipo: "lote", etiqueta: "Lotes", activos: 593, medianaPrecioMM: 410, medianaPxM2MM: 0.19 },
      { tipo: "casa", etiqueta: "Casas", activos: 453, medianaPrecioMM: 930, medianaPxM2MM: 1.22 },
      { tipo: "apartamento", etiqueta: "Apartamentos", activos: 261, medianaPrecioMM: 255, medianaPxM2MM: 3.36 },
      { tipo: "finca", etiqueta: "Fincas", activos: 18, medianaPrecioMM: 1470, medianaPxM2MM: 0.16 },
    ],
    faqs: [
      { q: "¿Cuanto cuesta un apartamento en El Carmen de Viboral?", a: "A junio de 2026, la mediana de un apartamento en venta en El Carmen de Viboral es de 255 millones de pesos, sobre 261 apartamentos activos. Es una estimacion referencial de mercado, no un avaluo certificado." },
      { q: "¿Cuanto vale una casa o un lote en El Carmen de Viboral?", a: "La mediana de una casa es de 930 millones y la de un lote de 410 millones a junio de 2026, sobre cientos de propiedades activas." },
      { q: "¿Por que comprar en El Carmen de Viboral?", a: "El Carmen de Viboral ofrece precios mas accesibles que el resto del Oriente con buena conectividad y crecimiento urbano, ideal para primera vivienda e inversion." },
      { q: "¿Por que con Hay Experiencia en El Carmen de Viboral?", a: "Comparamos cada propiedad contra el mercado real de la zona y te acompanamos con datos en todo el proceso." },
    ],
  },

  "el-santuario": {
    slug: "el-santuario",
    nombre: "El Santuario",
    asOf: "junio de 2026",
    totalActivos: 128,
    intro:
      "El Santuario es un municipio agricola y residencial del Oriente Antioqueno con precios accesibles. A junio de 2026, un apartamento en El Santuario se vende en una mediana de 250 millones de pesos, una casa en 550 millones y un lote en 530 millones, segun el seguimiento de Hay Experiencia a 128 propiedades activas de la zona. Es una alternativa economica dentro del Oriente, con buena conexion a Marinilla y Rionegro.",
    segmentos: [
      { tipo: "lote", etiqueta: "Lotes", activos: 63, medianaPrecioMM: 530, medianaPxM2MM: 0.1 },
      { tipo: "casa", etiqueta: "Casas", activos: 34, medianaPrecioMM: 550, medianaPxM2MM: 0.36 },
      { tipo: "apartamento", etiqueta: "Apartamentos", activos: 31, medianaPrecioMM: 250, medianaPxM2MM: 3.56 },
    ],
    faqs: [
      { q: "¿Cuanto cuesta un apartamento en El Santuario?", a: "A junio de 2026, la mediana de un apartamento en venta en El Santuario es de 250 millones de pesos, sobre 31 apartamentos activos. Es una estimacion referencial de mercado, no un avaluo certificado." },
      { q: "¿Cuanto vale una casa o un lote en El Santuario?", a: "La mediana de una casa es de 550 millones y la de un lote de 530 millones a junio de 2026." },
      { q: "¿Por que comprar en El Santuario?", a: "El Santuario ofrece de los precios mas accesibles del Oriente Antioqueno con buena conexion a Marinilla y Rionegro, ideal para primera vivienda." },
      { q: "¿Por que con Hay Experiencia en El Santuario?", a: "Comparamos cada propiedad contra el mercado real de la zona y te acompanamos con datos en todo el proceso." },
    ],
  },

  "el-retiro": {
    slug: "el-retiro",
    nombre: "El Retiro",
    asOf: "junio de 2026",
    totalActivos: 106,
    intro:
      "El Retiro es uno de los municipios de mayor valorizacion y exclusividad del Oriente Antioqueno, con fuerte demanda de fincas y casas campestres. A junio de 2026, una casa en El Retiro se vende en una mediana de 2.225 millones de pesos, un apartamento en 600 millones (7,45 millones por metro cuadrado, el mas alto del Oriente) y un lote en 950 millones, segun el seguimiento de Hay Experiencia a la oferta activa de la zona. Es de las zonas mas premium de la region.",
    segmentos: [
      { tipo: "lote", etiqueta: "Lotes", activos: 55, medianaPrecioMM: 950, medianaPxM2MM: 0.22 },
      { tipo: "casa", etiqueta: "Casas", activos: 32, medianaPrecioMM: 2225, medianaPxM2MM: 0.94 },
      { tipo: "apartamento", etiqueta: "Apartamentos", activos: 19, medianaPrecioMM: 600, medianaPxM2MM: 7.45 },
    ],
    faqs: [
      { q: "¿Cuanto cuesta una casa en El Retiro?", a: "A junio de 2026, la mediana de una casa en venta en El Retiro es de 2.225 millones de pesos, una de las mas altas del Oriente Antioqueno. Es una estimacion referencial de mercado, no un avaluo certificado." },
      { q: "¿Cuanto vale un lote en El Retiro?", a: "La mediana de un lote en El Retiro es de 950 millones de pesos a junio de 2026, reflejo de su caracter exclusivo." },
      { q: "¿Por que El Retiro es una zona premium?", a: "El Retiro combina clima, paisaje y exclusividad, con alta demanda de fincas y casas campestres de alto valor en el Oriente Antioqueno." },
      { q: "¿Por que con Hay Experiencia en El Retiro?", a: "Conocemos el segmento campestre y premium del Oriente, comparamos contra el mercado real y te acompanamos con datos en todo el proceso." },
    ],
  },

  "san-vicente-ferrer": {
    slug: "san-vicente-ferrer",
    nombre: "San Vicente Ferrer",
    asOf: "junio de 2026",
    totalActivos: 631,
    intro:
      "San Vicente Ferrer es un municipio de vocacion rural y campestre del Oriente Antioqueno, con amplia oferta de lotes y fincas a precios accesibles. A junio de 2026, un lote en San Vicente se vende en una mediana de 250 millones de pesos, una casa en 670 millones y una finca en 1.032 millones, segun el seguimiento de Hay Experiencia a 631 propiedades activas del mercado. Es una de las zonas de mejor relacion precio-tierra del Oriente.",
    segmentos: [
      { tipo: "lote", etiqueta: "Lotes", activos: 524, medianaPrecioMM: 250, medianaPxM2MM: 0.07 },
      { tipo: "casa", etiqueta: "Casas", activos: 90, medianaPrecioMM: 670, medianaPxM2MM: 0.2 },
      { tipo: "finca", etiqueta: "Fincas", activos: 17, medianaPrecioMM: 1032, medianaPxM2MM: 0.14 },
    ],
    faqs: [
      { q: "¿Cuanto vale un lote en San Vicente Ferrer?", a: "A junio de 2026, la mediana de un lote en venta en San Vicente Ferrer es de 250 millones de pesos, sobre 524 lotes activos, de las mas accesibles del Oriente. Es una estimacion referencial de mercado, no un avaluo certificado." },
      { q: "¿Cuanto cuesta una casa o finca en San Vicente?", a: "La mediana de una casa es de 670 millones y la de una finca de 1.032 millones a junio de 2026." },
      { q: "¿Por que invertir en San Vicente Ferrer?", a: "San Vicente ofrece de la mejor relacion precio-tierra del Oriente Antioqueno, ideal para lotes, fincas e inversion campestre." },
      { q: "¿Por que con Hay Experiencia en San Vicente?", a: "Comparamos cada propiedad contra el mercado real de la zona y te acompanamos con datos en todo el proceso de compra y venta." },
    ],
  },
};

export function getZona(slug: string): Zona | null {
  return ZONAS[slug] ?? null;
}

export function listZonaSlugs(): string[] {
  return Object.keys(ZONAS);
}

const CITY_TO_SLUG: Record<string, string> = {
  marinilla: "marinilla",
  rionegro: "rionegro",
  "la ceja": "la-ceja",
  "el peñol": "el-penol",
  "el penol": "el-penol",
  guarne: "guarne",
  "el carmen de viboral": "el-carmen-de-viboral",
  "el santuario": "el-santuario",
  "el retiro": "el-retiro",
  "san vicente ferrer": "san-vicente-ferrer",
  "san vicente": "san-vicente-ferrer",
};

// Inteligencia de mercado a nivel de ZONA: para propiedades sin benchmark individual
// confiable (lotes, fincas, casas — mercados dispersos) la posicion de mercado correcta
// es la de su zona, no una mediana de comparables que no existe.
export function getZonaByCity(city: string | null | undefined): Zona | null {
  if (!city) return null;
  const slug = CITY_TO_SLUG[city.trim().toLowerCase()];
  return slug ? ZONAS[slug] ?? null : null;
}

const TIPO_LABEL_TO_SEG: Record<string, string> = {
  apartamento: "apartamento",
  apartaestudio: "apartamento",
  casa: "casa",
  "casa campestre": "casa",
  "casa campestre ": "casa",
  finca: "finca",
  lote: "lote",
  "lote campestre": "lote",
};

export function segmentoDeTipo(typeLabel: string): string | null {
  return TIPO_LABEL_TO_SEG[typeLabel.trim().toLowerCase()] ?? null;
}
