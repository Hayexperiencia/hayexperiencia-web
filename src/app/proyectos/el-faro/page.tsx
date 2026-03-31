import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "El Faro - Condominio Nautico",
  description: "Condominio Nautico El Faro en El Penol, Antioquia. Peninsula de 10 cuadras sobre la represa de Guatape. Suites, villas, sede nautica.",
};

const AMENIDADES = [
  "Sede nautica con muelles",
  "Senderos ecologicos",
  "Zona de reserva natural",
  "Porteria con vigilancia 24/7",
  "Vistas 360 de la represa",
  "1.5 km de perimetro costero",
];

const UNIDADES = [
  { tipo: "Suite Simplex", desc: "Apartamento en un nivel, ideal para parejas o inversion" },
  { tipo: "Suite Duplex", desc: "Apartamento en dos niveles, mayor espacio y privacidad" },
  { tipo: "Villa 2 niveles", desc: "Casa independiente sobre terreno de uso exclusivo" },
  { tipo: "Villa 3 niveles", desc: "Casa amplia con terraza y vistas panoramicas" },
  { tipo: "Villa en terreno plano", desc: "Casa con jardin privado y acceso directo" },
];

export default function ElFaroPage() {
  return (
    <div>
      {/* Hero with image */}
      <section className="relative bg-[var(--color-primary)] overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/proyectos/el-faro-hero.jpg" alt="El Faro - Peninsula sobre la represa de Guatape" fill className="object-cover opacity-30" priority />
        </div>
        <div className="relative mx-auto max-w-4xl text-center px-4 py-24">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-semibold mb-4">
            En desarrollo
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">El Faro</h1>
          <p className="mt-4 text-xl text-gray-300">Condominio Nautico en El Penol — Peninsula sobre la represa</p>
        </div>
      </section>

      {/* Descripcion */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Sobre el proyecto</h2>
          <p className="text-[var(--color-text-light)] leading-relaxed">
            Condominio Nautico El Faro esta ubicado en una peninsula privilegiada de 10 cuadras
            con 1.5 km de perimetro costero sobre la represa de Guatape, en El Penol, Antioquia.
            A solo 1 hora y 30 minutos de Medellin, ofrece vistas de 360 grados y acceso directo al agua.
          </p>
          <p className="mt-4 text-[var(--color-text-light)] leading-relaxed">
            El proyecto ya esta en dos terceras partes completado y combina lo mejor de la vida campestre
            con las comodidades de un condominio: sede nautica con muelles, senderos, zona de reserva natural
            y vigilancia permanente. Todo esto sin los costos de mantener una propiedad campestre individual.
          </p>
        </div>
      </section>

      {/* Tipos de unidad */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8">Tipos de unidades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {UNIDADES.map((u) => (
              <div key={u.tipo} className="p-6 rounded-2xl bg-white border border-[var(--color-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">{u.tipo}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-light)]">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenidades */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Amenidades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AMENIDADES.map((a) => (
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

      {/* CTA */}
      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-white">Quieres conocer El Faro?</h2>
          <p className="mt-4 text-gray-300">Agenda una visita a la peninsula y descubre el proyecto en persona.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20el%20proyecto%20El%20Faro%20en%20El%20Pe%C3%B1ol"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
            >
              WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors"
            >
              Solicitar informacion
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
