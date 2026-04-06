import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Hay Experiencia SAS: holding inmobiliario con 5 unidades de negocio en el Oriente Antioqueno. Estructuracion, marketing, comercializacion, administracion y tecnologia.",
};

const UNIDADES = [
  {
    name: "Estructuracion de proyectos",
    desc: "Joint ventures y desarrollo inmobiliario. Alianzas estrategicas con socios como Arka11 para crear proyectos con vision a largo plazo.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    name: "Marketing y publicidad",
    desc: "Contenido, redes sociales y posicionamiento de marca. Estrategias que conectan propiedades con las personas indicadas.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    name: "Comercializacion y corretaje",
    desc: "Nuestro core. Compra, venta y arriendo de propiedades en todo el Oriente Antioqueno. Te acompanamos en cada paso.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Administracion de propiedades",
    desc: "Gestion integral de inmuebles comerciales y residenciales. Sendero del Rio: centro comercial de 4.000 m2 con 24+ locales.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    name: "Consultoria y Tecnologia con AI",
    desc: "CapioLab: plataforma CRM con inteligencia artificial y soluciones tecnologicas para inmobiliarias. Automatizacion, datos y herramientas digitales.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const EQUIPO = [
  { name: "Gabriel Ramirez", role: "CEO y Fundador", desc: "Visionario del holding. Lidera la estrategia y las alianzas." },
  { name: "Yoko Giraldo", role: "Socia — Arriendos", desc: "Gestiona arriendos y la relacion directa con propietarios e inquilinos." },
  { name: "Cesar Delgado", role: "Ventas", desc: "Asesor comercial. Acompana a los clientes desde la primera visita hasta el cierre." },
  { name: "Laura Hoyos", role: "Contabilidad y Finanzas", desc: "Administracion financiera, contabilidad y reportes." },
  { name: "Yesica Vergara", role: "Contenido y CRM", desc: "Produccion de video, contenido digital e implementacion de CapioLab." },
];

const VALORES = [
  { name: "Transparencia", desc: "Sin letra pequena. Informacion clara en cada paso del proceso." },
  { name: "Pasion", desc: "Cada sueno nos importa. Tu proyecto es nuestro proyecto." },
  { name: "Tecnologia", desc: "Herramientas digitales que facilitan tu experiencia." },
  { name: "Empatia", desc: "Entendemos lo que significa este momento para ti y tu familia." },
];

const ZONAS = [
  "Marinilla", "Rionegro", "La Ceja", "El Penol", "Guatape",
  "El Retiro", "El Carmen de Viboral", "San Vicente Ferrer", "Guarne", "Santuario",
];

export default function NosotrosPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[var(--color-primary)] overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-oriente.jpg" alt="Oriente Antioqueno" fill className="object-cover opacity-20" priority />
        </div>
        <div className="relative mx-auto max-w-4xl text-center px-4 py-24">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Hay Experiencia</h1>
          <p className="mt-4 text-xl text-gray-300">Un holding inmobiliario con vision integral</p>
          <p className="mt-2 text-gray-400">Marinilla, Antioquia — Oriente Antioqueno</p>
        </div>
      </section>

      {/* Mision */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-2xl font-medium text-[var(--color-primary)] leading-relaxed italic">
            &ldquo;Hacemos que cada sueno cobre vida. Acompanamos a las personas en el camino de comprar,
            vender, emprender o invertir — con la cercania de quien entiende lo que significa cada sueno,
            y la solidez de quien sabe como lograrlo.&rdquo;
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Nuestra historia</h2>
          <p className="text-[var(--color-text-light)] leading-relaxed">
            Hay Experiencia nacio en Marinilla, Antioquia, de la mano de Gabriel Ramirez y Yoko Giraldo.
            Lo que comenzo como una pasion por el sector inmobiliario se convirtio en un holding con cinco
            unidades de negocio que cubren todo el ciclo: desde la estructuracion de proyectos
            hasta la administracion de propiedades, pasando por la comercializacion, el marketing y la tecnologia.
          </p>
          <p className="mt-4 text-[var(--color-text-light)] leading-relaxed">
            Hoy operamos en mas de 10 municipios del Oriente Antioqueno, una de las regiones con mayor
            dinamismo inmobiliario de Colombia. Trabajamos con aliados como Arka11 en el desarrollo de
            proyectos campestres, y con CapioLab llevamos tecnologia CRM al sector inmobiliario.
          </p>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">Nuestro equipo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EQUIPO.map((e) => (
              <div key={e.name} className="p-6 rounded-2xl border border-[var(--color-border)] text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-primary)] flex items-center justify-center text-xl font-bold text-white mb-3">
                  {e.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h3 className="text-base font-semibold text-[var(--color-primary)]">{e.name}</h3>
                <p className="text-sm text-[var(--color-accent)] font-medium">{e.role}</p>
                <p className="mt-2 text-xs text-[var(--color-text-light)]">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unidades de negocio */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">5 unidades de negocio</h2>
            <p className="mt-2 text-[var(--color-text-light)]">Cubrimos todo el ciclo inmobiliario</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {UNIDADES.map((u, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-[var(--color-border)] hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-primary)] mb-4">
                  {u.icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">{u.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-light)]">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CapioLab destacado */}
      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-xs font-semibold mb-4">
                Unidad de tecnologia
              </span>
              <h2 className="text-3xl font-bold text-white">CapioLab</h2>
              <p className="mt-4 text-gray-300 leading-relaxed">
                Nuestra plataforma de consultoria y tecnologia con inteligencia artificial para el sector
                inmobiliario. Implementamos soluciones CRM con GoHighLevel, automatizamos procesos de venta
                y marketing con AI, y ayudamos a otras inmobiliarias a escalar con herramientas digitales.
              </p>
              <a
                href="https://capiolab.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center text-[var(--color-accent)] font-medium hover:underline"
              >
                Conocer CapioLab &rarr;
              </a>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-40 h-40 rounded-3xl bg-white/10 flex items-center justify-center">
                <svg className="h-16 w-16 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">Nuestros valores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALORES.map((v) => (
              <div key={v.name} className="text-center p-6">
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">{v.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-light)]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zona de cobertura */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Donde operamos</h2>
          <p className="text-[var(--color-text-light)] mb-6 leading-relaxed">
            Operamos en el Oriente Antioqueno con nuestra inmobiliaria,
            atendiendo Marinilla, El Penol, Guatape, Rionegro y toda la region.
            A traves de CapioLab, nuestra unidad de tecnologia, desarrollamos
            proyectos de transformacion digital con AI para empresas en toda Latinoamerica.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {ZONAS.map((z) => (
              <span key={z} className="px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-[var(--color-primary)]">{z}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-white">Quieres trabajar con nosotros?</h2>
          <p className="mt-4 text-gray-300">Estamos siempre buscando aliados y oportunidades en el Oriente Antioqueno.</p>
          <Link
            href="/contacto"
            className="mt-8 inline-flex items-center px-8 py-3.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors"
          >
            Contactanos
          </Link>
        </div>
      </section>
    </div>
  );
}
