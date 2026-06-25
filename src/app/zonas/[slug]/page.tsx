import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getZona, listZonaSlugs, type Zona } from "@/lib/zonas";
import { getStrapiProperties } from "@/lib/strapi";
import { getWhatsAppLink } from "@/lib/utils";

export const revalidate = 21600;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hayexperiencia.com";

type PageProps = { params: Promise<{ slug: string }> };

function zonaTitle(z: Zona): string {
  return `Inmobiliaria en ${z.nombre}: precios y propiedades | Hay Experiencia`;
}
function zonaDescription(z: Zona): string {
  const apto = z.segmentos.find((s) => s.tipo === "apartamento");
  const precio = apto ? `Apartamentos desde una mediana de ${apto.medianaPrecioMM} millones` : "Precios actualizados";
  return `${precio} en ${z.nombre}, Oriente Antioqueno (datos a ${z.asOf}). Propiedades, precios de mercado y asesoria de Hay Experiencia.`;
}
function fmtPxM2(mm: number | null): string {
  if (mm == null) return "—";
  if (mm >= 1) return `$${mm.toFixed(2).replace(".", ",")}M/m²`;
  return `$${Math.round(mm * 1_000_000).toLocaleString("es-CO")}/m²`;
}

export function generateStaticParams() {
  return listZonaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const zona = getZona(slug);
  if (!zona) return { title: "Zona no encontrada" };
  const title = zonaTitle(zona);
  const description = zonaDescription(zona);
  const url = `${SITE}/zonas/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ZonaPage({ params }: PageProps) {
  const { slug } = await params;
  const zona = getZona(slug);
  if (!zona) notFound();

  const { items } = await getStrapiProperties({ city: zona.nombre, transaction: "venta", pageSize: 8 });
  const waLink = getWhatsAppLink(`Hola, quiero asesoria para comprar o vender en ${zona.nombre}.`);
  const url = `${SITE}/zonas/${slug}`;
  const title = zonaTitle(zona);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": `${SITE}/#organization`,
        name: "Hay Experiencia",
        url: SITE,
        areaServed: { "@type": "City", name: `${zona.nombre}, Antioquia, Colombia` },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description: zonaDescription(zona),
        about: { "@type": "Place", name: `${zona.nombre}, Oriente Antioqueno, Colombia` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
          { "@type": "ListItem", position: 2, name: "Zonas" },
          { "@type": "ListItem", position: 3, name: zona.nombre, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: zona.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav className="text-sm text-[var(--color-text-light)] mb-4">
        <Link href="/" className="hover:underline">Inicio</Link> · {zona.nombre}
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)]">
        Comprar y vender en {zona.nombre}, Oriente Antioqueno
      </h1>
      <p className="mt-4 text-[var(--color-text-light)] leading-relaxed text-lg">{zona.intro}</p>

      {/* Tabla de mercado por tipo */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-1">
          Precios de mercado en {zona.nombre}
        </h2>
        <p className="text-sm text-[var(--color-text-light)] mb-4">
          Mediana de propiedades en venta · datos a {zona.asOf} · {zona.totalActivos.toLocaleString("es-CO")} listings activos del mercado.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[var(--color-primary)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Activos</th>
                <th className="px-4 py-3 font-semibold">Mediana de precio</th>
                <th className="px-4 py-3 font-semibold">Mediana por m²</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {zona.segmentos.map((s) => (
                <tr key={s.tipo}>
                  <td className="px-4 py-3 font-medium text-[var(--color-primary)]">{s.etiqueta}</td>
                  <td className="px-4 py-3 text-[var(--color-text-light)]">{s.activos.toLocaleString("es-CO")}</td>
                  <td className="px-4 py-3 text-[var(--color-text-light)]">${s.medianaPrecioMM} millones</td>
                  <td className="px-4 py-3 text-[var(--color-text-light)]">{fmtPxM2(s.medianaPxM2MM)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400 italic">
          Estimacion referencial de mercado calculada desde listings publicos del Oriente Antioqueno.
          No constituye avaluo certificado (Ley 1673/2013).
        </p>
      </section>

      {/* Propiedades HEI en la zona */}
      {items.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4">
            Propiedades en venta en {zona.nombre}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <Link
                key={p.wasiId}
                href={`/propiedades/${p.wasiId}`}
                className="rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-md transition"
              >
                {p.coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverUrl} alt={p.title} className="h-40 w-full object-cover" loading="lazy" />
                )}
                <div className="p-3">
                  <p className="font-semibold text-[var(--color-primary)] line-clamp-2 text-sm">{p.title}</p>
                  {p.financial?.price && (
                    <p className="mt-1 text-[var(--color-primary)] font-bold">
                      ${Number(p.financial.price).toLocaleString("es-CO")}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <Link href="/propiedades" className="mt-4 inline-block text-[var(--color-primary)] font-medium hover:underline">
            Ver todas las propiedades →
          </Link>
        </section>
      )}

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4">Preguntas frecuentes sobre {zona.nombre}</h2>
        <div className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)]">
          {zona.faqs.map((f, i) => (
            <details key={i} className="group p-4 open:bg-gray-50/60">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-[var(--color-primary)]">
                {f.q}
                <span className="ml-3 shrink-0 text-xl text-[var(--color-text-light)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-light)]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10 rounded-2xl bg-[var(--color-primary)] p-6 sm:p-8 text-white">
        <h2 className="text-xl sm:text-2xl font-bold">¿Quieres comprar o vender en {zona.nombre}?</h2>
        <p className="mt-2 text-white/85">
          Te asesoramos con datos reales del mercado de {zona.nombre}. Respondemos en menos de 24 horas.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Hablar con un asesor por WhatsApp
        </a>
      </section>
    </div>
  );
}
