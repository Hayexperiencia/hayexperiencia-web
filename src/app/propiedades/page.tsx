import { Suspense } from "react";
import Link from "next/link";
import { getProperties } from "@/lib/wasi";
import { PROPERTY_TYPES } from "@/lib/types";
import PropertyGrid from "@/components/propiedades/PropertyGrid";
import PropertyFilters from "@/components/propiedades/PropertyFilters";
import CampaignBanner from "@/components/home/CampaignBanner";
import ContactForm from "@/components/ui/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades",
  description:
    "Encuentra lotes, casas, apartamentos, fincas y locales en el Oriente Antioqueno. Marinilla, Rionegro, La Ceja, El Penol, Guatape.",
};

export const revalidate = 3600;

const ITEMS_PER_PAGE = 21;

async function PropertiesContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const transaccion = params.transaccion || "venta";
  const tipo = params.tipo ? parseInt(params.tipo) : undefined;
  const ciudad = params.ciudad ? parseInt(params.ciudad) : undefined;
  const hab = params.hab ? parseInt(params.hab) : undefined;
  const banos = params.banos ? parseInt(params.banos) : undefined;
  const parqueadero = params.parqueadero ? parseInt(params.parqueadero) : undefined;
  const estrato = params.estrato ? parseInt(params.estrato) : undefined;
  const precioMin = params.precio_min ? parseInt(params.precio_min) : undefined;
  const precioMax = params.precio_max ? parseInt(params.precio_max) : undefined;
  const areaMin = params.area_min ? parseInt(params.area_min) : undefined;
  const areaMax = params.area_max ? parseInt(params.area_max) : undefined;
  const page = params.page ? parseInt(params.page) : 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const { total, properties } = await getProperties({
    for_sale: transaccion === "venta",
    for_rent: transaccion === "arriendo",
    id_property_type: tipo,
    id_city: ciudad,
    bedrooms: hab,
    bathrooms: banos,
    garages: parqueadero,
    stratum: estrato,
    min_price: precioMin,
    max_price: precioMax,
    min_area: areaMin,
    max_area: areaMax,
    skip,
    take: ITEMS_PER_PAGE,
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Build base URL for pagination
  const baseParams = new URLSearchParams();
  if (transaccion !== "venta") baseParams.set("transaccion", transaccion);
  if (tipo) baseParams.set("tipo", String(tipo));
  if (ciudad) baseParams.set("ciudad", String(ciudad));
  if (hab) baseParams.set("hab", String(hab));
  if (banos) baseParams.set("banos", String(banos));
  if (parqueadero) baseParams.set("parqueadero", String(parqueadero));
  if (estrato) baseParams.set("estrato", String(estrato));
  if (precioMin) baseParams.set("precio_min", String(precioMin));
  if (precioMax) baseParams.set("precio_max", String(precioMax));
  if (areaMin) baseParams.set("area_min", String(areaMin));
  if (areaMax) baseParams.set("area_max", String(areaMax));

  const buildPageUrl = (p: number) => {
    const ps = new URLSearchParams(baseParams);
    if (p > 1) ps.set("page", String(p));
    const qs = ps.toString();
    return `/propiedades${qs ? `?${qs}` : ""}`;
  };

  // Breadcrumb parts
  const crumbs: { label: string; href?: string }[] = [
    { label: "Inicio", href: "/" },
    { label: "Propiedades", href: totalPages > 0 ? undefined : "/propiedades" },
  ];
  if (transaccion === "arriendo") crumbs.push({ label: "Arriendo" });
  else crumbs.push({ label: "Venta" });
  if (tipo && PROPERTY_TYPES[tipo]) crumbs.push({ label: PROPERTY_TYPES[tipo] });

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-[var(--color-text-light)] mb-6">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {c.href ? (
              <Link href={c.href} className="hover:text-[var(--color-primary)]">{c.label}</Link>
            ) : (
              <span className="text-[var(--color-primary)] font-medium">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      <PropertyGrid properties={properties} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={buildPageUrl(page - 1)}
              className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-primary)] hover:bg-gray-50"
            >
              &larr; Anterior
            </Link>
          )}
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let p: number;
            if (totalPages <= 7) {
              p = i + 1;
            } else if (page <= 4) {
              p = i + 1;
            } else if (page >= totalPages - 3) {
              p = totalPages - 6 + i;
            } else {
              p = page - 3 + i;
            }
            return (
              <Link
                key={p}
                href={buildPageUrl(p)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-gray-50"
                }`}
              >
                {p}
              </Link>
            );
          })}
          {page < totalPages && (
            <Link
              href={buildPageUrl(page + 1)}
              className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-primary)] hover:bg-gray-50"
            >
              Siguiente &rarr;
            </Link>
          )}
        </div>
      )}

      <p className="mt-4 text-center text-sm text-[var(--color-text-light)]">
        {total} propiedades encontradas
        {totalPages > 1 && ` — Pagina ${page} de ${totalPages}`}
      </p>
    </>
  );
}

export default function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return (
    <>
    <CampaignBanner
      title="Encuentra tu propiedad ideal"
      subtitle="Lotes, casas, apartamentos y fincas en el Oriente Antioqueno"
      cta="Buscar ahora"
      ctaHref="#filtros"
    />
    <div id="filtros" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">Propiedades</h1>
      <p className="text-[var(--color-text-light)] mb-6">
        Encuentra tu proximo hogar o inversion en el Oriente Antioqueno
      </p>
      <Suspense fallback={<div className="h-10" />}>
        <PropertyFilters />
      </Suspense>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[4/3]" />
            ))}
          </div>
        }
      >
        <PropertiesContent searchParams={searchParams} />
      </Suspense>
    </div>

    {/* Banner final */}
    <section className="py-16 bg-[var(--color-primary)]">
      <div className="mx-auto max-w-4xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">No encontraste lo que buscabas?</h2>
          <p className="mt-4 text-gray-300 text-lg">
            Tenemos acceso a propiedades exclusivas que no estan en el sitio. Dejanos tus datos y te ayudamos.
          </p>
          <a
            href="https://wa.me/573022343659?text=Hola%2C%20busco%20una%20propiedad%20especifica"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
          >
            Escribir por WhatsApp
          </a>
        </div>
        <ContactForm
          source="propiedades-bottom"
          showMessage={false}
          compact={false}
          className="bg-white rounded-2xl p-8"
        />
      </div>
    </section>
    </>
  );
}
