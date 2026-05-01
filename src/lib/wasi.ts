/**
 * wasi.ts — backed by Strapi (Sprint 6, Camino B)
 *
 * Las funciones mantienen su firma original (devuelven shape WasiProperty) para
 * no romper componentes existentes (PropertyCard, PropertyKeyFacts, SimilarProperties,
 * Gallery, etc). Internamente leen Strapi y adaptan al shape Wasi.
 *
 * Nota: el sitio publica solo las 92 propiedades sincronizadas a Strapi cada 6h
 * desde Wasi. Si necesitas inmediatez, dispara `strapi sync wasi --confirm`.
 */
import {
  getPropertyByWasiId,
  getStrapiProperties,
  type StrapiProperty,
  type StrapiPropertyEnriched,
} from "./strapi";
import { WasiProperty, PropertyFilters } from "./types";

// Mapeo type Strapi → id_property_type Wasi (solo necesitamos los que el sitio usa)
const TYPE_TO_ID: Record<string, number> = {
  casa: 1,
  apartamento: 2,
  apartaestudio: 2,
  oficina: 3,
  local: 4,
  local_comercial: 4,
  lote: 5,
  lote_campestre: 5,
  bodega: 6,
  finca: 7,
  casa_campestre: 1,
  parqueadero: 9,
  otro: 0,
};

// Mapeo Strapi type → label legible
const TYPE_TO_LABEL: Record<string, string> = {
  casa: "Casa",
  apartamento: "Apartamento",
  apartaestudio: "Apartaestudio",
  oficina: "Oficina",
  local: "Local",
  local_comercial: "Local comercial",
  lote: "Lote",
  lote_campestre: "Lote campestre",
  bodega: "Bodega",
  finca: "Finca",
  casa_campestre: "Casa campestre",
  parqueadero: "Parqueadero",
  otro: "Propiedad",
};

// Mapeo city string → id_city Wasi (para filtros legacy del sitio)
const CITY_TO_ID: Record<string, number> = {
  marinilla: 488,
  "el peñol": 278,
  "el penol": 278,
  guatape: 358,
  guatapé: 358,
  rionegro: 685,
  "el retiro": 677,
  "la ceja": 410,
  "san vicente": 773,
  "san vicente ferrer": 773,
  guarne: 360,
  "el carmen de viboral": 280,
  "carmen de viboral": 280,
};

const ID_TO_CITY: Record<number, string> = Object.fromEntries(
  Object.entries(CITY_TO_ID).map(([k, v]) => [v, k.replace(/^\w/, (c) => c.toUpperCase())])
);

