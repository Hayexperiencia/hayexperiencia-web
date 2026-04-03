import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ProjectGallery from "@/components/propiedades/ProjectGallery";
import AlunaCotizador from "@/components/proyectos/AlunaCotizador";

export const metadata: Metadata = {
  title: "ALUNA Campestre — Lotes en Marinilla",
  description: "Lotes campestres desde 2.500 m2 en Marinilla, Oriente Antioqueno. Proyecto Hay Experiencia + Arka11. Unidad cerrada, vias pavimentadas, entorno natural.",
  openGraph: {
    title: "ALUNA Campestre — Lotes campestres en Marinilla",
    description: "Tu espacio para crear la casa de tus suenos rodeado de naturaleza, a 45 min de Medellin.",
    images: ["/images/proyectos/aluna-hero.png"],
  },
};

const PROPUESTA_VALOR = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Ubicacion estrategica",
    desc: "A 45 minutos de Medellin, cerca de las vias a El Carmen de Viboral y Rionegro.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Alta valorizacion",
    desc: "El Oriente Antioqueno es la zona con mayor crecimiento inmobiliario de Colombia.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Infraestructura de primer nivel",
    desc: "Unidad cerrada con vias pavimentadas, redes subterraneas y porteria.",
  },
];

const CARACTERISTICAS = [
  "Lotes desde 2.500 m2",
  "Unidad cerrada",
  "Vias pavimentadas",
  "Redes subterraneas (acueducto, gas, alcantarillado, energia)",
  "Cerca de vias a El Carmen de Viboral y Rionegro",
  "45-50 minutos de Medellin",
];

export default function AlunaPage() {
  return (
    <div>
      {/* 1. HERO */}
      <section className="relative bg-[var(--color-primary)] overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <Image src="/images/proyectos/aluna-hero.png" alt="ALUNA Campestre" fill className="object-cover opacity-30" priority />
        </div>
        <div className="relative mx-auto max-w-4xl text-center px-4 py-24">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-bold mb-4">
            Preventa
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-white">ALUNA Campestre</h1>
          <p className="mt-4 text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto">
            Tu espacio para crear la casa de tus suenos, rodeado de naturaleza y tranquilidad
          </p>
          <a
            href="#cotizador"
            className="mt-8 inline-flex items-center px-8 py-4 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-bold text-lg hover:bg-[var(--color-accent-light)] transition-colors"
          >
            Ver cotizador
          </a>
        </div>
      </section>

      {/* 2. VIDEO */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="aspect-video rounded-2xl overflow-hidden bg-[var(--color-primary)] flex items-center justify-center">
            {/* Placeholder — reemplazar con video real cuando este disponible */}
            <div className="text-center text-white">
              <svg className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-400">Video del proyecto — proximamente</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TEXTO DE PRESENTACION + PROPUESTA DE VALOR */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Sobre el proyecto</h2>
          <p className="text-lg text-[var(--color-text-light)] leading-relaxed mb-4">
            ALUNA Campestre es un desarrollo exclusivo en Marinilla, Oriente Antioqueno, disenado para
            quienes buscan construir la casa de sus suenos en un entorno natural, seguro y con toda la
            infraestructura. Desarrollado en alianza con Arka11, el proyecto ofrece 9 lotes desde 2.500 m2
            en una unidad cerrada con vias pavimentadas y redes subterraneas.
          </p>
          <p className="text-lg text-[var(--color-text-light)] leading-relaxed">
            El nombre ALUNA proviene de la conexion con la tierra y el proposito de crear un espacio
            donde cuerpo, mente y espiritu encuentren equilibrio. A solo 45 minutos de Medellin, es la
            combinacion perfecta entre tranquilidad campestre y cercanias urbanas.
          </p>

          {/* Iconos propuesta de valor */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {PROPUESTA_VALOR.map((pv, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] mb-4">
                  {pv.icon}
                </div>
                <h3 className="font-bold text-[var(--color-primary)] mb-2">{pv.title}</h3>
                <p className="text-sm text-[var(--color-text-light)]">{pv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. GALERIA */}
      <ProjectGallery
        images={[
          { src: "/images/proyectos/aluna-hero.png", alt: "ALUNA Campestre - Vista panoramica" },
        ]}
        title="Galeria del proyecto"
      />

      {/* 5. HISTORIA Y VISION */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">El equipo detras de ALUNA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3">Hay Experiencia</h3>
              <p className="text-[var(--color-text-light)] leading-relaxed">
                Somos un holding inmobiliario del Oriente Antioqueno, con experiencia en
                estructuracion de proyectos, comercializacion y administracion de propiedades.
                ALUNA es nuestro proyecto insignia, donde ponemos toda nuestra vision del futuro
                de la vivienda campestre en la region.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3">Arka11</h3>
              <p className="text-[var(--color-text-light)] leading-relaxed">
                Arka11, liderado por Ludwig Zuluaga, es nuestro socio desarrollador. Con amplia
                trayectoria en proyectos inmobiliarios en el Oriente Antioqueno, aporta la experiencia
                tecnica y constructiva para que ALUNA sea una realidad con los mas altos estandares.
              </p>
            </div>
          </div>

          {/* Caracteristicas tecnicas */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4">Caracteristicas del proyecto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CARACTERISTICAS.map(c => (
                <div key={c} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                  <svg className="h-5 w-5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[var(--color-primary)]">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA INTERMEDIO */}
      <section className="py-12 bg-[var(--color-accent)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">Te interesa ALUNA?</h2>
          <p className="mt-2 text-[var(--color-primary)]/80">Hablemos. Sin compromiso, sin letra pequena.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20el%20proyecto%20ALUNA%20Campestre"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
            >
              Escribir por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 transition-colors"
            >
              Solicitar informacion
            </Link>
          </div>
        </div>
      </section>

      {/* 7. AVANCE DE OBRA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Avance de obra</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-gray-50 text-center">
              <div className="text-4xl font-bold text-[var(--color-accent)]">40%</div>
              <div className="text-sm text-[var(--color-text-light)] mt-1">Avance general</div>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 text-center">
              <div className="text-4xl font-bold text-[var(--color-primary)]">9</div>
              <div className="text-sm text-[var(--color-text-light)] mt-1">Lotes disponibles</div>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 text-center">
              <div className="text-sm font-semibold text-[var(--color-primary)]">Ultima actualizacion</div>
              <div className="text-sm text-[var(--color-text-light)] mt-1">Abril 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MAPA */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Ubicacion</h2>
          <div className="rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=6.1759,-75.3299&z=14&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicacion ALUNA Campestre - Marinilla"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">Marinilla</div>
              <div className="text-[var(--color-text-light)]">Ubicacion</div>
            </div>
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">45 min</div>
              <div className="text-[var(--color-text-light)]">Desde Medellin</div>
            </div>
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">15 min</div>
              <div className="text-[var(--color-text-light)]">Desde Rionegro</div>
            </div>
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">Aeropuerto JMC</div>
              <div className="text-[var(--color-text-light)]">20 min</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. COTIZADOR */}
      <AlunaCotizador />

      {/* Alianza */}
      <section className="py-8 bg-gray-50/50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm text-[var(--color-text-light)]">
            Proyecto desarrollado en alianza con{" "}
            <a href="https://arka11.co" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-primary)] hover:underline">
              Arka11
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
