import Image from "next/image";
import Link from "next/link";

const PROJECTS = [
  {
    name: "ALUNA Campestre",
    description: "Lotes campestres desde 2.500 m2 en Marinilla. Unidad cerrada con infraestructura de primer nivel.",
    href: "/proyectos/aluna",
    badge: "Desde $411M",
  },
  {
    name: "El Faro",
    description: "Condominio nautico en peninsula sobre la represa de Guatape. Suites, villas y sede nautica.",
    href: "/proyectos/el-faro",
    badge: "En desarrollo",
  },
  {
    name: "Aquaverde",
    description: "41 lotes campestres en Marinilla. Lago privado, senderos ecologicos y seguridad 24/7.",
    href: "/proyectos/aquaverde",
    badge: "Aliado",
  },
];

export default function ProjectsPreview() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-primary)]">Proyectos</h2>
            <p className="mt-2 text-[var(--color-text-light)]">Desarrollos inmobiliarios con vision integral</p>
          </div>
          <Link href="/proyectos" className="hidden sm:inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)]">
            Ver todos &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
