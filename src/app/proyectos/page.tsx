import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Proyectos inmobiliarios de Hay Experiencia: ALUNA Campestre en Marinilla, El Faro nautico en El Penol.",
};

const PROYECTOS = [
  {
    name: "ALUNA Campestre",
    description: "Lotes campestres en Marinilla, Oriente Antioqueno. Proyecto en sociedad con Arka11. 9 lotes disenados para aprovechar el paisaje y la tranquilidad de la zona.",
    href: "/proyectos/aluna",
    badge: "9 lotes disponibles",
    status: "En venta",
  },
  {
    name: "El Faro",
    description: "Proyecto nautico en El Penol, embalse de Guatape. Uno de los destinos turisticos mas importantes de Antioquia. Foco de desarrollo para 2026.",
    href: "/proyectos/el-faro",
    badge: "Proximamente",
    status: "En estructuracion",
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
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          {PROYECTOS.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              className="group block rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-8 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-[var(--color-accent)] text-xs font-semibold text-[var(--color-primary)]">
                      {p.badge}
                    </span>
                    <span className="text-xs text-[var(--color-text-light)]">{p.status}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-primary)] group-hover:text-[var(--color-primary-light)]">{p.name}</h2>
                  <p className="mt-2 text-[var(--color-text-light)]">{p.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] group-hover:text-[var(--color-primary-light)]">
                    Ver proyecto &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
