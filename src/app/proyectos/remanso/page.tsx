import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ProjectGallery from "@/components/propiedades/ProjectGallery";
import ProjectSidebar from "@/components/proyectos/ProjectSidebar";

export const metadata: Metadata = {
  title: "Remanso de Oriente",
  description: "Proyecto residencial Remanso de Oriente. 60 de 66 unidades vendidas. Tranquilidad en el corazón del Oriente Antioqueño.",
};

export default function RemansoPage() {
  return (
    <div>
      <section className="relative bg-[var(--color-primary)] overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-oriente.jpg" alt="Oriente Antioqueño" fill className="object-cover opacity-65" priority />
        </div>
        <div className="relative mx-auto max-w-4xl text-center px-4 py-24">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-semibold mb-4">
            60 de 66 unidades vendidas
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Remanso de Oriente</h1>
          <p className="mt-4 text-xl text-gray-300">Tranquilidad en el corazón del Oriente Antioqueño</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Sobre el proyecto</h2>
            <p className="text-[var(--color-text-light)] leading-relaxed">
              Remanso de Oriente es un proyecto residencial de 66 unidades ubicado en el Oriente Antioqueño,
              diseñado para quienes buscan tranquilidad sin alejarse de la ciudad. Con 60 unidades ya vendidas,
              el proyecto demuestra la confianza del mercado en esta zona de alto crecimiento.
            </p>
            <p className="mt-4 text-[var(--color-text-light)] leading-relaxed">
              Hay Experiencia participa como comercializador de este proyecto. Si te interesa alguna de
              las unidades disponibles, contáctanos para conocer opciones y precios actualizados.
            </p>
          </div>
          <div className="lg:col-span-1">
            <ProjectSidebar
              projectName="Remanso de Oriente"
              location="Oriente Antioqueño"
              waLink="https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20Remanso%20de%20Oriente"
              highlights={["60/66 vendidas", "Últimas unidades", "1ra etapa terminando"]}
            />
          </div>
        </div>
      </div>

      <ProjectGallery
        images={[
          { src: "/images/hero-oriente.jpg", alt: "Paisaje del Oriente Antioqueno" },
        ]}
        title="Ubicación"
      />

      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-white">Quedan pocas unidades</h2>
          <p className="mt-4 text-gray-300">Contáctanos para conocer disponibilidad y precios.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20Remanso%20de%20Oriente"
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

      {/* Mapa */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Ubicación</h2>
          <div className="rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=6.1787328,-75.3529425&z=15&output=embed"
              width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación Remanso de Oriente — Marinilla"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
