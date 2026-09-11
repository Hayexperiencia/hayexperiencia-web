import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

// Página de bienvenida personal para Andrew (/zoe).
// Estática, sin Strapi, fuera del índice de buscadores: es una pieza de cortesía,
// no contenido comercial del sitio.
export const metadata: Metadata = {
  title: "Bienvenido, Andrew",
  description:
    "Una bienvenida de Hay Experiencia para Andrew: el Oriente Antioqueño, nuestras propiedades y nuestros proyectos.",
  robots: { index: false, follow: false },
};

const CIFRAS = [
  { valor: "10+", etiqueta: "Municipios del Oriente Antioqueño" },
  { valor: "5", etiqueta: "Unidades de negocio" },
  { valor: "Marinilla", etiqueta: "Sede principal, Antioquia" },
];

const PUERTAS = [
  {
    numero: "01",
    titulo: "Propiedades",
    texto: "Lotes, casas, apartamentos y fincas en venta y en arriendo.",
    href: "/propiedades",
    cta: "Ver propiedades",
  },
  {
    numero: "02",
    titulo: "Proyectos",
    texto: "ALUNA Campestre, El Faro, Remanso de Oriente y Aquaverde.",
    href: "/proyectos",
    cta: "Ver proyectos",
  },
  {
    numero: "03",
    titulo: "Nosotros",
    texto: "Quiénes somos, cómo trabajamos y quién te acompaña.",
    href: "/nosotros",
    cta: "Conocer el equipo",
  },
];

function Overline({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.18em] ${
        light ? "text-white/60" : "text-[var(--color-text-light)]"
      }`}
    >
      {children}
    </p>
  );
}

export default function ZoePage() {
  return (
    <div>
      {/* Hero: saludo en escala display y foto real del Oriente con sangrado a la derecha */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-end pt-14 pb-12 lg:pt-24 lg:pb-20">
            <div className="lg:col-span-7 zoe-in">
              <Overline>Hay Experiencia · Oriente Antioqueño</Overline>
              <h1 className="mt-6 text-[clamp(3.25rem,11vw,9rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[var(--color-primary)]">
                Hola,
                <br />
                <span className="zoe-hl">
                  <span>Andrew</span>
                </span>
                .
              </h1>
              <p className="mt-8 max-w-md text-lg font-medium leading-relaxed text-[var(--color-text-light)]">
                Qué bueno tenerte aquí. Esta página la hicimos para darte la bienvenida a Hay
                Experiencia y al Oriente Antioqueño.
              </p>
            </div>

            <div className="lg:col-span-5 zoe-in zoe-in-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] lg:aspect-[4/5] lg:rounded-r-none lg:-mr-8 xl:-mr-[max(2rem,calc((100vw-80rem)/2+2rem))]">
                <Image
                  src="/images/hero-oriente.jpg"
                  alt="Paisaje del Oriente Antioqueño"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
              <p className="mt-3 text-xs font-normal text-[var(--color-text-light)]">
                Oriente Antioqueño · Antioquia, Colombia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bienvenida: dos tonos (Navy + blanco), cifras publicadas en el sitio, isotipo como protagonista */}
      <section className="relative overflow-hidden bg-[var(--color-primary)] text-white">
        <Image
          src="/logos/isotipo-invertido.svg"
          alt=""
          aria-hidden
          width={640}
          height={640}
          className="pointer-events-none absolute -bottom-40 -right-24 hidden h-[34rem] w-[34rem] opacity-[0.08] lg:block"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <Overline light>Bienvenido</Overline>
              <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.02em]">
                Tu sueño, nuestra experiencia.
              </h2>
              <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-white/75">
                Somos una inmobiliaria con sede en Marinilla, Antioquia. Acompañamos a personas y
                familias a comprar, vender, arrendar o invertir en el Oriente Antioqueño. Nos alegra
                que hoy estés aquí.
              </p>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-8 lg:col-span-5 lg:border-l lg:border-white/15 lg:pl-12">
              {CIFRAS.map((c) => (
                <div key={c.etiqueta} className="flex flex-col-reverse">
                  <dt className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-white/60">{c.etiqueta}</dt>
                  <dd className="text-5xl font-bold leading-none tracking-[-0.02em] lg:text-6xl">{c.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Por dónde empezar: tres puertas al sitio */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Overline>Por dónde empezar</Overline>
          <h2 className="mt-4 text-[clamp(1.75rem,2vw+1rem,2.5rem)] font-bold leading-[1.25] text-[var(--color-primary)]">
            Tres puertas abiertas.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {PUERTAS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group flex flex-col rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-[0_1px_2px_0_rgba(17,13,63,0.05)] transition-shadow duration-200 hover:shadow-[0_4px_12px_0_rgba(17,13,63,0.10)] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(17,13,63,0.20)]"
              >
                <span className="text-xs font-semibold tracking-[0.18em] text-[var(--color-text-light)]">{p.numero}</span>
                <h3 className="mt-6 text-2xl font-semibold text-[var(--color-primary)]">{p.titulo}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--color-text-light)]">{p.texto}</p>
                <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)]">
                  {p.cta}
                  <svg
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre: puerta abierta, sin remate de venta */}
      <section className="border-t border-[var(--color-border)] bg-[#FAFAF7]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="max-w-3xl text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-snug text-[var(--color-primary)]">
                Andrew, esta es tu casa en el Oriente Antioqueño. Cuando quieras, hablamos.
              </p>
              <p className="mt-6 text-sm font-semibold text-[var(--color-primary)]">
                Gabriel Ramírez · CEO, Hay Experiencia
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--color-text-light)]">
                302 234 3659 · gerencia@hayexperiencia.com · Marinilla, Antioquia
              </p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <Link
                href="/contacto"
                className="inline-flex items-center rounded-2xl bg-[var(--color-primary)] px-7 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-primary-light)] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(17,13,63,0.20)]"
              >
                Hablar con un asesor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
