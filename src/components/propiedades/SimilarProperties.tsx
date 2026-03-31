import { WasiProperty } from "@/lib/types";
import PropertyCard from "./PropertyCard";

export default function SimilarProperties({ properties }: { properties: WasiProperty[] }) {
  if (!properties.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Propiedades similares</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((p) => (
          <PropertyCard key={p.id_property} property={p} />
        ))}
      </div>
    </section>
  );
}
