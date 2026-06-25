// Bloque de CAPTACIÓN de propietarios. Convierte al dueño que llega a mirar comparables:
// "así vendemos; valoramos tu propiedad con datos reales". Es el segundo público del
// objetivo (que la gente quiera VENDER con Hay Experiencia), no solo el comprador.
export default function OwnerCaptureBlock({ ciudad, waLink }: { ciudad: string; waLink: string }) {
  const zona = ciudad || "el Oriente Antioqueño";
  return (
    <section className="rounded-2xl bg-[var(--color-primary)] p-6 text-white sm:p-8">
      <h3 className="text-xl font-bold sm:text-2xl">¿Tienes una propiedad en {zona} para vender?</h3>
      <p className="mt-3 leading-relaxed text-white/85">
        Así la presentamos y la vendemos: con datos reales de mercado, no con adjetivos. Si tienes
        una propiedad en {zona} o el Oriente Antioqueño, te decimos en menos de 24 horas cómo se
        posiciona frente al mercado y a qué precio se vende.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-white/90">
        <li className="flex items-start gap-2">
          <span aria-hidden className="mt-0.5 text-[var(--color-accent)]">✓</span>
          Estimación referencial de mercado con comparables reales del Oriente Antioqueño
        </li>
        <li className="flex items-start gap-2">
          <span aria-hidden className="mt-0.5 text-[var(--color-accent)]">✓</span>
          Presentación profesional de tu propiedad, como esta página
        </li>
        <li className="flex items-start gap-2">
          <span aria-hidden className="mt-0.5 text-[var(--color-accent)]">✓</span>
          Acompañamiento legal, negociación y escrituración
        </li>
      </ul>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
      >
        Valorar mi propiedad por WhatsApp
      </a>
    </section>
  );
}
