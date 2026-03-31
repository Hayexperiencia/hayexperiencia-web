import { notFound } from "next/navigation";
import { getProperty, getSimilarProperties } from "@/lib/wasi";
import { getEnrichedData, getMarketAverage } from "@/lib/db";
import { formatPrice, formatArea, getPropertyType, getPricePerM2, stripHtml, getWhatsAppLink, getPropertyWhatsAppMessage } from "@/lib/utils";
import PropertyGallery from "@/components/propiedades/PropertyGallery";
import PropertyKeyFacts from "@/components/propiedades/PropertyKeyFacts";
import SimilarProperties from "@/components/propiedades/SimilarProperties";
import ShareButtons from "@/components/propiedades/ShareButtons";
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
      images: property.images?.[0]?.url ? [property.images[0].url] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  const images = property.images || [];
  const isSale = property.for_sale === "true";
  const price = isSale ? formatPrice(property.sale_price) : formatPrice(property.rent_price);
  const priceM2 = isSale ? getPricePerM2(property.sale_price, property.area) : "";
  const type = getPropertyType(property.id_property_type);
  const description = property.observations ? stripHtml(property.observations) : "";

  // Enriched data (graceful fallback)
  const [enriched, marketAvg, similar] = await Promise.all([
    getEnrichedData(id),
    getMarketAverage(property.city_label, property.id_property_type),
    getSimilarProperties(property.id_property_type, property.id_city, property.id_property, 4),
  ]);

  const waMessage = getPropertyWhatsAppMessage(property.title || `${type} en ${property.city_label}`, property.id_property);
  const waLink = getWhatsAppLink(waMessage);
  const pageUrl = `https://hayexperiencia.com/propiedades/${id}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Gallery */}
      <PropertyGallery images={images} />

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
              <p className="text-[var(--color-text-light)] leading-relaxed whitespace-pre-line">{description}</p>
            </div>
          )}

          {/* Features */}
          {property.features && Object.keys(property.features).length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">Caracteristicas</h3>
              {Object.entries(property.features).map(([category, items]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-sm font-medium text-[var(--color-primary)] mb-2 capitalize">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {items.map((f) => (
                      <span key={f.id} className="px-3 py-1 rounded-full bg-gray-100 text-sm text-[var(--color-text-light)]">
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
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
          <ShareButtons title={`${type} en ${property.city_label} - ${price}`} url={pageUrl} />
        </div>

        {/* Sidebar - Contact */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-white">
              <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">Te interesa esta propiedad?</h3>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Escribir por WhatsApp
              </a>
              <a
                href="/contacto"
                className="mt-3 flex items-center justify-center w-full px-6 py-3 rounded-lg border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              >
                Solicitar informacion
              </a>
              <p className="mt-4 text-xs text-center text-[var(--color-text-light)]">
                Respuesta en menos de 24 horas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar properties */}
      <SimilarProperties properties={similar} />
    </div>
  );
}
