import { getProperties } from "@/lib/wasi";
import PropertyGrid from "@/components/propiedades/PropertyGrid";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ALUNA Campestre",
  description: "Lotes campestres en Marinilla, Oriente Antioqueno. Proyecto en sociedad con Arka11. Vive rodeado de naturaleza.",
};

export const revalidate = 3600;

export default async function AlunaPage() {
  // Fetch lots (property type 5 = Lote) in Marinilla
  const { properties } = await getProperties({
    id_property_type: 5,
    for_sale: true,
    take: 20,
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--color-primary)] py-20">
        <div className="mx-auto max-w-4xl text-center px-4">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-semibold mb-4">
            9 lotes disponibles
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">ALUNA Campestre</h1>
          <p className="mt-4 text-xl text-gray-300">Lotes campestres en Marinilla — Vive rodeado de naturaleza</p>
        </div>
      </section>

      {/* Descripcion */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Sobre el proyecto</h2>
          <p className="text-[var(--color-text-light)] leading-relaxed">
            ALUNA Campestre es un proyecto de 9 lotes campestres en Marinilla, Oriente Antioqueno,
            desarrollado en sociedad con Arka11 (Ludwig Zuluaga). Ubicado en una zona estrategica
            con facil acceso y rodeado de naturaleza, ALUNA ofrece la oportunidad de construir
            tu hogar en un entorno tranquilo y privilegiado.
          </p>
          <p className="mt-4 text-[var(--color-text-light)] leading-relaxed">
            Cada lote esta disenado para aprovechar al maximo el paisaje del Oriente Antioqueno,
            con vistas a las montanas y acceso a servicios publicos. La urbanizacion cuenta con
            vias internas y espacios comunes.
          </p>
        </div>
      </section>

      {/* Lotes disponibles */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8">Lotes disponibles</h2>
          <PropertyGrid properties={properties} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-[var(--color-primary)]">Te interesa ALUNA?</h2>
          <p className="mt-4 text-[var(--color-text-light)]">Hablemos sobre tu lote ideal.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20el%20proyecto%20ALUNA%20Campestre"
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
              Solicitar informacion
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
