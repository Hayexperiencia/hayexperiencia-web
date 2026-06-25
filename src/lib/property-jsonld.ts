import type { WasiProperty } from "./types";
import type { StrapiPropertyEnriched } from "./strapi";
import { marketPublishable } from "./market";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hayexperiencia.com";

export type Faq = { q: string; a: string };

// schema.org Accommodation subtype por tipo HEI. Lotes/locales/oficinas no son
// Accommodation residencial -> se omite el subtipo (queda RealEstateListing + Offer).
const SCHEMA_ACCOMMODATION: Record<string, string> = {
  Apartamento: "Apartment",
  Apartaestudio: "Apartment",
  Casa: "House",
  "Casa Campestre": "House",
  "Casa campestre": "House",
  Finca: "House",
};

const ORGANIZATION = {
  "@type": "RealEstateAgent",
  "@id": `${SITE}/#organization`,
  name: "Hay Experiencia",
  url: SITE,
  areaServed: ["Marinilla", "Rionegro", "La Ceja", "El Peñol", "El Carmen de Viboral", "Guarne", "San Vicente Ferrer"]
    .map((name) => ({ "@type": "City", name })),
  knowsAbout: ["bienes raíces", "fincas raíces", "inmuebles en el Oriente Antioqueño", "estimación referencial de mercado"],
};

// FAQ de la propiedad. La #1 (precio vs mercado) respeta la política: solo afirma la
// posición si es publicable. Misma fuente que el bloque visible y que el FAQPage schema.
export function buildPropertyFaqs(
  property: WasiProperty,
  enriched: StrapiPropertyEnriched | null,
  typeLabel: string,
): Faq[] {
  const ciudad = property.city_label || "el Oriente Antioqueño";
  const tipo = typeLabel.toLowerCase();
  const faqs: Faq[] = [];

  if (marketPublishable(enriched)) {
    const p = enriched!.competitivePosition!;
    const b = enriched!.marketBenchmark!;
    const pct = Math.abs(p.diffVsMedianPct ?? 0);
    const rel = p.status === "BAJO" ? `${pct.toFixed(0)}% por debajo de` : `apenas ${pct.toFixed(0)}% sobre`;
    faqs.push({
      q: `¿El precio de este ${tipo} está acorde al mercado de ${ciudad}?`,
      a: `Sí. Comparado contra ${b.comparablesCount} propiedades similares activas del Oriente Antioqueño (datos a ${b.asOf ?? "2026"}), el precio está dentro del rango de mercado de ${ciudad}, ${rel} la mediana. Es una estimación referencial de mercado, no un avalúo certificado (Ley 1673/2013).`,
    });
  } else {
    faqs.push({
      q: `¿Cómo sé que el precio de este ${tipo} es justo?`,
      a: `En Hay Experiencia comparamos cada propiedad contra el mercado real del Oriente Antioqueño con inteligencia de mercado propia. Pídenos por WhatsApp el análisis de esta propiedad y te mostramos cómo se posiciona frente a inmuebles similares.`,
    });
  }

  faqs.push({
    q: `¿Esta propiedad aplica para crédito hipotecario o subsidio de vivienda?`,
    a: `Sí. Te acompañamos en la financiación con aliados como Cazatasa y los principales bancos, incluyendo subsidios de vivienda cuando aplican. Escríbenos para evaluar tu caso sin costo.`,
  });
  faqs.push({
    q: `¿Cómo agendo una visita a esta propiedad?`,
    a: `Escríbenos por WhatsApp o agenda una asesoría en línea. Respondemos en menos de 24 horas y coordinamos visita presencial o videollamada según tu disponibilidad.`,
  });
  faqs.push({
    q: `¿Qué incluye el acompañamiento de Hay Experiencia?`,
    a: `Asesoría legal, verificación de documentos, estimación referencial de mercado, negociación, acompañamiento en crédito y todo el proceso de escrituración. Una operación segura de principio a fin en el Oriente Antioqueño.`,
  });
  faqs.push({
    q: `¿Cómo es la zona de ${ciudad}?`,
    a: `${ciudad} hace parte del Oriente Antioqueño, una de las regiones de mayor valorización de Antioquia por su cercanía al Aeropuerto José María Córdova, su conexión con Medellín por la autopista y su calidad de vida. Cuéntanos qué buscas y te orientamos sobre la zona.`,
  });
  return faqs;
}

