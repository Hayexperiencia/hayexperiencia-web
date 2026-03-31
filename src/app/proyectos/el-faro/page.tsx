import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "El Faro",
  description: "Proyecto nautico en El Penol, embalse de Guatape. Foco de desarrollo 2026 de Hay Experiencia.",
};

export default function ElFaroPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--color-primary)] py-20">
        <div className="mx-auto max-w-4xl text-center px-4">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-semibold mb-4">
            Proximamente
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">El Faro</h1>
          <p className="mt-4 text-xl text-gray-300">Proyecto nautico en El Penol — Foco 2026</p>
        </div>
      </section>

      {/* Descripcion */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Sobre el proyecto</h2>
          <p className="text-[var(--color-text-light)] leading-relaxed">
            El Faro es nuestro proyecto de desarrollo nautico ubicado en El Penol,
            a orillas del embalse de Guatape — uno de los destinos turisticos mas importantes
            de Antioquia. Este proyecto representa el foco principal de desarrollo de
            Hay Experiencia para 2026.
          </p>
          <p className="mt-4 text-[var(--color-text-light)] leading-relaxed">
            Estamos en fase de estructuracion. Pronto compartiremos mas detalles sobre
            ubicacion exacta, planos, precios y opciones de inversion.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-[var(--color-primary)]">Quieres recibir informacion?</h2>
          <p className="mt-4 text-[var(--color-text-light)]">Dejanos tus datos y te avisamos cuando tengamos novedades.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20el%20proyecto%20El%20Faro%20en%20El%20Pe%C3%B1ol"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
            >
              WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-3.5 rounded-lg border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-colors"
            >
              Dejar mis datos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
