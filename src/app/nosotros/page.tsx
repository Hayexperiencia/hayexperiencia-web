import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Hay Experiencia SAS: un holding inmobiliario con vision integral en el Oriente Antioqueno. Conoce nuestro equipo y unidades de negocio.",
};

const UNIDADES = [
  { name: "Estructuracion de proyectos", desc: "Joint ventures y desarrollo inmobiliario. Alianzas estrategicas para crear proyectos con vision." },
  { name: "Marketing y publicidad", desc: "Contenido, redes sociales y posicionamiento de marca. Estrategias que conectan propiedades con personas." },
  { name: "Comercializacion y corretaje", desc: "Compra, venta y arriendo de propiedades. Nuestro core: te acompanamos en cada paso del proceso." },
  { name: "Administracion de propiedades", desc: "Gestion integral de inmuebles. Sendero del Rio: 4.000m2, 24+ locales comerciales." },
  { name: "Consultoria y tecnologia", desc: "CapioLab: soluciones CRM y tecnologicas para el sector inmobiliario." },
];

const EQUIPO = [
  { name: "Gabriel Ramirez", role: "CEO y Fundador" },
  { name: "Yoko Giraldo", role: "Socia - Arriendos" },
  { name: "Cesar Delgado", role: "Ventas" },
  { name: "Laura Hoyos", role: "Contabilidad y Finanzas" },
  { name: "Yesica Vergara", role: "Contenido y CRM" },
];

export default function NosotrosPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--color-primary)] py-20">
        <div className="mx-auto max-w-4xl text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Hay Experiencia</h1>
          <p className="mt-4 text-xl text-gray-300">Un holding inmobiliario con vision integral</p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Nuestra historia</h2>
          <p className="text-[var(--color-text-light)] leading-relaxed">
            Hay Experiencia nacio en Marinilla, Antioquia, de la mano de Gabriel Ramirez y Yoko Giraldo.
            Lo que comenzo como una pasion por el sector inmobiliario se convirtio en un holding con cinco
            unidades de negocio que cubren todo el ciclo inmobiliario: desde la estructuracion de proyectos
            hasta la administracion de propiedades, pasando por la comercializacion, el marketing y la tecnologia.
          </p>
          <p className="mt-4 text-[var(--color-text-light)] leading-relaxed">
            Operamos en el Oriente Antioqueno — Marinilla, Rionegro, La Ceja, El Penol, Guatape,
            El Retiro, El Carmen de Viboral y San Vicente Ferrer — una de las regiones con mayor
            dinamismo inmobiliario de Colombia. Hacemos que cada sueno cobre vida con la cercania
            de quien entiende lo que significa, y la solidez de quien sabe como lograrlo.
          </p>
        </div>
      </section>

      {/* Unidades de negocio */}
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8">Unidades de negocio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {UNIDADES.map((u, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-[var(--color-border)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">{u.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-light)]">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8">Nuestro equipo</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {EQUIPO.map((e) => (
              <div key={e.name} className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-[var(--color-primary)]">
                  {e.name[0]}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[var(--color-primary)]">{e.name}</h3>
                <p className="text-xs text-[var(--color-text-light)]">{e.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-white">Quieres trabajar con nosotros?</h2>
          <p className="mt-4 text-gray-300">Estamos siempre buscando aliados y oportunidades.</p>
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
