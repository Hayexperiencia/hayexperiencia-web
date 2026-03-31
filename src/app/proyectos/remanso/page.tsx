import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remanso de Oriente",
  description: "Proyecto residencial Remanso de Oriente. 60 de 66 unidades vendidas. Tranquilidad en el corazon del Oriente Antioqueno.",
};

export default function RemansoPage() {
  return (
    <div>
      <section className="bg-[var(--color-primary)] py-20">
        <div className="mx-auto max-w-4xl text-center px-4">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-semibold mb-4">
            60 de 66 unidades vendidas
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Remanso de Oriente</h1>
          <p className="mt-4 text-xl text-gray-300">Tranquilidad en el corazon del Oriente Antioqueno</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Sobre el proyecto</h2>
          <p className="text-[var(--color-text-light)] leading-relaxed">
            Remanso de Oriente es un proyecto residencial de 66 unidades ubicado en el Oriente Antioqueno,
            disenado para quienes buscan tranquilidad sin alejarse de la ciudad. Con 60 unidades ya vendidas,
            el proyecto demuestra la confianza del mercado en esta zona de alto crecimiento.
          </p>
          <p className="mt-4 text-[var(--color-text-light)] leading-relaxed">
            Hay Experiencia participa como comercializador de este proyecto. Si te interesa alguna de
            las unidades disponibles, contactanos para conocer opciones y precios actualizados.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl font-bold text-white">Quedan pocas unidades</h2>
          <p className="mt-4 text-gray-300">Contactanos para conocer disponibilidad y precios.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20Remanso%20de%20Oriente"
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
