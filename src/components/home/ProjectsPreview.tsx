"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const PROJECTS = [
  {
    name: "ALUNA Campestre",
    description: "Lotes campestres desde 2.500 m2 en Marinilla. Unidad cerrada con infraestructura de primer nivel.",
    href: "/proyectos/aluna",
    badge: "Desde $411M",
    // TODO: Gabriel confirmar imagen principal de cada proyecto
    image: "/images/hero-oriente.jpg",
  },
  {
    name: "El Faro",
    description: "Condominio nautico en peninsula sobre la represa de Guatape. Suites, villas y sede nautica.",
    href: "/proyectos/el-faro",
    badge: "En desarrollo",
    image: "/images/hero-oriente.jpg",
  },
  {
    name: "Remanso de Oriente",
    description: "Proyecto residencial en Marinilla. Terminando la 1ra etapa, ultimas unidades disponibles.",
    href: "/proyectos/remanso",
    badge: "Ultimas unidades",
    image: "/images/hero-oriente.jpg",
  },
  {
    name: "Aquaverde",
    description: "41 lotes campestres en Marinilla. Lago privado, senderos ecologicos y seguridad 24/7.",
    href: "/proyectos/aquaverde",
    badge: "Entrega Dic 2026",
    image: "/images/hero-oriente.jpg",
  },
];

export default function ProjectsPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => { checkScroll(); }, []);

  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("a")?.offsetWidth || 400;
    el.scrollBy({ left: dir * (cardWidth + 24), behavior: "smooth" });
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-primary)]">Proyectos</h2>
            <p className="mt-2 text-[var(--color-text-light)]">Desarrollos inmobiliarios con vision integral</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll(-1)} disabled={!canScrollLeft} className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full border border-[var(--color-border)] hover:bg-gray-50 disabled:opacity-30 transition-all" aria-label="Anterior">
              <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll(1)} disabled={!canScrollRight} className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full border border-[var(--color-border)] hover:bg-gray-50 disabled:opacity-30 transition-all" aria-label="Siguiente">
              <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <Link href="/proyectos" className="hidden sm:inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)]">
              Ver todos &rarr;
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
        >
          {PROJECTS.map((project) => (
            <Link
              key={project.name}
              href={project.href}
              className="group relative flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-2xl overflow-hidden snap-start"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110d3f]/80 via-[#110d3f]/20 to-transparent" />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[var(--color-accent)] text-xs font-semibold text-[var(--color-primary)]">
                  {project.badge}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                  <p className="mt-2 text-gray-200 text-sm line-clamp-2">{project.description}</p>
                  <span className="mt-3 inline-flex items-center text-[var(--color-accent)] text-sm font-medium group-hover:underline">
                    Ver proyecto &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
