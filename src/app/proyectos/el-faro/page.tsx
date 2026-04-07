import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ProjectGallery from "@/components/propiedades/ProjectGallery";

export const metadata: Metadata = {
  title: "El Faro — Condominio Náutico en El Peñol",
  description: "Condominio Náutico El Faro en El Peñol, Antioquia. Península de 10 cuadras sobre la represa de Guatapé. Suites, villas, sede náutica.",
  openGraph: {
    title: "El Faro — Condominio Náutico sobre la represa de Guatapé",
    description: "Península exclusiva con 1.5 km de costa, sede náutica y vistas 360 de la represa.",
    images: ["/images/proyectos/el-faro-hero.jpg"],
  },
};

const AMENIDADES = [
  "Sede náutica con muelles",
  "Senderos ecológicos",
  "Zona de reserva natural",
  "Portería con vigilancia 24/7",
  "Vistas 360 de la represa",
  "1.5 km de perímetro costero",
];

const UNIDADES = [
  { tipo: "Suite Simplex", desc: "Apartamento en un nivel, ideal para parejas o inversión", desde: "" },
  { tipo: "Suite Duplex", desc: "Apartamento en dos niveles, mayor espacio y privacidad", desde: "" },
  { tipo: "Villa 2 niveles", desc: "Casa independiente sobre terreno de uso exclusivo", desde: "" },
  { tipo: "Villa 3 niveles", desc: "Casa amplia con terraza y vistas panorámicas", desde: "" },
  { tipo: "Villa en terreno plano", desc: "Casa con jardín privado y acceso directo", desde: "" },
];

const PROPUESTA_VALOR = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: "Península exclusiva",
    desc: "10 cuadras rodeadas de agua, con 1.5 km de costa sobre la represa de Guatapé.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 2h8l-1 4H9L8 2z" />
      </svg>
    ),
    title: "Acceso náutico directo",
    desc: "Sede náutica con muelles propios. Sal al agua desde tu condominio.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Inversión con retorno",
    desc: "Arrienda tu unidad cuando no la uses. La represa de Guatapé es destino turístico todo el año.",
  },
];

export default function ElFaroPage() {
  return (
    <div>
      {/* 1. HERO */}
      <section className="relative bg-[var(--color-primary)] overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <Image src="/images/proyectos/el-faro-hero.jpg" alt="El Faro - Península sobre la represa" fill className="object-cover opacity-65" priority />
        </div>
        <div className="relative mx-auto max-w-4xl text-center px-4 py-24">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-bold mb-4">
            En desarrollo
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-white">El Faro</h1>
          <p className="mt-4 text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto">
            Condominio Náutico en El Peñol — Península sobre la represa de Guatapé
          </p>
          <a
            href="https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20el%20proyecto%20El%20Faro"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center px-8 py-4 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-bold text-lg hover:bg-[var(--color-accent-light)] transition-colors"
          >
            Solicitar información
          </a>
        </div>
      </section>

      {/* 2. VIDEO */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="aspect-video rounded-2xl overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/iJzwlJbupcs"
              title="El Faro — Condominio Náutico"
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* 3. TEXTO + PROPUESTA DE VALOR */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Sobre el proyecto</h2>
          <p className="text-lg text-[var(--color-text-light)] leading-relaxed mb-4">
            Condominio Náutico El Faro se levanta en una península privilegiada de 10 cuadras con
            1.5 km de perímetro costero sobre la represa de Guatapé, en El Peñol, Antioquia.
            A solo 1 hora y 30 minutos de Medellín, ofrece vistas de 360 grados y acceso directo al agua.
          </p>
          <p className="text-lg text-[var(--color-text-light)] leading-relaxed">
            El proyecto ya está en dos terceras partes completado y combina lo mejor de la vida campestre
            con las comodidades de un condominio moderno: sede náutica con muelles, senderos ecológicos,
            zona de reserva natural y vigilancia permanente. Todo sin los costos de mantener una
            propiedad campestre individual.
          </p>

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
          { src: "/images/proyectos/el-faro-drone-hd.jpg", alt: "Vista aérea de la península El Faro" },
          { src: "/images/proyectos/el-faro-villas.jpg", alt: "Villas El Faro" },
          { src: "/images/proyectos/el-faro-villa-1.jpg", alt: "Villa a nivel" },
          { src: "/images/proyectos/el-faro-villa-2.jpg", alt: "Villa 3 pisos" },
          { src: "/images/proyectos/el-faro-simplex.jpg", alt: "Suite Simplex" },
          { src: "/images/proyectos/el-faro-duplex.jpg", alt: "Suite Duplex" },
        ]}
      />

      {/* 5. TIPOS DE UNIDADES */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-8">Tipos de unidades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {UNIDADES.map(u => (
              <div key={u.tipo} className="p-6 rounded-2xl bg-white border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors">
                <h3 className="text-lg font-bold text-[var(--color-primary)]">{u.tipo}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-light)]">{u.desc}</p>
                {u.desde && (
                  <p className="mt-3 text-lg font-bold text-[var(--color-accent)]">Desde {u.desde}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA INTERMEDIO */}
      <section className="py-12 bg-[var(--color-accent)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">¿Quieres conocer El Faro?</h2>
          <p className="mt-2 text-[var(--color-primary)]/80">Agenda una visita a la península y descubre el proyecto en persona.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20el%20proyecto%20El%20Faro%20en%20El%20Pe%C3%B1ol"
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
              Solicitar información
            </Link>
          </div>
        </div>
      </section>

      {/* 7. ESTADO ACTUAL DEL PROYECTO */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Estado Actual del Proyecto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              "60% del proyecto terminado y habitado",
              "Obras generales listas",
              "Pago hasta en 15 meses",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-[var(--color-primary)]">{item}</span>
              </div>
            ))}
          </div>

          {/* Amenidades */}
          <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4">Amenidades</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AMENIDADES.map(a => (
              <div key={a} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                <svg className="h-5 w-5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-[var(--color-primary)]">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. MAPA */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Ubicación</h2>
          <div className="rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=6.2406364,-75.2014938&z=15&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación El Faro — El Peñol"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">El Peñol</div>
              <div className="text-[var(--color-text-light)]">Ubicación</div>
            </div>
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">1h 30min</div>
              <div className="text-[var(--color-text-light)]">Desde Medellín</div>
            </div>
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">Represa Guatapé</div>
              <div className="text-[var(--color-text-light)]">Sobre el agua</div>
            </div>
            <div className="p-3 rounded-xl bg-white text-center">
              <div className="font-semibold text-[var(--color-primary)]">10 cuadras</div>
              <div className="text-[var(--color-text-light)]">Península</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-white">El Faro te espera</h2>
          <p className="mt-4 text-gray-300">La península sobre la represa de Guatapé. Tu próximo destino, tu próxima inversión.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/573022343659?text=Hola%2C%20quiero%20conocer%20el%20proyecto%20El%20Faro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
            >
              Escribir por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-3.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors"
            >
              Solicitar información
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
