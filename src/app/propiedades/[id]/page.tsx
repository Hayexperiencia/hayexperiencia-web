import { notFound } from "next/navigation";
import { getProperty, getSimilarProperties, getEnrichedDataForWasiId } from "@/lib/wasi";
import { formatPrice, formatArea, getPropertyType, getPricePerM2, getWhatsAppLink, getPropertyWhatsAppMessage, extractImages } from "@/lib/utils";
import Gallery from "@/components/ui/Gallery";
import PropertyKeyFacts from "@/components/propiedades/PropertyKeyFacts";
import SimilarProperties from "@/components/propiedades/SimilarProperties";
import ShareButtons from "@/components/propiedades/ShareButtons";
import PropertyContactSidebar from "@/components/propiedades/PropertyContactSidebar";
import EnrichmentSection from "@/components/propiedades/EnrichmentSection";
import OwnerCaptureBlock from "@/components/propiedades/OwnerCaptureBlock";
import PropertyFaq from "@/components/propiedades/PropertyFaq";
import ContactForm from "@/components/ui/ContactForm";
import PropertyViewTracker from "@/components/analytics/PropertyViewTracker";
import { marketHeroProof } from "@/lib/market";
import { buildPropertyFaqs, buildPropertyJsonLd } from "@/lib/property-jsonld";
import type { Metadata } from "next";

export const revalidate = 21600;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hayexperiencia.com";

type PageProps = { params: Promise<{ id: string }> };

