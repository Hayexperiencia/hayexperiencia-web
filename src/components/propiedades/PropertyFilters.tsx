"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
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

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMore, setShowMore] = useState(false);

  const get = (key: string) => searchParams.get(key) || "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("skip");
      router.push(`/propiedades?${params.toString()}`);
    },
    [router, searchParams]
  );

  const transaction = get("transaccion") || "venta";

  return (
    <div className="mb-8 space-y-4">
      {/* Row 1: transaction + type + city */}
      <div className="flex flex-wrap gap-3">
        <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)]">
          <button
            onClick={() => updateFilter("transaccion", "venta")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              transaction === "venta"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-[var(--color-primary)] hover:bg-gray-50"
            }`}
          >
            Venta
          </button>
          <button
            onClick={() => updateFilter("transaccion", "arriendo")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              transaction === "arriendo"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-[var(--color-primary)] hover:bg-gray-50"
            }`}
          >
            Arriendo
          </button>
        </div>

        <select
          value={get("tipo")}
          onChange={(e) => updateFilter("tipo", e.target.value)}
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-primary)] bg-white"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(PROPERTY_TYPES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <select
          value={get("ciudad")}
          onChange={(e) => updateFilter("ciudad", e.target.value)}
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-primary)] bg-white"
        >
          <option value="">Todos los municipios</option>
          {Object.entries(CITIES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <select
          value={get("hab")}
          onChange={(e) => updateFilter("hab", e.target.value)}
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-primary)] bg-white"
        >
          <option value="">Habitaciones</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>

        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-primary)] bg-white hover:bg-gray-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Mas filtros
        </button>
      </div>

      {showMore && (
        <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-gray-50 border border-[var(--color-border)]">
          <select
            value={get("banos")}
            onChange={(e) => updateFilter("banos", e.target.value)}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-primary)] bg-white"
          >
            <option value="">Banos</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
          <input
            type="number"
            placeholder="Precio min"
            value={get("precio_min")}
            onChange={(e) => updateFilter("precio_min", e.target.value)}
            className="w-36 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-primary)] bg-white"
          />
          <input
            type="number"
            placeholder="Precio max"
            value={get("precio_max")}
            onChange={(e) => updateFilter("precio_max", e.target.value)}
            className="w-36 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-primary)] bg-white"
          />
          <input
            type="number"
            placeholder="Area min (m2)"
            value={get("area_min")}
            onChange={(e) => updateFilter("area_min", e.target.value)}
            className="w-36 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-primary)] bg-white"
          />
        </div>
      )}

      {/* Active filter chips */}
      {(get("tipo") || get("ciudad") || get("hab") || get("banos") || get("precio_min") || get("precio_max") || get("area_min")) && (
        <div className="flex flex-wrap gap-2">
          {get("tipo") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              {PROPERTY_TYPES[parseInt(get("tipo"))] || get("tipo")}
              <button onClick={() => updateFilter("tipo", "")} className="hover:text-red-500">&times;</button>
            </span>
          )}
          {get("ciudad") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              {CITIES[get("ciudad")] || get("ciudad")}
              <button onClick={() => updateFilter("ciudad", "")} className="hover:text-red-500">&times;</button>
            </span>
          )}
          {get("hab") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              {get("hab")}+ hab
              <button onClick={() => updateFilter("hab", "")} className="hover:text-red-500">&times;</button>
            </span>
          )}
          {get("banos") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              {get("banos")}+ banos
              <button onClick={() => updateFilter("banos", "")} className="hover:text-red-500">&times;</button>
            </span>
          )}
          {get("precio_min") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              Desde ${parseInt(get("precio_min")).toLocaleString("es-CO")}
              <button onClick={() => updateFilter("precio_min", "")} className="hover:text-red-500">&times;</button>
            </span>
          )}
          {get("precio_max") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              Hasta ${parseInt(get("precio_max")).toLocaleString("es-CO")}
              <button onClick={() => updateFilter("precio_max", "")} className="hover:text-red-500">&times;</button>
            </span>
          )}
          {get("area_min") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              Desde {get("area_min")} m2
              <button onClick={() => updateFilter("area_min", "")} className="hover:text-red-500">&times;</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
