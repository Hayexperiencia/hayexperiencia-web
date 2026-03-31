import { WasiProperty } from "@/lib/types";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ properties }: { properties: WasiProperty[] }) {
  if (!properties.length) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-text-light)]">No se encontraron propiedades con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id_property} property={property} />
      ))}
    </div>
  );
}
