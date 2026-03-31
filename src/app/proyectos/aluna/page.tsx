import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ProjectGallery from "@/components/propiedades/ProjectGallery";

export const metadata: Metadata = {
  title: "ALUNA Campestre",
  description: "Lotes campestres desde 2.500 m2 en Marinilla. Proyecto Hay Experiencia + Arka11. Unidad cerrada, vias pavimentadas, entorno natural.",
};

const CARACTERISTICAS = [
  "Lotes desde 2.500 m2",
  "Unidad cerrada",
  "Vias pavimentadas",
  "Redes subterraneas (acueducto, gas, alcantarillado, energia)",
  "Cerca de vias a El Carmen de Viboral y Rionegro",
  "45-50 minutos de Medellin",
];

export default function AlunaPage() {

  return (
    <div>
      {/* Hero with image */}
      <section className="relative bg-[var(--color-primary)] overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/proyectos/aluna-hero.png" alt="ALUNA Campestre - Lotes en Marinilla" fill className="object-cover opacity-30" priority />
        </div>
        <div className="relative mx-auto max-w-4xl text-center px-4 py-24">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-semibold mb-4">
            En venta — Desde $411.000.000
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">ALUNA Campestre</h1>
          <p className="mt-4 text-xl text-gray-300">Lotes campestres en Marinilla — Tu espacio para crear la casa de tus suenos</p>
        </div>
      </section>

      {/* Descripcion */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Sobre el proyecto</h2>
          <p className="text-[var(--color-text-light)] leading-relaxed">
            ALUNA Campestre es un espacio exclusivo en Marinilla, Oriente Antioqueno, disenado para
            quienes quieren construir la casa de sus suenos rodeados de naturaleza y tranquilidad.
            Desarrollado en alianza con Arka11, el proyecto ofrece lotes desde 2.500 m2 en una
            unidad cerrada con infraestructura de primer nivel.
          </p>
          <p className="mt-4 text-[var(--color-text-light)] leading-relaxed">
            Ubicado a solo 45-50 minutos de Medellin, con acceso cercano a las principales vias
            hacia El Carmen de Viboral y Rionegro. ALUNA no es solo un lote: es un proyecto para
            tu cuerpo, mente y espiritu.
          </p>
        </div>
      </section>

      {/* Caracteristicas */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Caracteristicas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CARACTERISTICAS.map((c) => (
              <div key={c} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[var(--color-border)]">
                <svg className="h-5 w-5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-[var(--color-primary)]">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectGallery
        images={[
          { src: "/images/proyectos/aluna-hero.png", alt: "ALUNA Campestre - Vista panoramica de los lotes" },
        ]}
      />

      {/* Alianza */}
      <section className="py-12 bg-gray-50/50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm text-[var(--color-text-light)]">
            Proyecto desarrollado en alianza con <a href="https://arka11.co" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-primary)] hover:underline">Arka11</a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-white">Te interesa ALUNA?</h2>
          <p className="mt-4 text-gray-300">Agenda una visita y conoce tu futuro lote en persona.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20el%20proyecto%20ALUNA%20Campestre%20en%20Marinilla"
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
              Solicitar informacion
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
