import Link from "next/link";
import { getZonaByCity, segmentoDeTipo } from "@/lib/zonas";

// Bloque de inteligencia de mercado de la ZONA, para toda propiedad en una zona conocida.
// Complementa al benchmark individual (apartamentos) y lo SUSTITUYE en lotes/fincas/casas,
// donde no hay una mediana de comparables confiable: ahi el dato de mercado correcto es el
// de la zona. Asi cada propiedad recibe inteligencia de mercado apropiada a su tipo.
export default function ZonaMercadoCard({ city, typeLabel }: { city: string; typeLabel: string }) {
  const zona = getZonaByCity(city);
  if (!zona) return null;
  const seg = zona.segmentos.find((s) => s.tipo === segmentoDeTipo(typeLabel));

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-gray-50 p-5">
      <h3 className="text-lg font-semibold text-[var(--color-primary)]">El mercado de {zona.nombre}</h3>
      {seg ? (
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-light)]">
          {seg.etiqueta} en {zona.nombre}: mediana de mercado de{" "}
          <span className="font-semibold text-[var(--color-primary)]">${seg.medianaPrecioMM} millones</span> ·{" "}
          {seg.activos.toLocaleString("es-CO")} propiedades activas (datos a {zona.asOf}).
        </p>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-light)]">
          {zona.nombre} hace parte del Oriente Antioqueno, una de las zonas de mayor valorizacion de la region.
        </p>
      )}
      <Link
        href={`/zonas/${zona.slug}`}
        className="mt-3 inline-block font-medium text-[var(--color-primary)] hover:underline"
      >
        Ver el mercado de {zona.nombre} →
      </Link>
    </div>
  );
}
