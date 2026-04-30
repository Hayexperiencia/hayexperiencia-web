import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/propiedades/ProjectGallery";
import ProjectSidebar from "@/components/proyectos/ProjectSidebar";
import { getProject } from "@/lib/strapi";
import { markdownToHtml } from "@/lib/markdown";

export const revalidate = 3600;
const PROJECT_SLUG = "remanso";

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject(PROJECT_SLUG);
  return {
    title: project?.seo?.metaTitle ?? "Remanso de Oriente",
    description:
      project?.seo?.metaDescription ??
      project?.tagline ??
      "Proyecto residencial Remanso de Oriente. Tranquilidad en el corazón del Oriente Antioqueño.",
  };
}

export default async function RemansoPage() {
  const project = await getProject(PROJECT_SLUG);
  if (!project) notFound();

  const descriptionHtml = markdownToHtml(project.description);
  const total = project.totalUnits ?? 66;
  const available = project.availableUnits ?? 6;
  const sold = total - available;
  const lat = project.address?.lat ?? 6.1787328;
  const lng = project.address?.lng ?? -75.3529425;
  const cityLabel = project.address?.city ?? "Marinilla";

  const waLink = `https://wa.me/573022343659?text=${encodeURIComponent(`Hola, me interesa ${project.name}`)}`;

  return (
    <div>
      <section className="relative bg-[var(--color-primary)] overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-oriente.jpg" alt="Oriente Antioqueño" fill className="object-cover opacity-65" priority />
        </div>
        <div className="relative mx-auto max-w-4xl text-center px-4 py-24">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-semibold mb-4">
            {sold} de {total} unidades vendidas
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
              location={cityLabel === "Marinilla" ? "Oriente Antioqueño" : `${cityLabel}, Antioquia`}
              waLink={waLink}
              highlights={[
                `${sold}/${total} vendidas`,
                "Últimas unidades",
                "1ra etapa terminando",
              ]}
            />
          </div>
        </div>
      </div>

      <ProjectGallery
        images={[{ src: "/images/hero-oriente.jpg", alt: "Paisaje del Oriente Antioqueno" }]}
        title="Ubicación"
      />

      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-white">Quedan pocas unidades</h2>
          <p className="mt-4 text-gray-300">Contáctanos para conocer disponibilidad y precios.</p>
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
            {["Terminando la 1ra etapa", "Últimas unidades disponibles"].map((item) => (
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
              width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Ubicación ${project.name}`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
