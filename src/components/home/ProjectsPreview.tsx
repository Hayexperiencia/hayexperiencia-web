"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";

const PROJECTS = [
  {
    name: "ALUNA Campestre",
    description: "Lotes campestres desde 2.500 m2 en Marinilla. Unidad cerrada con infraestructura de primer nivel.",
    href: "/proyectos/aluna",
    badge: "Desde $411M",
    image: "/images/proyectos/aluna-hero.png",
  },
  {
    name: "El Faro",
    description: "Condominio nautico en peninsula sobre la represa de Guatape. Suites, villas y sede nautica.",
    href: "/proyectos/el-faro",
    badge: "En desarrollo",
    image: "/images/proyectos/el-faro-hero.jpg",
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
    image: "/images/proyectos/aquaverde-hero.webp",
  },
];

export default function ProjectsPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
      setActiveIndex(index);
    }
  }, []);

  // Auto-rotate every 5s
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % PROJECTS.length;
        scrollToIndex(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, scrollToIndex]);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[var(--color-primary)]">Proyectos</h2>
          <p className="mt-2 text-[var(--color-text-light)]">Desarrollos inmobiliarios con vision integral</p>
        </div>

        <div
          ref={scrollRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: "none" }}
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

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeIndex ? "bg-[var(--color-primary)] w-6" : "bg-gray-300 hover:bg-gray-400"}`}
              aria-label={`Ir a proyecto ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
