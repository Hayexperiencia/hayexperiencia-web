import type { Faq } from "@/lib/property-jsonld";

// FAQ visible. El texto coincide 1:1 con el FAQPage del JSON-LD (regla dura de schema:
// nada solo-en-schema). <details> nativo: el contenido está en el DOM para crawlers/LLMs.
export default function PropertyFaq({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby="faq-title" className="border-t border-gray-200 pt-8">
      <h3 id="faq-title" className="text-xl font-semibold text-[var(--color-primary)] mb-4">
        Preguntas frecuentes
      </h3>
      <div className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)]">
        {faqs.map((f, i) => (
          <details key={i} className="group p-4 open:bg-gray-50/60">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-[var(--color-primary)]">
              {f.q}
              <span className="ml-3 shrink-0 text-xl text-[var(--color-text-light)] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-light)]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
