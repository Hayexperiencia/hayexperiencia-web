"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PROPERTY_TYPES } from "@/lib/types";

const CITIES: Record<string, string> = {
  "488": "Marinilla",
  "685": "Rionegro",
  "410": "La Ceja",
  "278": "El Penol",
  "358": "Guatape",
  "677": "El Retiro",
  "153": "El Carmen de Viboral",
  "773": "San Vicente",
  "356": "Guarne",
  "800": "Santuario",
};

export default function SearchBar() {
  const router = useRouter();
  const [transaccion, setTransaccion] = useState("venta");
  const [tipo, setTipo] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [hab, setHab] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [areaMin, setAreaMin] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("transaccion", transaccion);
    if (tipo) params.set("tipo", tipo);
    if (ciudad) params.set("ciudad", ciudad);
    if (hab) params.set("hab", hab);
    if (precioMin) params.set("precio_min", precioMin);
    if (precioMax) params.set("precio_max", precioMax);
    if (areaMin) params.set("area_min", areaMin);
    router.push(`/propiedades?${params.toString()}`);
  };

  const inputClass = "rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-primary)] bg-white w-full";

  return (
    <div className="mt-8 p-4 bg-white rounded-2xl shadow-lg border border-[var(--color-border)]">
      {/* Row 1: transaction toggle + type + city + search */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)] flex-shrink-0">
          <button
            onClick={() => setTransaccion("venta")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${transaccion === "venta" ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-primary)]"}`}
          >
            Comprar
          </button>
          <button
            onClick={() => setTransaccion("arriendo")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${transaccion === "arriendo" ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-primary)]"}`}
          >
            Arrendar
          </button>
        </div>

        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={`${inputClass} flex-1`}>
          <option value="">Tipo de propiedad</option>
          {Object.entries(PROPERTY_TYPES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <select value={ciudad} onChange={(e) => setCiudad(e.target.value)} className={`${inputClass} flex-1`}>
          <option value="">Municipio</option>
          {Object.entries(CITIES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <select value={hab} onChange={(e) => setHab(e.target.value)} className={`${inputClass} sm:w-32`}>
          <option value="">Habitaciones</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>

        <button
          onClick={handleSearch}
          className="px-6 py-2.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors flex items-center justify-center gap-2 flex-shrink-0"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Buscar
        </button>
      </div>

      {/* More filters toggle */}
      <div className="mt-2 flex items-center">
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1"
        >
          <svg className={`h-3.5 w-3.5 transition-transform ${showMore ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showMore ? "Menos filtros" : "Mas filtros"}
        </button>
      </div>

      {showMore && (
        <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-[var(--color-border)]">
          <input type="number" placeholder="Precio min" value={precioMin} onChange={(e) => setPrecioMin(e.target.value)} className={`${inputClass} w-36`} />
          <input type="number" placeholder="Precio max" value={precioMax} onChange={(e) => setPrecioMax(e.target.value)} className={`${inputClass} w-36`} />
          <input type="number" placeholder="Area min (m2)" value={areaMin} onChange={(e) => setAreaMin(e.target.value)} className={`${inputClass} w-36`} />
        </div>
      )}
    </div>
  );
}
