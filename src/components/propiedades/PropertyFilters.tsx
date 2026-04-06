"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useRef, KeyboardEvent } from "react";
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

  // Local state for text/number inputs (lazy: only apply on blur/enter)
  const [localPrecioMin, setLocalPrecioMin] = useState(searchParams.get("precio_min") || "");
  const [localPrecioMax, setLocalPrecioMax] = useState(searchParams.get("precio_max") || "");
  const [localAreaMin, setLocalAreaMin] = useState(searchParams.get("area_min") || "");
  const [localAreaMax, setLocalAreaMax] = useState(searchParams.get("area_max") || "");

  const get = (key: string) => searchParams.get(key) || "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/propiedades?${params.toString()}`);
    },
    [router, searchParams]
  );

  const applyAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const updates: Record<string, string> = {
      precio_min: localPrecioMin,
      precio_max: localPrecioMax,
      area_min: localAreaMin,
      area_max: localAreaMax,
    };
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v); else params.delete(k);
    }
    params.delete("page");
    router.push(`/propiedades?${params.toString()}`);
  }, [router, searchParams, localPrecioMin, localPrecioMax, localAreaMin, localAreaMax]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") applyAllFilters();
  };

  const transaction = get("transaccion") || "venta";
  const selectClass = "rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-primary)] bg-white";
  const inputClass = "rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-primary)] bg-white";

  return (
    <div className="mb-8 space-y-4">
      {/* Row 1: transaction + type + city + hab */}
      <div className="flex flex-wrap gap-3">
        <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)]">
          <button
            onClick={() => updateFilter("transaccion", "venta")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${transaction === "venta" ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-primary)] hover:bg-gray-50"}`}
          >
            Venta
          </button>
          <button
            onClick={() => updateFilter("transaccion", "arriendo")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${transaction === "arriendo" ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-primary)] hover:bg-gray-50"}`}
          >
            Arriendo
          </button>
        </div>

        <select value={get("tipo")} onChange={(e) => updateFilter("tipo", e.target.value)} className={selectClass}>
          <option value="">Todos los tipos</option>
          {Object.entries(PROPERTY_TYPES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <select value={get("ciudad")} onChange={(e) => updateFilter("ciudad", e.target.value)} className={selectClass}>
          <option value="">Todos los municipios</option>
          {Object.entries(CITIES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <select value={get("hab")} onChange={(e) => updateFilter("hab", e.target.value)} className={selectClass}>
          <option value="">Habitaciones</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
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
          <select value={get("banos")} onChange={(e) => updateFilter("banos", e.target.value)} className={selectClass}>
            <option value="">Banos</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
          {/* Wasi supports: garages */}
          <select value={get("parqueadero")} onChange={(e) => updateFilter("parqueadero", e.target.value)} className={selectClass}>
            <option value="">Parqueadero</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
          </select>
          {/* Wasi supports: strpiatum (estrato) */}
          <select value={get("estrato")} onChange={(e) => updateFilter("estrato", e.target.value)} className={selectClass}>
            <option value="">Estrato</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
          <input
            type="number"
            placeholder="Precio min"
            value={localPrecioMin}
            onChange={(e) => setLocalPrecioMin(e.target.value)}
            onBlur={applyAllFilters}
            onKeyDown={handleKeyDown}
            className={`w-36 ${inputClass}`}
          />
          <input
            type="number"
            placeholder="Precio max"
            value={localPrecioMax}
            onChange={(e) => setLocalPrecioMax(e.target.value)}
            onBlur={applyAllFilters}
            onKeyDown={handleKeyDown}
            className={`w-36 ${inputClass}`}
          />
          <input
            type="number"
            placeholder="Area min (m2)"
            value={localAreaMin}
            onChange={(e) => setLocalAreaMin(e.target.value)}
            onBlur={applyAllFilters}
            onKeyDown={handleKeyDown}
            className={`w-36 ${inputClass}`}
          />
          <input
            type="number"
            placeholder="Area max (m2)"
            value={localAreaMax}
            onChange={(e) => setLocalAreaMax(e.target.value)}
            onBlur={applyAllFilters}
            onKeyDown={handleKeyDown}
            className={`w-36 ${inputClass}`}
          />
          <button
            onClick={applyAllFilters}
            className="px-5 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-semibold hover:bg-[var(--color-accent-light)] transition-colors"
          >
            Aplicar filtros
          </button>
        </div>
      )}

      {/* Active filter chips */}
      {(get("tipo") || get("ciudad") || get("hab") || get("banos") || get("parqueadero") || get("estrato") || get("precio_min") || get("precio_max") || get("area_min") || get("area_max")) && (
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
          {get("parqueadero") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              {get("parqueadero")}+ parq.
              <button onClick={() => updateFilter("parqueadero", "")} className="hover:text-red-500">&times;</button>
            </span>
          )}
          {get("estrato") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              Estrato {get("estrato")}
              <button onClick={() => updateFilter("estrato", "")} className="hover:text-red-500">&times;</button>
            </span>
          )}
          {get("precio_min") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              Desde ${parseInt(get("precio_min")).toLocaleString("es-CO")}
              <button onClick={() => { updateFilter("precio_min", ""); setLocalPrecioMin(""); }} className="hover:text-red-500">&times;</button>
            </span>
          )}
          {get("precio_max") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              Hasta ${parseInt(get("precio_max")).toLocaleString("es-CO")}
              <button onClick={() => { updateFilter("precio_max", ""); setLocalPrecioMax(""); }} className="hover:text-red-500">&times;</button>
            </span>
          )}
          {get("area_min") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              Desde {get("area_min")} m2
              <button onClick={() => { updateFilter("area_min", ""); setLocalAreaMin(""); }} className="hover:text-red-500">&times;</button>
            </span>
          )}
          {get("area_max") && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/5 text-xs font-medium text-[var(--color-primary)]">
              Hasta {get("area_max")} m2
              <button onClick={() => { updateFilter("area_max", ""); setLocalAreaMax(""); }} className="hover:text-red-500">&times;</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
