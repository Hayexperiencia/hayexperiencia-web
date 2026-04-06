import { notFound } from "next/navigation";
import { getProperty, getSimilarProperties } from "@/lib/wasi";
import { getEnrichedData, getMarketAverage } from "@/lib/db";
import { formatPrice, formatArea, getPropertyType, getPricePerM2, stripHtml, getWhatsAppLink, getPropertyWhatsAppMessage, extractImages } from "@/lib/utils";
import Gallery from "@/components/ui/Gallery";
import PropertyKeyFacts from "@/components/propiedades/PropertyKeyFacts";
import SimilarProperties from "@/components/propiedades/SimilarProperties";
import ShareButtons from "@/components/propiedades/ShareButtons";
import PropertyContactSidebar from "@/components/propiedades/PropertyContactSidebar";
import ContactForm from "@/components/ui/ContactForm";
import type { Metadata } from "next";

export const revalidate = 21600;

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) return { title: "Propiedad no encontrada" };

  const price = property.for_sale === "true" ? property.sale_price_label : property.rent_price_label;
  const type = getPropertyType(property.id_property_type);

  return {
    title: `${type} en ${property.city_label} - ${price}`,
    description: `${type} de ${formatArea(property.area)} en ${property.city_label}, ${property.zone_label || "Oriente Antioqueno"}. ${property.bedrooms} habitaciones, ${property.bathrooms} banos.`,
    openGraph: {
      title: `${type} ${formatArea(property.area)} en ${property.city_label} - ${price}`,
      description: `${type} en ${property.city_label}. ${property.bedrooms} hab, ${property.bathrooms} banos.`,
      images: property.main_image?.url_big ? [property.main_image.url_big] : [],
    },
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
  const description = property.observations ? property.observations : "";

  // Enriched data (graceful fallback)
  const [enriched, marketAvg, similar] = await Promise.all([
    getEnrichedData(id),
    getMarketAverage(property.city_label, property.id_property_type),
    getSimilarProperties(property.id_property_type, property.id_city, property.id_property, 4),
  ]);

  const waMessage = getPropertyWhatsAppMessage(property.title || `${type} en ${property.city_label}`, property.id_property);
  const waLink = getWhatsAppLink(waMessage);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Gallery */}
      <Gallery
        images={images.map((img) => ({ url: img.url, alt: img.description || undefined }))}
        videoUrl={property.video || undefined}
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isSale ? "bg-[var(--color-sale)] text-white" : "bg-[var(--color-rent)] text-white"}`}>
                {isSale ? "Venta" : "Arriendo"}
              </span>
              <span className="text-sm text-[var(--color-text-light)]">Ref: {property.id_property}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)]">{price}</h1>
            {!isSale && <span className="text-[var(--color-text-light)]">/mes</span>}
            {priceM2 && <p className="text-sm text-[var(--color-text-light)] mt-1">{priceM2}</p>}
            <h2 className="mt-2 text-xl text-[var(--color-primary)]">
              {type} en {property.city_label}
            </h2>
            {property.zone_label && (
              <p className="text-[var(--color-text-light)]">{property.zone_label}{property.address ? ` - ${property.address}` : ""}</p>
            )}
          </div>

          {/* Key facts */}
          <PropertyKeyFacts property={property} />

          {/* Description */}
          {description && (
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">Descripcion</h3>
              <div className="text-[var(--color-text-light)] leading-relaxed prose" dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          )}

          {/* Features */}
          {property.features && (
            (property.features.internal?.length || 0) > 0 ||
            (property.features.external?.length || 0) > 0
          ) && (
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Caracteristicas</h3>
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

          {/* Market comparison (enriched - only shows if data exists) */}
          {marketAvg && enriched?.price_vs_avg_pct !== null && enriched?.price_vs_avg_pct !== undefined && (
            <div className="p-6 rounded-2xl bg-gray-50">
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">Comparativo de mercado</h3>
              <p className="text-sm text-[var(--color-text-light)]">
                Precio/m2 promedio en {property.city_label}: {formatPrice(marketAvg.avg_price_m2)}/m2
              </p>
              <p className={`mt-2 text-lg font-semibold ${enriched.price_vs_avg_pct < 0 ? "text-green-600" : "text-red-500"}`}>
                {enriched.price_vs_avg_pct < 0 ? `${Math.abs(enriched.price_vs_avg_pct)}% bajo el promedio` : `${enriched.price_vs_avg_pct}% sobre el promedio`}
              </p>
            </div>
          )}

          {/* Map */}
          {property.latitude && property.longitude && parseFloat(property.latitude) !== 0 && (
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">Ubicacion</h3>
              <div className="rounded-2xl overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicacion de la propiedad"
                />
              </div>
            </div>
          )}

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
            propertyTitle={property.title || `${type} en ${property.city_label}`}
          />
          <div className="mt-6">
            <ContactForm
              source={`propiedad-${property.id_property}`}
              compact={true}
              title="Te interesa esta propiedad?"
              showMessage={false}
              className="p-6 rounded-2xl border border-[var(--color-border)] bg-white"
            />
          </div>
        </div>
      </div>

      {/* Similar properties */}
      <SimilarProperties properties={similar} />
    </div>
  );
}