function buildDescription(property: WasiProperty, enriched: StrapiPropertyEnriched | null, typeLabel: string): string {
  const isSale = property.for_sale === "true";
  const parts: string[] = [];
  parts.push(
    `${typeLabel} en ${isSale ? "venta" : "arriendo"} en ${property.zone_label ? property.zone_label + ", " : ""}${property.city_label}, Oriente Antioqueño.`,
  );
  if (isSale && property.sale_price_label) parts.push(`${property.sale_price_label}.`);
  const specs: string[] = [];
  if (parseFloat(property.area || "0") > 0) specs.push(`${property.area} m²`);
  if (parseInt(property.bedrooms || "0", 10) > 0) specs.push(`${property.bedrooms} habitaciones`);
  if (parseInt(property.bathrooms || "0", 10) > 0) specs.push(`${property.bathrooms} baños`);
  if (specs.length) parts.push(`${specs.join(", ")}.`);
  if (marketPublishable(enriched)) {
    const b = enriched!.marketBenchmark!;
    parts.push(`Precio dentro del rango de mercado, validado con ${b.comparablesCount} comparables del Oriente Antioqueño (datos a ${b.asOf ?? "2026"}).`);
  }
  return parts.join(" ");
}

export function buildPropertyJsonLd(opts: {
  property: WasiProperty;
  enriched: StrapiPropertyEnriched | null;
  faqs: Faq[];
  images: string[];
  typeLabel: string;
  url: string;
}): Record<string, unknown> {
  const { property, enriched, faqs, images, typeLabel, url } = opts;
  const isSale = property.for_sale === "true";
  const price = parseInt((property.sale_price || "").replace(/\D/g, ""), 10) || undefined;
  const area = parseFloat(property.area || "0") || undefined;
  const beds = parseInt(property.bedrooms || "0", 10) || undefined;
  const baths = parseInt(property.bathrooms || "0", 10) || undefined;
  const lat = property.latitude ? parseFloat(property.latitude) : 0;
  const lng = property.longitude ? parseFloat(property.longitude) : 0;
  const accType = SCHEMA_ACCOMMODATION[typeLabel];
  const name = property.title || `${typeLabel} en ${property.city_label}`;

  const offer: Record<string, unknown> = {
    "@type": "Offer",
    priceCurrency: "COP",
    availability: "https://schema.org/InStock",
    businessFunction: isSale
      ? "http://purl.org/goodrelations/v1#Sell"
      : "http://purl.org/goodrelations/v1#LeaseOut",
    seller: { "@id": `${SITE}/#organization` },
    url,
  };
  if (price) offer.price = price;

  const accommodation: Record<string, unknown> | undefined = accType
    ? {
        "@type": accType,
        name,
        address: {
          "@type": "PostalAddress",
          addressLocality: property.city_label || undefined,
          addressRegion: "Antioquia",
          addressCountry: "CO",
          ...(property.zone_label ? { streetAddress: property.zone_label } : {}),
        },
        ...(lat && lng ? { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng } } : {}),
        ...(area ? { floorSize: { "@type": "QuantitativeValue", value: area, unitCode: "MTK" } } : {}),
        ...(beds ? { numberOfRooms: beds } : {}),
        ...(baths ? { numberOfBathroomsTotal: baths } : {}),
      }
    : undefined;

  const listing: Record<string, unknown> = {
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    url,
    name,
    description: buildDescription(property, enriched, typeLabel),
    image: images.slice(0, 6),
    offers: offer,
    provider: { "@id": `${SITE}/#organization` },
  };
  if (enriched?.marketBenchmark?.asOf) listing.datePosted = enriched.marketBenchmark.asOf;
  if (accommodation) listing.mainEntity = accommodation;

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
      { "@type": "ListItem", position: 2, name: "Propiedades", item: `${SITE}/propiedades` },
      { "@type": "ListItem", position: 3, name: property.city_label || "Oriente Antioqueño" },
      { "@type": "ListItem", position: 4, name, item: url },
    ],
  };

  const graph: Record<string, unknown>[] = [ORGANIZATION, listing, breadcrumb];
  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
