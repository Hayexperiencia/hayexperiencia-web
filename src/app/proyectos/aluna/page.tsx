import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/propiedades/ProjectGallery";
import AlunaCotizador from "@/components/proyectos/AlunaCotizador";
import ProjectSidebar from "@/components/proyectos/ProjectSidebar";
import { getProject } from "@/lib/strapi";
import { markdownToHtml } from "@/lib/markdown";

export const revalidate = 3600;
const PROJECT_SLUG = "aluna";

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject(PROJECT_SLUG);
  return {
    title: project?.seo?.metaTitle ?? "ALUNA Campestre — Lotes en Marinilla",
    description:
      project?.seo?.metaDescription ??
      project?.tagline ??
      "Lotes campestres desde 2.500 m2 en Marinilla, Oriente Antioqueño. Proyecto Hay Experiencia + Arka11. Unidad cerrada, vías pavimentadas, entorno natural.",
    openGraph: {
      title: project?.name ?? "ALUNA Campestre — Lotes campestres en Marinilla",
      description:
        project?.tagline ??
        "Tu espacio para crear la casa de tus sueños rodeado de naturaleza, a 45 min de Medellín.",
      images: ["/images/proyectos/aluna-hero.png"],
    },
  };
}

const PROPUESTA_VALOR = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Ubicación estratégica",
    desc: "A 45 minutos de Medellín, cerca de las vías a El Carmen de Viboral y Rionegro.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Alta valorización",
    desc: "El Oriente Antioqueño es la zona con mayor crecimiento inmobiliario de Colombia.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Infraestructura de primer nivel",
    desc: "Unidad cerrada con vías pavimentadas, redes subterráneas y portería.",
  },
];

const STATUS_LABEL: Record<string, string> = {
  preventa: "Preventa",
  construccion: "En construcción",
  entrega: "Entrega",
  vendido: "Vendido",
};

