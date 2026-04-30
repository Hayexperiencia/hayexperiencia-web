import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/propiedades/ProjectGallery";
import ProjectSidebar from "@/components/proyectos/ProjectSidebar";
import { getProject } from "@/lib/strapi";
import { markdownToHtml } from "@/lib/markdown";

export const revalidate = 3600;
const PROJECT_SLUG = "aquaverde";

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject(PROJECT_SLUG);
  return {
    title: project?.seo?.metaTitle ?? "Aquaverde",
    description:
      project?.seo?.metaDescription ??
      project?.tagline ??
      "Condominio campestre Aquaverde en Marinilla. 41 lotes entre 1.500 y 1.900 m2. Lago privado, senderos ecológicos, seguridad 24/7.",
  };
}

const FALLBACK_GALLERY = [
  { src: "/images/proyectos/aquaverde-hero.webp", alt: "Aquaverde - Vista general del condominio" },
  { src: "/images/proyectos/aquaverde-2.webp", alt: "Aquaverde - Render zona social" },
  { src: "/images/proyectos/aquaverde-3.webp", alt: "Aquaverde - Render lago privado" },
  { src: "/images/proyectos/aquaverde-4.webp", alt: "Aquaverde - Render senderos" },
];

const STATUS_LABEL: Record<string, string> = {
  preventa: "Preventa",
  construccion: "En construcción",
  aliado: "Proyecto aliado",
};

export default async function AquaverdePage() {
  const project = await getProject(PROJECT_SLUG);
  if (!project) notFound();

  const descriptionHtml = markdownToHtml(project.description);
  const statusLabel = project.status ? STATUS_LABEL[project.status] ?? project.status : "Proyecto aliado";
  const lat = project.address?.lat ?? 6.1601875;
  const lng = project.address?.lng ?? -75.3110625;
  const cityLabel = project.address?.city ?? "Marinilla";
  const amenities = project.amenities && project.amenities.length > 0
    ? project.amenities
    : [
        "Lago privado",
        "Senderos ecológicos",
        "Seguridad 24/7",
        "Urbanismo de primer nivel",
        "Vías en excelente estado",
        "Cercanía a Marinilla y Medellín",
      ];

  const waLink = `https://wa.me/573022343659?text=${encodeURIComponent(`Hola, me interesa el proyecto ${project.name} en ${cityLabel}`)}`;

  return (
    <div>
      <section className="relative bg-[var(--color-primary)] overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/proyectos/aquaverde-hero.webp" alt={`${project.name} - Condominio campestre`} fill className="object-cover opacity-65" priority />
        </div>
        <div className="relative mx-auto max-w-4xl text-center px-4 py-24">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-semibold mb-4">
            {statusLabel}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">{project.name}</h1>
          {project.tagline && (
            <p className="mt-4 text-xl text-gray-300">{project.tagline}</p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Sobre el proyecto</h2>
            <div
              className="markdown-content text-[var(--color-text-light)]"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </div>
          <div className="lg:col-span-1">
            <ProjectSidebar
              projectName={project.name}
              location={`${cityLabel}, Antioquia`}
              waLink={waLink}
              highlights={[
                project.totalUnits ? `${project.totalUnits} lotes` : "41 lotes",
                project.areaFrom ? `Desde ${project.areaFrom.toLocaleString("es-CO")} m²` : "1.500 - 1.900 m²",
                "Lago privado",
                "Entrega Dic 2026",
              ]}
            />
          </div>
        </div>
      </div>

      <ProjectGallery images={FALLBACK_GALLERY} />

      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Amenidades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {amenities.map((a) => (
              <div key={a} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[var(--color-border)]">
                <svg className="h-5 w-5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-[var(--color-primary)]">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm text-[var(--color-text-light)]">
            Sitio oficial:{" "}
            <a href="https://aquaverde.co" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-primary)] hover:underline">
              aquaverde.co
            </a>
          </p>
        </div>
      </section>

      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-white">¿Te interesa {project.name}?</h2>
          <p className="mt-4 text-gray-300">Contáctanos para conocer disponibilidad y agendar una visita.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
            >
              WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors"
            >
              Solicitar información
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Estado Actual del Proyecto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Entrega a diciembre de 2026", "Lotes independientes listos para escrituración", "En proceso de urbanismo"].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-[var(--color-primary)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Ubicación</h2>
          <div className="rounded-2xl overflow-hidden">
            <iframe
              src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
              width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Ubicación ${project.name} — ${cityLabel}`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