function ubicacion(p: { zone_label?: string; city_label: string }): string {
  return p.zone_label ? `${p.zone_label}, ${p.city_label}` : p.city_label;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) return { title: "Propiedad no encontrada" };

  const isSale = property.for_sale === "true";
  const price = isSale ? property.sale_price_label : property.rent_price_label;
  const type = getPropertyType(property.id_property_type);
  const ubic = ubicacion(property);
  const url = `${SITE}/propiedades/${id}`;
  const title = `${type} en ${ubic} - ${price}`;
  const specs = [
    formatArea(property.area),
    property.bedrooms ? `${property.bedrooms} hab` : "",
    property.bathrooms ? `${property.bathrooms} baños` : "",
  ].filter(Boolean).join(", ");
  const description = `${type} en ${isSale ? "venta" : "arriendo"} en ${ubic}, Oriente Antioqueño. ${specs}. Precio comparado con el mercado real por Hay Experiencia.`;
  const images = property.main_image?.url_big ? [property.main_image.url_big] : [];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  const images = extractImages(property);
  const isSale = property.for_sale === "true";
  const price = isSale ? formatPrice(property.sale_price) : formatPrice(property.rent_price);
  const priceM2 = isSale ? getPricePerM2(property.sale_price, property.area) : "";
  const type = getPropertyType(property.id_property_type);
  const ubic = ubicacion(property);
  const description = property.observations ? property.observations : "";

  // Enriched data (graceful fallback)
  const [enriched, similar] = await Promise.all([
    getEnrichedDataForWasiId(id),
    getSimilarProperties(property.id_property_type, property.id_city, property.id_property, 4),
  ]);

  const propertyTitle = property.title || `${type} en ${property.city_label}`;
  const waMessage = getPropertyWhatsAppMessage(propertyTitle, property.id_property);
  const waLink = getWhatsAppLink(waMessage);
  const waOwnerLink = getWhatsAppLink(
    `Hola, tengo una propiedad en ${property.city_label || "el Oriente Antioqueño"} y quiero saber cómo se posiciona en el mercado para venderla con Hay Experiencia.`,
  );

  const heroProof = marketHeroProof(enriched);
  const faqs = buildPropertyFaqs(property, enriched, type);
  const jsonLd = buildPropertyJsonLd({
    property,
    enriched,
    faqs,
    images: images.map((img) => img.url),
    typeLabel: type,
    url: `${SITE}/propiedades/${id}`,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
      {/* JSON-LD: RealEstateListing + Offer + residencia + BreadcrumbList + FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PropertyViewTracker wasiId={id} />

      {/* Gallery */}
      <Gallery
        images={images.map((img) => ({ url: img.url, alt: img.description || undefined }))}
        videoUrl={property.video || undefined}
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero info: H1 SEO + precio + specs + prueba de mercado + CTA primario */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isSale ? "bg-[var(--color-sale)] text-white" : "bg-[var(--color-rent)] text-white"}`}>
                {isSale ? "Venta" : "Arriendo"}
              </span>
              <span className="text-sm text-[var(--color-text-light)]">Ref: {property.id_property}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
              {type} en {ubic}
            </h1>
            <div className="mt-2 flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)]">{price}</span>
              {!isSale && <span className="text-[var(--color-text-light)]">/mes</span>}
              {priceM2 && <span className="text-sm text-[var(--color-text-light)]">· {priceM2}</span>}
            </div>

            {/* Chip de prueba de mercado above-the-fold (solo si es publicable) */}
            {heroProof && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1.5 text-sm font-medium text-green-700">
                <span aria-hidden>✓</span>
                {heroProof}
              </div>
            )}

            {/* CTA primario — visible sin depender del sidebar (mobile-first) */}
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Hablar con un asesor por WhatsApp
              </a>
            </div>
          </div>

          {/* Posición de mercado — subida al tercio superior (el diferenciador) */}
          {enriched && <EnrichmentSection enriched={enriched} />}

          {/* Descripción */}
          {description && (
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">¿Qué ofrece esta propiedad?</h3>
              <div className="text-[var(--color-text-light)] leading-relaxed prose" dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          )}

          {/* Detalle de specs */}
          <PropertyKeyFacts property={property} />

          {/* Features */}
          {property.features && (
            (property.features.internal?.length || 0) > 0 ||
            (property.features.external?.length || 0) > 0
          ) && (
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Características</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.features.internal && property.features.internal.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-3 uppercase tracking-wider">Internas</h4>
                    <div className="space-y-2">
                      {property.features.internal.map((f) => (
                        <div key={f.id} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          <span className="text-sm text-[var(--color-text-light)]">{f.nombre || f.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {property.features.external && property.features.external.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-3 uppercase tracking-wider">Externas</h4>
                    <div className="space-y-2">
                      {property.features.external.map((f) => (
                        <div key={f.id} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          <span className="text-sm text-[var(--color-text-light)]">{f.nombre || f.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Map */}
          {property.latitude && property.longitude && parseFloat(property.latitude) !== 0 && (
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">¿Dónde queda?</h3>
              <div className="rounded-2xl overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de la propiedad"
                />
              </div>
            </div>
          )}

          {/* CTA secundario: cotizador */}
          {isSale && (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-gray-50 p-5">
              <div>
                <p className="font-semibold text-[var(--color-primary)]">¿Quieres simular tu plan de pago?</p>
                <p className="text-sm text-[var(--color-text-light)]">Calcula cuota inicial y financiación en un minuto.</p>
              </div>
              <a href="/cotizador" className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 font-medium text-white transition hover:opacity-90">
                Abrir cotizador
              </a>
            </div>
          )}

          {/* Captación de propietarios */}
          <OwnerCaptureBlock ciudad={property.city_label} waLink={waOwnerLink} />

          {/* FAQ (texto = FAQPage schema) */}
          <PropertyFaq faqs={faqs} />

          {/* Share */}
          <ShareButtons title={`${type} en ${property.city_label} - ${price}`} propertyId={property.id_property} />
        </div>

        {/* Sidebar - Contact */}
        <div className="lg:col-span-1">
          <PropertyContactSidebar
            price={price}
            priceLabel={isSale ? "Venta" : "Arriendo/mes"}
            waLink={waLink}
            propertyId={property.id_property}
            propertyTitle={propertyTitle}
          />
          <div className="mt-6">
            <ContactForm
              source={`propiedad-${property.id_property}`}
              compact={true}
              title="¿Te interesa esta propiedad?"
              showMessage={false}
              className="p-6 rounded-2xl border border-[var(--color-border)] bg-white"
            />
          </div>
        </div>
      </div>

      {/* Similar properties */}
      <SimilarProperties properties={similar} />
      {/* La barra CTA sticky (mobile) la renderiza PropertyContactSidebar */}
    </div>
  );
}
