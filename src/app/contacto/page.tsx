import type { Metadata } from "next";
import ContactForm from "@/components/ui/ContactForm";
import { getPage, getSiteSettings } from "@/lib/strapi";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contacto");
  return {
    title: page?.seo?.metaTitle ?? "Contacto",
    description:
      page?.seo?.metaDescription ??
      "Contacta a Hay Experiencia Inmobiliaria. Marinilla, Antioquia. WhatsApp, teléfono, email y formulario.",
  };
}

function formatPhone(raw: string | null | undefined): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "").replace(/^57/, "");
  if (digits.length !== 10) return raw;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export default async function ContactoPage() {
  const settings = await getSiteSettings();
  const phone = settings?.contactPhone ?? "+573022343659";
  const phoneDisplay = formatPhone(phone);
  const whatsapp = settings?.whatsapp ?? "573022343659";
  const whatsappDisplay = formatPhone(whatsapp);
  const email = settings?.contactEmail ?? "gerencia@hayexperiencia.com";
  const cityLabel = settings?.address?.city
    ? `${settings.address.city}, ${settings.address.department ?? "Antioquia"}, ${settings.address.country ?? "Colombia"}`
    : "Marinilla, Antioquia, Colombia";

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--color-primary)] py-16">
        <div className="mx-auto max-w-4xl text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Contáctanos</h1>
          <p className="mt-4 text-xl text-gray-300">Estamos listos para ayudarte con tu próximo proyecto inmobiliario</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Envíanos un mensaje</h2>
              <ContactForm
                source="contacto-page"
                showMessage={true}
                className="p-6 rounded-2xl border border-[var(--color-border)]"
              />
            </div>

            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Datos de contacto</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-primary)]">Dirección</p>
                      <p className="text-sm text-[var(--color-text-light)]">{cityLabel}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-primary)]">Teléfono</p>
                      <a href={`tel:${phone}`} className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)]">{phoneDisplay}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="h-5 w-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-primary)]">WhatsApp</p>
                      <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)]">{whatsappDisplay}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-primary)]">Email</p>
                      <a href={`mailto:${email}`} className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)]">{email}</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horario */}
              <div className="p-6 rounded-2xl bg-gray-50">
                <h3 className="font-semibold text-[var(--color-primary)] mb-3">Horario de atención</h3>
                <div className="space-y-2 text-sm text-[var(--color-text-light)]">
                  <div className="flex justify-between">
                    <span>Lunes a Viernes</span>
                    <span className="font-medium text-[var(--color-primary)]">8:00 am - 6:00 pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado</span>
                    <span className="font-medium text-[var(--color-primary)]">9:00 am - 1:00 pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
