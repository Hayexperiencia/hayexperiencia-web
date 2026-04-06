import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Proyectos inmobiliarios de Hay Experiencia en el Oriente Antioqueno: ALUNA Campestre, El Faro, Remanso de Oriente, Aquaverde.",
};

const PROYECTOS = [
  {
    name: "ALUNA Campestre",
    location: "Marinilla, Antioquia",
    description: "Lotes campestres desde 2.500 m2 en Marinilla. Unidad cerrada con vias pavimentadas, redes subterraneas y entorno natural privilegiado.",
    href: "/proyectos/aluna",
    badge: "En venta",
    highlights: ["9 lotes", "Desde 2.500 m2", "Desde $411M"],
    image: "/images/proyectos/aluna-hero.png",
  },
  {
    name: "El Faro",
    location: "El Penol, Antioquia",
    description: "Condominio nautico en peninsula de 10 cuadras sobre la represa de Guatape. Suites, villas, sede nautica con muelles, senderos y reserva natural.",
    href: "/proyectos/el-faro",
    badge: "En desarrollo",
    highlights: ["Peninsula", "Suites y Villas", "Sede nautica"],
    image: "/images/proyectos/el-faro-hero.jpg",
  },
  {
    name: "Remanso de Oriente",
    location: "Oriente Antioqueno",
    description: "Proyecto residencial en el corazon del Oriente Antioqueno. Disenado para quienes buscan tranquilidad sin alejarse de la ciudad.",
    href: "/proyectos/remanso",
    badge: "Ultimas unidades",
    highlights: ["60/66 unidades", "Oriente Antioqueno"],
    image: "/images/hero-oriente.jpg",
  },
  {
    name: "Aquaverde",
    location: "Marinilla, Antioquia",
    description: "Condominio campestre exclusivo con 41 lotes entre 1.500 y 1.900 m2. Lago privado, senderos ecologicos y seguridad 24/7.",
    href: "/proyectos/aquaverde",
    badge: "Entrega Dic 2026",
    highlights: ["41 lotes", "Lago privado", "1.500-1.900 m2"],
    image: "/images/proyectos/aquaverde-hero.webp",
  },
];

export default function ProyectosPage() {
  return (
    <div>
      <section className="bg-[var(--color-primary)] py-20">
        <div className="mx-auto max-w-4xl text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Proyectos</h1>
          <p className="mt-4 text-xl text-gray-300">Desarrollos inmobiliarios con vision integral en el Oriente Antioqueno</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          {PROYECTOS.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              className="group block rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative aspect-[3/1] overflow-hidden">
                <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[var(--color-accent)] text-xs font-semibold text-[var(--color-primary)]">
                    {p.badge}
                  </span>
                  <span className="text-sm text-[var(--color-text-light)]">{p.location}</span>
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-primary)] group-hover:text-[var(--color-primary-light)] transition-colors">{p.name}</h2>
                <p className="mt-2 text-[var(--color-text-light)] max-w-2xl">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.highlights.map((h) => (
                    <span key={h} className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-[var(--color-primary)]">{h}</span>
                  ))}
                </div>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-[var(--color-primary)] group-hover:text-[var(--color-primary-light)]">
                  Ver proyecto &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Arka11 partner section */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Alianzas estrategicas</h2>
          <p className="text-[var(--color-text-light)]">
            Trabajamos en alianza con las mejores constructoras del pais en el Oriente Antioqueno,
            garantizando calidad y respaldo para tu inversion.
          </p>
          <a
            href="https://arka11.co"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)]"
          >
            Conocer Arka11 &rarr;
          </a>
        </div>
      </section>
    </div>
  );
}
