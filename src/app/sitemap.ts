import type { MetadataRoute } from "next";
import { getStrapiProperties } from "@/lib/strapi";
import { listZonaSlugs } from "@/lib/zonas";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hayexperiencia.com";

export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    "",
    "/propiedades",
    "/proyectos",
    "/cotizador",
    "/nosotros",
    "/contacto",
  ].map((r) => ({
    url: `${SITE}${r}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.7,
  }));

  const zonas: MetadataRoute.Sitemap = listZonaSlugs().map((slug) => ({
    url: `${SITE}/zonas/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Una entrada por propiedad (las landings individuales son lo que indexa/cita).
  let propiedades: MetadataRoute.Sitemap = [];
  try {
    const { items } = await getStrapiProperties({ pageSize: 200 });
    propiedades = items
      .filter((p) => p.wasiId)
      .map((p) => ({
        url: `${SITE}/propiedades/${p.wasiId}`,
        lastModified: p.lastSyncedAt ? new Date(p.lastSyncedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch {
    // Si Strapi no responde, el sitemap core + zonas se sirve igual.
  }

  return [...core, ...zonas, ...propiedades];
}