function safeNum(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function strapiToWasi(p: StrapiProperty): WasiProperty {
  const specs = p.specs ?? {};
  const fin = p.financial ?? {};
  const addr = p.address ?? {};
  const cityKey = (addr.city ?? "").toLowerCase().trim();
  const idCity = CITY_TO_ID[cityKey] ?? 0;
  const typeId = TYPE_TO_ID[p.type] ?? 0;

  const isSale = p.transaction === "venta" || p.transaction === "venta_o_arriendo";
  const isRent = p.transaction === "arriendo" || p.transaction === "venta_o_arriendo";

  const priceVal = typeof fin.price === "string" ? parseInt(fin.price, 10) : (fin.price ?? 0);
  const priceLabel = priceVal > 0 ? `$${(priceVal / 1_000_000).toFixed(0)}M` : "";

  // Galleries: convert galleryUrls (array of strings) to WasiGallery shape that Gallery component understands
  const galleryUrls = p.galleryUrls ?? [];
  const galleries =
    galleryUrls.length > 0
      ? [
          galleryUrls.reduce<Record<string | number, unknown>>(
            (acc, url, idx) => {
              acc[idx] = {
                id: idx + 1,
                url,
                url_big: url,
                url_original: url,
                description: "",
                filename: `${idx}`,
                position: idx + 1,
              };
              return acc;
            },
            { id: 1 }
          ),
        ]
      : [];

  return {
    id_property: parseInt(p.wasiId, 10) || 0,
    id_company: 8989920,
    id_user: 0,
    title: p.title,
    for_sale: isSale ? "true" : "false",
    for_rent: isRent ? "true" : "false",
    id_property_type: typeId,
    id_country: 47,
    country_label: addr.country ?? "Colombia",
    id_region: 0,
    region_label: addr.department ?? "Antioquia",
    id_city: idCity,
    city_label: addr.city ?? "",
    id_location: 0,
    location_label: addr.neighborhood ?? "",
    id_zone: 0,
    zone_label: addr.neighborhood ?? "",
    iso_currency: fin.currency ?? "COP",
    sale_price: isSale ? safeNum(priceVal) : "0",
    sale_price_label: isSale ? priceLabel : "",
    rent_price: isRent ? safeNum(priceVal) : "0",
    rent_price_label: isRent ? priceLabel : "",
    area: safeNum(specs.areaLote ?? specs.areaConstruida ?? 0),
    built_area: safeNum(specs.areaConstruida ?? 0),
    private_area: safeNum(specs.areaConstruida ?? 0),
    bedrooms: safeNum(specs.rooms ?? 0),
    bathrooms: safeNum(specs.bathrooms ?? 0),
    garages: safeNum(specs.parking ?? 0),
    stratum: safeNum(specs.estrato ?? 0),
    floor: safeNum(specs.floors ?? 0),
    observations: p.description ?? "",
    address: addr.street ?? "",
    latitude: safeNum(addr.lat ?? ""),
    longitude: safeNum(addr.lng ?? ""),
    main_image: p.coverUrl
      ? {
          id_gallery: 1,
          id_image: 1,
          url: p.coverUrl,
          url_big: p.coverUrl,
          url_original: p.coverUrl,
          description: p.title ?? "",
          filename: "cover",
          position: 1,
        }
      : null,
    galleries: galleries as WasiProperty["galleries"],
    features: undefined, // Strapi tiene features pero sin parser de items[]; opcional
    video: p.video ?? "",
    featured: 0,
    unit_area_label: "m²",
    unit_built_area_label: "m²",
    half_bathrooms: 0,
    maintenance_fee: safeNum(fin.administracion ?? 0),
    maintenance_fee_label: fin.administracion ? `$${fin.administracion}` : "",
  };
}

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<{ total: number; properties: WasiProperty[] }> {
  const sf: Parameters<typeof getStrapiProperties>[0] = {
    pageSize: filters.take ?? 24,
    page: filters.skip ? Math.floor((filters.skip ?? 0) / (filters.take ?? 24)) + 1 : 1,
  };

  if (filters.id_city) {
    const cityName = ID_TO_CITY[filters.id_city];
    if (cityName) sf.city = cityName;
  }
  if (filters.id_property_type) {
    const t = Object.entries(TYPE_TO_ID).find(([, v]) => v === filters.id_property_type)?.[0];
    if (t) sf.type = t;
  }
  if (filters.for_sale && !filters.for_rent) sf.transaction = "venta";
  if (filters.for_rent && !filters.for_sale) sf.transaction = "arriendo";
  if (filters.min_price) sf.minPrice = filters.min_price;
  if (filters.max_price) sf.maxPrice = filters.max_price;
  if (filters.bedrooms) sf.bedrooms = filters.bedrooms;

  const { items, total } = await getStrapiProperties(sf);
  return { total, properties: items.map(strapiToWasi) };
}

export async function getProperty(id: string): Promise<WasiProperty | null> {
  const p = await getPropertyByWasiId(id);
  if (!p) return null;
  return strapiToWasi(p);
}

export async function getFeaturedProperties(take = 6): Promise<WasiProperty[]> {
  const { properties } = await getProperties({ take, for_sale: true });
  return properties;
}

export async function getSimilarProperties(
  propertyType: number,
  cityId: number,
  excludeId: number,
  take = 4
): Promise<WasiProperty[]> {
  const { properties } = await getProperties({
    id_property_type: propertyType,
    id_city: cityId,
    take: take + 1,
    for_sale: true,
  });
  return properties.filter((p) => p.id_property !== excludeId).slice(0, take);
}

/** Devuelve enrichedData de la propiedad sin pasar por el adapter Wasi. */
export async function getEnrichedDataForWasiId(
  wasiId: string
): Promise<StrapiPropertyEnriched | null> {
  const p = await getPropertyByWasiId(wasiId);
  return p?.enrichedData ?? null;
}

// Re-export for type info
export type { WasiProperty } from "./types";
export { TYPE_TO_LABEL };
