import "server-only";

const STRAPI_URL = process.env.STRAPI_URL ?? "https://studio.hayexperiencia.com";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const DEFAULT_LOCALE = "es-CO";
const DEFAULT_REVALIDATE = 3600;

if (!STRAPI_TOKEN && process.env.NODE_ENV === "production") {
  console.warn("[strapi] STRAPI_API_TOKEN missing — public content types only");
}

type FetchOpts = {
  tags?: string[];
  revalidate?: number | false;
  locale?: string;
  populate?: string;
};

async function strapiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T | null> {
  const {
    tags = [],
    revalidate = DEFAULT_REVALIDATE,
    locale = DEFAULT_LOCALE,
    populate = "*",
  } = opts;

  const url = new URL(`/api/${path.replace(/^\//, "")}`, STRAPI_URL);
  if (populate && !url.searchParams.has("populate")) {
    url.searchParams.set("populate", populate);
  }
  if (locale && !url.searchParams.has("locale")) {
    url.searchParams.set("locale", locale);
  }

  try {
    const res = await fetch(url.toString(), {
      headers: STRAPI_TOKEN
        ? { Authorization: `Bearer ${STRAPI_TOKEN}` }
        : {},
      next: { tags, revalidate: revalidate === false ? undefined : revalidate },
    });
    if (!res.ok) {
      console.error(`[strapi] ${res.status} ${url.pathname}`);
      return null;
    }
    const json = (await res.json()) as { data: T };
    return json.data;
  } catch (err) {
    console.error(`[strapi] fetch failed ${url.pathname}:`, err);
    return null;
  }
}

export type StrapiMedia = {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: Record<string, { url: string; width: number; height: number }> | null;
};

export type StrapiSEO = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalURL?: string;
  metaImage?: StrapiMedia | null;
};

export type Address = {
  country?: string | null;
  department?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  street?: string | null;
  lat?: number | null;
  lng?: number | null;
};

export type TimelinePhase = {
  phase: string;
  date?: string | null;
  description?: string | null;
  completed: boolean;
};

export type UnitType = {
  name: string;
  kind?: string | null;
  areaDesde?: number | null;
  areaHasta?: number | null;
  rooms?: number | null;
  bathrooms?: number | null;
  priceFrom?: string | null;
  currency?: string | null;
  available?: number | null;
  total?: number | null;
};

export type Project = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  tagline?: string | null;
  status?: string | null;
  partner?: string | null;
  description?: string | null;
  video?: string | null;
  totalUnits?: number | null;
  availableUnits?: number | null;
  priceFrom?: string | null;
  areaFrom?: number | null;
  currency?: string | null;
  amenities?: string[] | null;
  logo?: StrapiMedia | null;
  cover?: StrapiMedia | null;
  gallery?: StrapiMedia[] | null;
  address?: Address | null;
  unitTypes?: UnitType[] | null;
  timeline?: TimelinePhase[] | null;
  zone?: { name: string; slug: string; summary?: string | null } | null;
  seo?: StrapiSEO | null;
  publishedAt?: string;
};

export type TeamMember = {
  id: number;
  documentId: string;
  name: string;
  role?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  photo?: StrapiMedia | null;
  order?: number | null;
};

export type Zone = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  type?: string | null;
  summary?: string | null;
  description?: string | null;
  highlights?: string[] | null;
};

export type NavItem = {
  url: string;
  label: string;
  children?: NavItem[];
};

export type FooterGroup = {
  title: string;
  items: { url: string; label: string }[];
};

export type Navigation = {
  id: number;
  documentId: string;
  primary: NavItem[];
  footer: FooterGroup[];
};

export type SiteSettings = {
  id: number;
  documentId: string;
  siteName?: string | null;
  tagline?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
  footerText?: string | null;
  logo?: StrapiMedia | null;
  logoLight?: StrapiMedia | null;
  favicon?: StrapiMedia | null;
  address?: Address | null;
  defaultSeo?: StrapiSEO | null;
};