function formatCOP(amount?: string | null): string {
  if (!amount) return "";
  const num = Number(amount);
  if (Number.isNaN(num)) return "";
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1)}MM`;
  if (num >= 1_000_000) return `$${Math.round(num / 1_000_000)}M`;
  return `$${num.toLocaleString("es-CO")}`;
}

const FALLBACK_GALLERY = [
  { src: "/images/proyectos/aluna-hero.png", alt: "ALUNA Campestre - Vista panorámica" },
  { src: "/images/proyectos/aluna-drone-1.jpg", alt: "Vista aérea del proyecto ALUNA" },
  { src: "/images/proyectos/aluna-drone-2.jpg", alt: "Lotes campestres desde el aire" },
  { src: "/images/proyectos/aluna-drone-3.jpg", alt: "Entorno natural de ALUNA" },
  { src: "/images/proyectos/aluna-evento-1.jpg", alt: "Visita al terreno ALUNA" },
  { src: "/images/proyectos/aluna-evento-2.jpg", alt: "Recorrido por los lotes" },
  { src: "/images/proyectos/aluna-evento-3.jpg", alt: "Evento Amanecer en ALUNA" },
];

export default async function AlunaPage() {
  const project = await getProject(PROJECT_SLUG);
  if (!project) notFound();

  const descriptionHtml = markdownToHtml(project.description);
  const statusLabel = project.status ? STATUS_LABEL[project.status] ?? project.status : "Preventa";
  const total = project.totalUnits ?? 39;
  const available = project.availableUnits ?? 9;
  const sold = total - available;
  const soldPct = total ? Math.round((sold / total) * 100) : 0;
  const priceLabel = formatCOP(project.priceFrom) || "$411M";
  const lat = project.address?.lat ?? 6.1520128;
  const lng = project.address?.lng ?? -75.3321179;
  const cityLabel = project.address?.city ?? "Marinilla";
  const amenities = project.amenities && project.amenities.length > 0
    ? project.amenities
    : [
        "Lotes desde 2.500 m2",
        "Unidad cerrada",
        "Vías pavimentadas",
        "Redes subterráneas (acueducto, gas, alcantarillado, energía)",
        "Cerca de vías a El Carmen de Viboral y Rionegro",
        "45-50 minutos de Medellín",
      ];

  const waLink = `https://wa.me/573022343659?text=${encodeURIComponent(`Hola, me interesa el proyecto ${project.name}`)}`;

  return (
    <div>
      {/* 1. HERO */}
      <section className="relative bg-[var(--color-primary)] overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <Image src="/images/proyectos/aluna-hero.png" alt={project.name} fill className="object-cover opacity-65" priority />
        </div>
        <div className="relative mx-auto max-w-4xl text-center px-4 py-24">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-bold mb-4">
            {statusLabel}
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-white">{project.name}</h1>
          {project.tagline && (
            <p className="mt-4 text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto">
              {project.tagline}
            </p>
          )}
          <a
            href="#cotizador"
            className="mt-8 inline-flex items-center px-8 py-4 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-bold text-lg hover:bg-[var(--color-accent-light)] transition-colors"
          >
            Ver cotizador
          </a>
        </div>
      </section>

      {/* Contenido principal + Sidebar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
            {/* Video */}
            {project.video && (
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src={project.video}
                  title={`${project.name} — Video del proyecto`}
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Sobre el proyecto */}
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Sobre el proyecto</h2>
              <div
                className="markdown-content text-lg text-[var(--color-text-light)]"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
                {PROPUESTA_VALOR.map((pv, i) => (
                  <div key={i} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] mb-4">
                      {pv.icon}
                    </div>
                    <h3 className="font-bold text-[var(--color-primary)] mb-2">{pv.title}</h3>
                    <p className="text-sm text-[var(--color-text-light)]">{pv.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Características */}
            <div>
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4">Características del proyecto</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {amenities.map((c) => (
                  <div key={c} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                    <svg className="h-5 w-5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-[var(--color-primary)]">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProjectSidebar
              projectName={project.name}
              price={priceLabel}
              location={`${cityLabel}, Antioquia`}
              waLink={waLink}
              highlights={[
                `${available} lotes disponibles`,
                project.areaFrom ? `Desde ${project.areaFrom.toLocaleString("es-CO")} m²` : "Desde 2.500 m²",
                "Entrega inmediata",
                `${soldPct}% vendido`,
              ]}
            />
          </div>
        </div>
      </div>

      {/* Galería (full-width) */}
      <ProjectGallery images={FALLBACK_GALLERY} title="Galería del proyecto" />

      {/* CTA intermedio */}
      <section className="py-12 bg-[var(--color-accent)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">¿Te interesa {project.name}?</h2>
          <p className="mt-2 text-[var(--color-primary)]/80">Hablemos. Sin compromiso, sin letra pequeña.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
            >
              Escribir por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 transition-colors"
            >
              Solicitar información
            </Link>
          </div>
        </div>
      </section>

      {/* Estado actual */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Estado Actual del Proyecto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              "Lotes disponibles para entrega inmediata",
              `${available} lotes disponibles`,
              "95% de la obra terminada",
              "En escrituración",
              "Plan de pagos hasta junio de 2027",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-[var(--color-primary)]">{item}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gray-50 text-center">
              <div className="text-4xl font-bold text-[var(--color-accent)]">{soldPct}%</div>
              <div className="text-sm text-[var(--color-text-light)] mt-1">Vendido ({sold} de {total})</div>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 text-center">
              <div className="text-4xl font-bold text-[var(--color-primary)]">{available}</div>
              <div className="text-sm text-[var(--color-text-light)] mt-1">Lotes disponibles</div>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 text-center">
              <div className="text-sm font-semibold text-[var(--color-primary)]">Última actualización</div>
              <div className="text-sm text-[var(--color-text-light)] mt-1">Abril 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Ubicación</h2>
          <div className="rounded-2xl overflow-hidden">
            <iframe
              src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Ubicación ${project.name} — ${cityLabel}`}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">{cityLabel}</div>
              <div className="text-[var(--color-text-light)]">Ubicación</div>
            </div>
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">45 min</div>
              <div className="text-[var(--color-text-light)]">Desde Medellín</div>
            </div>
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">15 min</div>
              <div className="text-[var(--color-text-light)]">Desde Rionegro</div>
            </div>
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">Aeropuerto JMC</div>
              <div className="text-[var(--color-text-light)]">20 min</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cotizador */}
      <AlunaCotizador />

      {/* Alianza */}
      {project.partner && (
        <section className="py-8 bg-gray-50/50">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="text-sm text-[var(--color-text-light)]">
              Proyecto desarrollado en alianza con{" "}
              <a href="https://arka11.co" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-primary)] hover:underline">
                {project.partner}
              </a>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
