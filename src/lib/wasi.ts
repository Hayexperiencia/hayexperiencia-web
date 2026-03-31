import { WasiProperty, WasiSearchResponse, PropertyFilters } from "./types";

const WASI_BASE = "https://api.wasi.co/v1";

async function wasiPost(
  endpoint: string,
  body: Record<string, string> = {},
  revalidate = 3600
) {
  const formData = new URLSearchParams({
    id_company: process.env.WASI_COMPANY_ID || "",
    wasi_token: process.env.WASI_TOKEN || "",
    ...body,
  });

  const res = await fetch(`${WASI_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Wasi API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function parseSearchResponse(data: WasiSearchResponse): {
  total: number;
  properties: WasiProperty[];
} {
  const total = data.total || 0;
  const properties: WasiProperty[] = [];
  for (const key of Object.keys(data)) {
    if (key === "total") continue;
    const prop = data[key];
    if (typeof prop === "object" && prop !== null && "id_property" in prop) {
      properties.push(prop as WasiProperty);
    }
  }
  return { total, properties };
}

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<{ total: number; properties: WasiProperty[] }> {
  const body: Record<string, string> = {
    take: String(filters.take || 20),
    skip: String(filters.skip || 0),
  };

  if (filters.for_sale) body.for_sale = "1";
  if (filters.for_rent) body.for_rent = "1";
  if (!filters.for_sale && !filters.for_rent) body.for_sale = "1";
  if (filters.id_property_type) body.id_property_type = String(filters.id_property_type);
  if (filters.id_city) body.id_city = String(filters.id_city);
  if (filters.bedrooms) body.bedrooms = String(filters.bedrooms);
  if (filters.min_area) body.min_area = String(filters.min_area);
  if (filters.max_area) body.max_area = String(filters.max_area);
  if (filters.min_price) body.min_price = String(filters.min_price);
  if (filters.max_price) body.max_price = String(filters.max_price);

  const data = await wasiPost("/property/search", body);
  return parseSearchResponse(data);
}

export async function getProperty(id: string): Promise<WasiProperty | null> {
  try {
    const data = await wasiPost(`/property/get/${id}`, {}, 21600);
    return data as WasiProperty;
  } catch {
    return null;
  }
}

export async function getFeaturedProperties(
  take = 6
): Promise<WasiProperty[]> {
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