export type Homepage = {
  id: number;
  documentId: string;
  intro?: string | null;
  hero?: {
    headline?: string | null;
    subhead?: string | null;
    ctaText?: string | null;
    ctaUrl?: string | null;
    backgroundImage?: StrapiMedia | null;
  } | null;
  featuredProjects?: Project[] | null;
};

export type Page = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  richBody?: string | null;
  seo?: StrapiSEO | null;
};

// ---------- Property (consumido del Strapi sync Wasi) ----------

export type StrapiPropertySpecs = {
  areaConstruida?: number | null;
  areaLote?: number | null;
  rooms?: number | null;
  bathrooms?: number | null;
  parking?: number | null;
  floors?: number | null;
  yearBuilt?: number | null;
  estrato?: number | null;
};

export type StrapiPropertyFinancial = {
  price?: number | string | null;
  currency?: string | null;
  administracion?: number | null;
  predial?: number | null;
  valorMetroCuadrado?: number | null;
};

export type StrapiPropertyFeature = { items?: unknown };

export type StrapiPropertyEnriched = {
  version?: number;
  computedAt?: string;
  disclaimer?: string;
  marketBenchmark?: {
    method?: string;
    segment?: { city?: string; propertyType?: string; transaction?: string; areaBand?: string };
    comparablesCount?: number;
    medianPrice?: number | null;
    p25Price?: number | null;
    p75Price?: number | null;
    medianPxM2?: number | null;
    p25PxM2?: number | null;
    p75PxM2?: number | null;
    codPct?: number | null;
    medianRecencyMonths?: number | null;
    confidence?: "high" | "medium" | "low" | "insufficient";
  };
  competitivePosition?: {
    status?: "BAJO" | "EN_RANGO" | "ALTO" | "SIN_BENCHMARK" | "SIN_DATOS";
    diffVsMedianPct?: number;
    diffVsMedianCop?: number;
    pxM2Property?: number;
    pxM2Market?: number;
    confidence?: string;
    narrativeShort?: string;
    narrativeLong?: string;
  };
  depreciation?: {
    yearBuilt?: number | null;
    ageYears?: number;
    usefulLife?: number;
    conservationClass?: number;
    fittoCorviniCoeff?: number;
    depreciationPct?: number;
    method?: string;
    applicable?: boolean;
    confidence?: string;
    narrativeShort?: string;
    narrativeLong?: string;
  };
  proximity?: {
    distanceToAutopistaKm?: number;
    distanceToCascoUrbanoKm?: number;
    distanceToAirportJmcKm?: number;
    distanceToMedellinKm?: number;
    narrativeShort?: string;
  };
  marketActivity?: {
    competitorListingsActive?: number;
    saturationLabel?: string;
    newInLast30Days?: number;
    medianListingAgeMonths?: number;
  };
  republishedIn?: {
    count: number;
    domains?: string[];
    matchType?: string | null;
  };
  comparablesPublic?: { title?: string; price?: number; areaM2?: number; pxM2?: number }[];
  comparablesPrivate?: { count: number; sourceTypes?: string[]; accessNote?: string };
  pricingAlert?: { active: boolean; recommendation?: string | null; suggestedPrice?: number | null };
};

export type StrapiProperty = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  wasiId: string;
  type: string;
  transaction: string;
  status?: string;
  description?: string | null;
  shortDescription?: string | null;
  video?: string | null;
  tour360Url?: string | null;
  coverUrl?: string | null;
  galleryUrls?: string[] | null;
  wasiUrl?: string | null;
  lastSyncedAt?: string | null;
  address?: Address | null;
  specs?: StrapiPropertySpecs | null;
  features?: StrapiPropertyFeature | null;
  financial?: StrapiPropertyFinancial | null;
  zone?: { name: string; slug: string; summary?: string | null } | null;
  project?: { name: string; slug: string } | null;
  enrichedData?: StrapiPropertyEnriched | null;
};

