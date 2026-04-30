import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/propiedades/ProjectGallery";
import ProjectSidebar from "@/components/proyectos/ProjectSidebar";
import { getProject } from "@/lib/strapi";
import { markdownToHtml } from "@/lib/markdown";

export const revalidate = 3600;
const PROJECT_SLUG = "el-faro";

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject(PROJECT_SLUG);
  return {
    title: project?.seo?.metaTitle ?? "El Faro — Condominio Náutico en El Peñol",
    description:
      project?.seo?.metaDescription ??
      project?.tagline ??
      "Condominio Náutico El Faro en El Peñol, Antioquia. Península de 10 cuadras sobre la represa de Guatapé. Suites, villas, sede náutica.",
    openGraph: {
      title: project?.name ?? "El Faro — Condominio Náutico sobre la represa de Guatapé",
      description:
        project?.tagline ??
        "Península exclusiva con 1.5 km de costa, sede náutica y vistas 360 de la represa.",
      images: ["/images/proyectos/el-faro-hero.jpg"],
    },
  };
}

const PROPUESTA_VALOR = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: "Península exclusiva",
    desc: "10 cuadras rodeadas de agua, con 1.5 km de costa sobre la represa de Guatapé.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 2h8l-1 4H9L8 2z" />
      </svg>
    ),
    title: "Acceso náutico directo",
    desc: "Sede náutica con muelles propios. Sal al agua desde tu condominio.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Inversión con retorno",
    desc: "Arrienda tu unidad cuando no la uses. La represa de Guatapé es destino turístico todo el año.",
  },
];

const UNIT_DESCRIPTIONS: Record<string, string> = {
  "Suite Simplex": "Apartamento en un nivel, ideal para parejas o inversión",
  "Suite Duplex": "Apartamento en dos niveles, mayor espacio y privacidad",
  "Villa 2 niveles": "Casa independiente sobre terreno de uso exclusivo",
  "Villa 3 niveles": "Casa amplia con terraza y vistas panorámicas",
  "Villa en terreno plano": "Casa con jardín privado y acceso directo",
};

const FALLBACK_GALLERY = [
  { src: "/images/proyectos/el-faro-drone-hd.jpg", alt: "Vista aérea de la península El Faro" },
  { src: "/images/proyectos/el-faro-villas.jpg", alt: "Villas El Faro" },
  { src: "/images/proyectos/el-faro-villa-1.jpg", alt: "Villa a nivel" },
  { src: "/images/proyectos/el-faro-villa-2.jpg", alt: "Villa 3 pisos" },
  { src: "/images/proyectos/el-faro-simplex.jpg", alt: "Suite Simplex" },
  { src: "/images/proyectos/el-faro-duplex.jpg", alt: "Suite Duplex" },
];

const STATUS_LABEL: Record<string, string> = {
  preventa: "Preventa",
  construccion: "En construcción",
  entrega: "Entrega",
  vendido: "Vendido",
};

export default async function ElFaroPage() {
  const project = await getProject(PROJECT_SLUG);
  if (!project) notFound();

  const descriptionHtml = markdownToHtml(project.description);
  const statusLabel = project.status ? STATUS_LABEL[project.status] ?? project.status : "En desarrollo";
  const lat = project.address?.lat ?? 6.2406364;
  const lng = project.address?.lng ?? -75.2014938;
  const cityLabel = project.address?.city ?? "El Peñol";
  const amenities = project.amenities && project.amenities.length > 0
    ? project.amenities
    : [
        "Sede náutica con muelles",
        "Senderos ecológicos",
        "Zona de reserva natural",
        "Portería con vigilancia 24/7",
        "Vistas 360 de la represa",
        "1.5 km de perímetro costero",
      ];
  const unitTypes = project.unitTypes && project.unitTypes.length > 0
    ? project.unitTypes
    : Object.keys(UNIT_DESCRIPTIONS).map((name) => ({ name, kind: null, total: null }));

  const waLink = `https://wa.me/573022343659?text=${encodeURIComponent(`Hola, me interesa el proyecto ${project.name} en ${cityLabel}`)}`;

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-[var(--color-primary)] overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <Image src="/images/proyectos/el-faro-hero.jpg" alt={project.name} fill className="object-cover opacity-65" priority />
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
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center px-8 py-4 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-bold text-lg hover:bg-[var(--color-accent-light)] transition-colors"
          >
            Solicitar información
          </a>
        </div>
      </section>

      {/* VIDEO + SOBRE EL PROYECTO + SIDEBAR */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
            {project.video && (
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src={project.video}
                  title={`${project.name} — Condominio Náutico`}
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

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
          </div>
          <div className="lg:col-span-1">
            <ProjectSidebar
              projectName={project.name}
              location={`${cityLabel}, Antioquia`}
              waLink={waLink}
              highlights={["Península exclusiva", "1.5 km de costa", "Sede náutica", "60% completado"]}
            />
          </div>
        </div>
      </div>

      {/* GALERIA */}
      <ProjectGallery images={FALLBACK_GALLERY} />

      {/* TIPOS DE UNIDADES */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-8">Tipos de unidades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {unitTypes.map((u) => (
              <div key={u.name} className="p-6 rounded-2xl bg-white border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors">
                <h3 className="text-lg font-bold text-[var(--color-primary)]">{u.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-light)]">
                  {UNIT_DESCRIPTIONS[u.name] ?? ""}
                </p>
                {u.total && (
                  <p className="mt-3 text-sm font-semibold text-[var(--color-accent)]">{u.total} unidades</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA INTERMEDIO */}
      <section className="py-12 bg-[var(--color-accent)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">¿Quieres conocer {project.name}?</h2>
          <p className="mt-2 text-[var(--color-primary)]/80">Agenda una visita a la península y descubre el proyecto en persona.</p>
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

      {/* ESTADO ACTUAL DEL PROYECTO */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Estado Actual del Proyecto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              "60% del proyecto terminado y habitado",
              "Obras generales listas",
              "Pago hasta en 15 meses",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-[var(--color-primary)]">{item}</span>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4">Amenidades</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {amenities.map((a) => (
              <div key={a} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                <svg className="h-5 w-5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-[var(--color-primary)]">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAPA */}
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
              <div className="font-semibold text-[var(--color-primary)]">1h 30min</div>
              <div className="text-[var(--color-text-light)]">Desde Medellín</div>
            </div>
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">Represa Guatapé</div>
              <div className="text-[var(--color-text-light)]">Sobre el agua</div>
            </div>
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">10 cuadras</div>
              <div className="text-[var(--color-text-light)]">Península</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-white">{project.name} te espera</h2>
          <p className="mt-4 text-gray-300">La península sobre la represa de Guatapé. Tu próximo destino, tu próxima inversión.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
            >
              Escribir por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-3.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors"
            >
              Solicitar información
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
