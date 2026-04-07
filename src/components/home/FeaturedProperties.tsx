import { getFeaturedProperties } from "@/lib/wasi";
import PropertyGrid from "@/components/propiedades/PropertyGrid";
import Link from "next/link";

export default async function FeaturedProperties() {
  const properties = await getFeaturedProperties(6);

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-primary)]">Propiedades destacadas</h2>
            <p className="mt-2 text-[var(--color-text-light)]">Las más recientes del Oriente Antioqueño</p>
          </div>
          <Link
            href="/propiedades"
            className="hidden sm:inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)]"
          >
            Ver todas &rarr;
          </Link>
        </div>
        <PropertyGrid properties={properties} />
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/propiedades"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium"
          >
            Ver todas las propiedades
          </Link>
        </div>
      </div>
    </section>
  );
}