export type StrapiPropertyFilters = {
  city?: string;
  type?: string;
  transaction?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  pageSize?: number;
  page?: number;
};

export async function getPropertyByWasiId(wasiId: string | number): Promise<StrapiProperty | null> {
  const url = `properties?filters[wasiId][$eq]=${encodeURIComponent(String(wasiId))}`;
  const data = await strapiFetch<StrapiProperty[]>(url, {
    tags: ["properties", `property:${wasiId}`],
  });
  return data?.[0] ?? null;
}

export async function getStrapiProperties(
  filters: StrapiPropertyFilters = {}
): Promise<{ items: StrapiProperty[]; total: number }> {
  const parts: string[] = [];
  if (filters.city) parts.push(`filters[address][city][$eqi]=${encodeURIComponent(filters.city)}`);
  if (filters.type) parts.push(`filters[type][$eq]=${encodeURIComponent(filters.type)}`);
  if (filters.transaction) parts.push(`filters[transaction][$eq]=${encodeURIComponent(filters.transaction)}`);
  if (filters.minPrice) parts.push(`filters[financial][price][$gte]=${filters.minPrice}`);
  if (filters.maxPrice) parts.push(`filters[financial][price][$lte]=${filters.maxPrice}`);
  if (filters.bedrooms) parts.push(`filters[specs][rooms][$gte]=${filters.bedrooms}`);
  parts.push(`pagination[pageSize]=${filters.pageSize ?? 24}`);
  parts.push(`pagination[page]=${filters.page ?? 1}`);
  parts.push(`sort[0]=lastSyncedAt:desc`);

  const path = `properties?${parts.join("&")}`;
  const url = new URL(`/api/${path}`, STRAPI_URL);
  url.searchParams.set("locale", DEFAULT_LOCALE);
  url.searchParams.set("populate", "*");

  try {
    const res = await fetch(url.toString(), {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
      next: { tags: ["properties"], revalidate: DEFAULT_REVALIDATE },
    });
    if (!res.ok) {
      console.error(`[strapi] properties ${res.status}`);
      return { items: [], total: 0 };
    }
    const json = (await res.json()) as { data: StrapiProperty[]; meta?: { pagination?: { total?: number } } };
    return { items: json.data ?? [], total: json.meta?.pagination?.total ?? 0 };
  } catch (err) {
    console.error("[strapi] getStrapiProperties failed:", err);
    return { items: [], total: 0 };
  }
}

export async function getHomepage() {
  return strapiFetch<Homepage>("homepage", { tags: ["homepage"] });
}

export async function getNavigation() {
  return strapiFetch<Navigation>("navigation", { tags: ["navigation"] });
}

export async function getSiteSettings() {
  return strapiFetch<SiteSettings>("site-setting", { tags: ["site-settings"] });
}

export async function getProjects() {
  return strapiFetch<Project[]>("projects", { tags: ["project"] });
}

export async function getProject(slug: string) {
  const url = `projects?filters[slug][$eq]=${encodeURIComponent(slug)}`;
  const data = await strapiFetch<Project[]>(url, {
    tags: ["project", `project:${slug}`],
  });
  return data?.[0] ?? null;
}

export async function getPage(slug: string) {
  const url = `pages?filters[slug][$eq]=${encodeURIComponent(slug)}`;
  const data = await strapiFetch<Page[]>(url, {
    tags: ["page", `page:${slug}`],
  });
  return data?.[0] ?? null;
}

export async function getTeamMembers() {
  return strapiFetch<TeamMember[]>("team-members", {
    tags: ["team-members"],
  });
}

export async function getZones() {
  return strapiFetch<Zone[]>("zones", { tags: ["zones"] });
}

export function strapiMediaUrl(media: StrapiMedia | null | undefined): string | null {
  if (!media?.url) return null;
  if (media.url.startsWith("http")) return media.url;
  return `${STRAPI_URL}${media.url}`;
}
