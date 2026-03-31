"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PROPERTY_TYPES } from "@/lib/types";

export default function SearchBar() {
  const router = useRouter();
  const [transaccion, setTransaccion] = useState("venta");
  const [tipo, setTipo] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("transaccion", transaccion);
    if (tipo) params.set("tipo", tipo);
    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <div className="mt-8 p-2 bg-white rounded-2xl shadow-lg border border-[var(--color-border)] flex flex-col sm:flex-row items-stretch gap-2">
      {/* Transaction */}
      <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)] flex-shrink-0">
        <button
          onClick={() => setTransaccion("venta")}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            transaccion === "venta"
              ? "bg-[var(--color-primary)] text-white"
              : "bg-white text-[var(--color-primary)]"
          }`}
        >
          Comprar
        </button>
        <button
          onClick={() => setTransaccion("arriendo")}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            transaccion === "arriendo"
              ? "bg-[var(--color-primary)] text-white"
              : "bg-white text-[var(--color-primary)]"
          }`}
        >
          Arrendar
        </button>
      </div>

      {/* Property type */}
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-primary)] bg-white min-w-0"
      >
        <option value="">Que tipo de propiedad buscas?</option>
        {Object.entries(PROPERTY_TYPES).map(([id, name]) => (
          <option key={id} value={id}>{name}</option>
        ))}
      </select>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="px-8 py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors flex items-center justify-center gap-2 flex-shrink-0"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Buscar
      </button>
    </div>
  );
}
