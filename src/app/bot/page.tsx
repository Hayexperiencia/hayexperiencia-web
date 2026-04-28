import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HayExperienciaBot — Política y contacto",
  description:
    "Información pública sobre HayExperienciaBot, el agente de investigación de mercado de Hay Experiencia SAS. Propósito, alcance, contacto y cómo bloquearlo.",
  robots: { index: true, follow: true },
};

const PRINCIPIOS = [
  {
    titulo: "Investigación privada de mercado",
    desc: "Recolectamos datos públicos de inmuebles en venta del Oriente Antioqueño para análisis interno de pricing y asesoría a colegas inmobiliarios. No es un producto público.",
  },
  {
    titulo: "Sin republicación",
    desc: "Los datos recolectados nunca se publican en hayexperiencia.com ni en ningún producto público. No competimos con tu inventario, no construimos un buscador alternativo, no monetizamos los datos.",
  },
  {
    titulo: "Sin datos personales",
    desc: "No capturamos nombres, teléfonos, correos ni cualquier información del agente o del propietario. Solo datos del inmueble (precio, área, ubicación, fotos, características).",
  },
  {
    titulo: "Respeto operativo",
    desc: "Delays mínimos de 2 a 5 segundos entre solicitudes. Carga insignificante para tu sitio. No realizamos scraping agresivo, no hacemos login, no intentamos bypass de paywalls ni de protecciones anti-bot.",
  },
  {
    titulo: "Identificación clara",
    desc: "Todas nuestras solicitudes incluyen el User-Agent HayExperienciaBot/1.0 con enlace a esta página. Trazabilidad total.",
  },
];

export default function BotPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-xs font-semibold mb-4">
            Documento público
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold">HayExperienciaBot</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            Agente de investigación de mercado de Hay Experiencia SAS. Esta página explica qué hace,
            qué no hace, cómo nos comportamos y cómo nos puedes bloquear si lo prefieres.
          </p>
        </div>
      </section>

      {/* Identificación técnica */}
      <section className="py-16 bg-[var(--color-background)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">Cómo nos identificamos</h2>
          <p className="mt-2 text-[var(--color-text-light)]">
            Cada solicitud HTTP que hace nuestro bot incluye este User-Agent:
          </p>
          <pre className="mt-4 p-4 rounded-xl bg-gray-900 text-gray-100 text-sm overflow-x-auto">
{`HayExperienciaBot/1.0 (+https://hayexperiencia.com/bot)`}
          </pre>
          <p className="mt-3 text-sm text-[var(--color-text-light)]">
            Si ves ese User-Agent en tus logs, somos nosotros. El enlace lleva justo a esta página.
          </p>
        </div>
      </section>

      {/* Principios operativos */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">Cómo operamos</h2>
          <p className="mt-2 text-[var(--color-text-light)]">
            Cinco principios que guían toda nuestra recolección de datos.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PRINCIPIOS.map((p, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-[var(--color-border)] hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">{p.titulo}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-light)]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo bloquear */}
      <section className="py-16 bg-[var(--color-background)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">Cómo bloquearnos</h2>
          <p className="mt-2 text-[var(--color-text-light)]">
            Si prefieres que no accedamos a tu sitio, hay tres caminos. Cualquiera funciona.
          </p>

          <div className="mt-8 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-primary)]">1. robots.txt</h3>
              <p className="mt-2 text-sm text-[var(--color-text-light)]">
                Agrega estas líneas al archivo <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">robots.txt</code> de tu sitio:
              </p>
              <pre className="mt-3 p-4 rounded-xl bg-gray-900 text-gray-100 text-sm overflow-x-auto">
{`User-agent: HayExperienciaBot
Disallow: /`}
              </pre>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-primary)]">2. Bloqueo por User-Agent en tu servidor</h3>
              <p className="mt-2 text-sm text-[var(--color-text-light)]">
                Configura tu servidor (nginx, Apache, Cloudflare, etc.) para devolver 403 cuando el User-Agent contiene
                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded mx-1">HayExperienciaBot</code>.
                En Cloudflare: Security &rarr; WAF &rarr; Custom rules &rarr; Block.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-primary)]">3. Solicitud directa por correo</h3>
              <p className="mt-2 text-sm text-[var(--color-text-light)]">
                Escríbenos a la dirección de contacto más abajo. Removemos tu dominio de nuestra lista de fuentes en menos
                de 24 horas hábiles, sin preguntas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 bg-[var(--color-primary)] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Contacto</h2>
          <p className="mt-4 text-gray-200 max-w-2xl mx-auto">
            ¿Preguntas, dudas, solicitudes de exclusión o sugerencias? Estamos disponibles.
          </p>
          <div className="mt-8 inline-flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:bot@hayexperiencia.co"
              className="px-6 py-3 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:opacity-90 transition-opacity"
            >
              bot@hayexperiencia.co
            </a>
            <Link
              href="/contacto"
              className="px-6 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Formulario general
            </Link>
          </div>
          <p className="mt-8 text-xs text-gray-300">
            Hay Experiencia SAS &middot; Marinilla, Antioquia, Colombia
          </p>
        </div>
      </section>
    </div>
  );
}
