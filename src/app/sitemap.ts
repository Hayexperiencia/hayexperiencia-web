import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hayexperiencia.com";

// Sitemap de rutas core. El sitemap dinamico de cada propiedad y de las paginas de zona
// (Marinilla, Rionegro, La Ceja, El Penol) es trabajo de escalado del frente SEO/GEO:
// mapear getStrapiProperties() -> una entrada por /propiedades/[id].
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const rutas = ["", "/propiedades", "/proyectos", "/cotizador", "/nosotros", "/contacto"];
  return rutas.map((r) => ({
    url: `${SITE}${r}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.7,
  }));
}
