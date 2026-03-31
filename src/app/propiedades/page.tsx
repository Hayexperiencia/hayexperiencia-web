import { Suspense } from "react";
import { getProperties } from "@/lib/wasi";
import PropertyGrid from "@/components/propiedades/PropertyGrid";
import PropertyFilters from "@/components/propiedades/PropertyFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades",
  description:
    "Encuentra lotes, casas, apartamentos, fincas y locales en el Oriente Antioqueno. Marinilla, Rionegro, La Ceja, El Penol, Guatape.",
};

export const revalidate = 3600;

async function PropertiesContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const transaccion = params.transaccion || "venta";
  const tipo = params.tipo ? parseInt(params.tipo) : undefined;
  const skip = params.skip ? parseInt(params.skip) : 0;

  const { total, properties } = await getProperties({
    for_sale: transaccion === "venta",
    for_rent: transaccion === "arriendo",
    id_property_type: tipo,
    skip,
    take: 21,
  });

  return (
    <>
      <PropertyGrid properties={properties} />
      {total > skip + 21 && (
        <div className="mt-8 text-center">
          <a
            href={`/propiedades?transaccion=${transaccion}${tipo ? `&tipo=${tipo}` : ""}&skip=${skip + 21}`}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-light)] transition-colors"
          >
            Cargar mas propiedades
          </a>
        </div>
      )}
      <p className="mt-4 text-center text-sm text-[var(--color-text-light)]">
        {total} propiedades encontradas
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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
  );
}
