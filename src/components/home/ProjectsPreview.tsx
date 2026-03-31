import Image from "next/image";
import Link from "next/link";

const PROJECTS = [
  {
    name: "ALUNA Campestre",
    description: "Lotes campestres en Marinilla. Vive rodeado de naturaleza con la comodidad que mereces.",
    href: "/proyectos/aluna",
    badge: "9 lotes disponibles",
  },
  {
    name: "El Faro",
    description: "Proyecto nautico en El Penol, embalse de Guatape. El foco de desarrollo para 2026.",
    href: "/proyectos/el-faro",
    badge: "Proximamente",
  },
];

export default function ProjectsPreview() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-2">Proyectos</h2>
        <p className="text-[var(--color-text-light)] mb-8">Desarrollos inmobiliarios con vision integral</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <Link
              key={project.name}
              href={project.href}
              className="group relative rounded-2xl overflow-hidden bg-[var(--color-primary)] p-8 flex flex-col justify-end min-h-[280px] hover:shadow-xl transition-shadow duration-200"
            >
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[var(--color-accent)] text-xs font-semibold text-[var(--color-primary)]">
                {project.badge}
              </span>
              <h3 className="text-2xl font-bold text-white">{project.name}</h3>
              <p className="mt-2 text-gray-300 text-sm">{project.description}</p>
              <span className="mt-4 text-[var(--color-accent)] text-sm font-medium group-hover:underline">
                Conocer mas &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
