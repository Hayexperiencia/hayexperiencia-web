import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ProjectGallery from "@/components/propiedades/ProjectGallery";
import ProjectSidebar from "@/components/proyectos/ProjectSidebar";

export const metadata: Metadata = {
  title: "Aquaverde",
  description: "Condominio campestre Aquaverde en Marinilla. 41 lotes entre 1.500 y 1.900 m2. Lago privado, senderos ecológicos, seguridad 24/7.",
};

const AMENIDADES = [
  "Lago privado",
  "Senderos ecológicos",
  "Seguridad 24/7",
  "Urbanismo de primer nivel",
  "Vías en excelente estado",
  "Cercanía a Marinilla y Medellín",
];

export default function AquaverdePage() {
  return (
    <div>
      <section className="relative bg-[var(--color-primary)] overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/proyectos/aquaverde-hero.webp" alt="Aquaverde - Condominio campestre en Marinilla" fill className="object-cover opacity-65" priority />
        </div>
        <div className="relative mx-auto max-w-4xl text-center px-4 py-24">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-semibold mb-4">
            Proyecto aliado
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Aquaverde</h1>
          <p className="mt-4 text-xl text-gray-300">Condominio campestre exclusivo en Marinilla</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Sobre el proyecto</h2>
            <p className="text-[var(--color-text-light)] leading-relaxed">
              Aquaverde es un condominio campestre exclusivo en Marinilla, Antioquia, que ofrece
              una experiencia de vida inigualable. El proyecto comprende 41 lotes campestres con
              tamaños entre 1.500 y 1.900 m², rodeados de naturaleza y con amenidades de primer nivel.
            </p>
            <p className="mt-4 text-[var(--color-text-light)] leading-relaxed">
              A pocos minutos de Medellín, Aquaverde combina seguridad, valorización y exclusividad
              para quienes desean invertir en un lote campestre con lago privado y senderos ecológicos.
            </p>
          </div>
          <div className="lg:col-span-1">
            <ProjectSidebar
              projectName="Aquaverde"
              location="Marinilla, Antioquia"
              waLink="https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20el%20proyecto%20Aquaverde%20en%20Marinilla"
              highlights={["41 lotes", "1.500 - 1.900 m²", "Lago privado", "Entrega Dic 2026"]}
            />
          </div>
        </div>
      </div>

      <ProjectGallery
        images={[
          { src: "/images/proyectos/aquaverde-hero.webp", alt: "Aquaverde - Vista general del condominio" },
          { src: "/images/proyectos/aquaverde-2.webp", alt: "Aquaverde - Render zona social" },
          { src: "/images/proyectos/aquaverde-3.webp", alt: "Aquaverde - Render lago privado" },
          { src: "/images/proyectos/aquaverde-4.webp", alt: "Aquaverde - Render senderos" },
        ]}
      />

      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Amenidades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AMENIDADES.map((a) => (
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
            Sitio oficial: <a href="https://aquaverde.co" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-primary)] hover:underline">aquaverde.co</a>
          </p>
        </div>
      </section>

      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-white">¿Te interesa Aquaverde?</h2>
          <p className="mt-4 text-gray-300">Contáctanos para conocer disponibilidad y agendar una visita.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20el%20proyecto%20Aquaverde%20en%20Marinilla"
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
      {/* Estado Actual */}
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

      {/* Mapa */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Ubicación</h2>
          <div className="rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=6.1601875,-75.3110625&z=15&output=embed"
              width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación Aquaverde — Marinilla"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
