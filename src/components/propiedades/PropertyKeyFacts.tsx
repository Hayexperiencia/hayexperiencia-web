import { WasiProperty } from "@/lib/types";
import { formatArea } from "@/lib/utils";

interface Fact {
  label: string;
  value: string;
}

export default function PropertyKeyFacts({ property }: { property: WasiProperty }) {
  const facts: Fact[] = [];

  if (property.area && parseFloat(property.area) > 0) {
    facts.push({ label: "Área total", value: formatArea(property.area) });
  }
  if (property.built_area && parseFloat(property.built_area) > 0) {
    facts.push({ label: "Área construida", value: formatArea(property.built_area) });
  }
  if (property.bedrooms && parseInt(property.bedrooms) > 0) {
    facts.push({ label: "Habitaciones", value: property.bedrooms });
  }
  if (property.bathrooms && parseInt(property.bathrooms) > 0) {
    facts.push({ label: "Baños", value: property.bathrooms });
  }
  if (property.garages && parseInt(property.garages) > 0) {
    facts.push({ label: "Parqueaderos", value: property.garages });
  }
  if (property.stratum && parseInt(property.stratum) > 0) {
    facts.push({ label: "Estrato", value: property.stratum });
  }

  if (!facts.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {facts.map((fact) => (
        <div key={fact.label} className="text-center p-4 rounded-xl bg-gray-50">
          <p className="text-2xl font-bold text-[var(--color-primary)]">{fact.value}</p>
          <p className="text-xs text-[var(--color-text-light)] mt-1">{fact.label}</p>
        </div>
      ))}
    </div>
  );
}
