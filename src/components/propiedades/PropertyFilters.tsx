"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { PROPERTY_TYPES } from "@/lib/types";

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const transaction = searchParams.get("transaccion") || "venta";
  const propertyType = searchParams.get("tipo") || "";

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {/* Transaction type */}
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

      {/* Property type */}
      <select
        value={propertyType}
        onChange={(e) => updateFilter("tipo", e.target.value)}
        className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-primary)] bg-white"
      >
        <option value="">Todos los tipos</option>
        {Object.entries(PROPERTY_TYPES).map(([id, name]) => (
          <option key={id} value={id}>{name}</option>
        ))}
      </select>
    </div>
  );
}
