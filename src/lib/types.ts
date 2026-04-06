export interface WasiProperty {
  id_property: number;
  id_company: number;
  id_user: number;
  title: string;
  for_sale: string;
  for_rent: string;
  id_property_type: number;
  id_country: number;
  country_label: string;
  id_region: number;
  region_label: string;
  id_city: number;
  city_label: string;
  id_location: number;
  location_label: string;
  id_zone: number;
  zone_label: string;
  iso_currency: string;
  sale_price: string;
  sale_price_label: string;
  rent_price: string;
  rent_price_label: string;
  area: string;
  built_area: string;
  private_area: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  stratum: string;
  floor: string;
  observations: string;
  address: string;
  latitude: string;
  longitude: string;
  images?: WasiImage[];
  main_image?: WasiMainImage | null;
  galleries?: WasiGallery[];
  features?: Record<string, WasiFeature[]>;
  video?: string;
  featured: number;
  unit_area_label: string;
  unit_built_area_label: string;
  half_bathrooms: number;
  maintenance_fee: string;
  maintenance_fee_label: string;
}

export interface WasiImage {
  url: string;
  url_big?: string;
  url_original?: string;
  description?: string;
}

export interface WasiMainImage {
  id_gallery: number;
  id_image: number;
  url: string;
  url_big: string;
  url_original: string;
  description: string;
  filename: string;
  position: number;
}

export interface WasiGallery {
  id: number;
  [key: string]: WasiGalleryImage | number;
}

export interface WasiGalleryImage {
  id: number;
  url: string;
  url_big: string;
  url_original: string;
  description: string;
  filename: string;
  position: number;
}

export interface WasiFeature {
  id: number;
  name: string;
  value?: string;
}

export interface WasiSearchResponse {
  total: number;
  [key: string]: WasiProperty | number;
}

export interface PropertyFilters {
  for_sale?: boolean;
  for_rent?: boolean;
  id_property_type?: number;
  id_city?: number;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  stratum?: number;
  min_area?: number;
  max_area?: number;
  skip?: number;
  take?: number;
}

export interface EnrichedData {
  wasi_id: string;
  avg_price_m2_zone: number | null;
  price_vs_avg_pct: number | null;
  qa_score: number | null;
  similar_properties: string | null;
  updated_at: string;
}

export interface MarketAverage {
  avg_price_m2: number;
  city: string;
  property_type: number;
  period: string;
}

export const PROPERTY_TYPES: Record<number, string> = {
  1: "Casa",
  2: "Apartamento",
  3: "Oficina",
  4: "Local",
  5: "Lote",
  6: "Bodega",
  7: "Finca",
  8: "Edificio",
  9: "Parqueadero",
};
