import Image from "next/image";
import Link from "next/link";
import { WasiProperty } from "@/lib/types";
import { formatPrice, formatArea, getPropertyType, extractImages } from "@/lib/utils";

export default function PropertyCard({ property }: { property: WasiProperty }) {
  const price = property.for_sale === "true"
    ? formatPrice(property.sale_price)
    : formatPrice(property.rent_price);
  const badge = property.for_sale === "true" ? "Venta" : "Arriendo";
  const badgeColor = property.for_sale === "true"
    ? "bg-[var(--color-sale)] text-white"
    : "bg-[var(--color-rent)] text-white";
  const imgs = extractImages(property);
  const imageUrl = imgs[0]?.url || "/logos/isotipo.svg";
  const hasImage = imgs.length > 0;

  return (
    <Link
      href={`/propiedades/${property.id_property}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-[var(--color-border)] hover:shadow-lg transition-all duration-200"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {hasImage ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <Image src="/logos/isotipo.svg" alt="" width={48} height={48} className="opacity-20" />
          </div>
        )}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
          {badge}
        </span>

        {/* Hover overlay with quick info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="flex items-center gap-3 text-white text-xs">
            {property.area && parseFloat(property.area) > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                {formatArea(property.area)}
              </span>
            )}
            {property.bedrooms && parseInt(property.bedrooms) > 0 && (
              <span>{property.bedrooms} hab.</span>
            )}
            {property.bathrooms && parseInt(property.bathrooms) > 0 && (
              <span>{property.bathrooms} baños</span>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-lg font-bold text-[var(--color-primary)]">{price}</p>
        {property.for_rent === "true" && <span className="text-xs text-[var(--color-text-light)]">/mes</span>}
        <h3 className="mt-1 text-sm font-medium text-[var(--color-primary)] line-clamp-1">
          {getPropertyType(property.id_property_type)} en {property.city_label}
        </h3>
        {property.zone_label && (
          <p className="text-xs text-[var(--color-text-light)]">{property.zone_label}</p>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs text-[var(--color-text-light)]">
          {property.area && parseFloat(property.area) > 0 && (
            <span>{formatArea(property.area)}</span>
          )}
          {property.bedrooms && parseInt(property.bedrooms) > 0 && (
            <span>{property.bedrooms} hab.</span>
          )}
          {property.bathrooms && parseInt(property.bathrooms) > 0 && (
            <span>{property.bathrooms} baños</span>
          )}
          {property.garages && parseInt(property.garages) > 0 && (
            <span>{property.garages} parq.</span>
          )}
        </div>
        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
          <span className="text-sm font-medium text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors flex items-center justify-between">
            Ver propiedad
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
