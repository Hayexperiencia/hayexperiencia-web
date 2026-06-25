import type { StrapiPropertyEnriched } from "./strapi";

// Política HE de publicación de datos de mercado (decidida 2026-06-25, corte vertical).
// La posición de mercado se publica al comprador SOLO cuando:
//   (a) es sólida: confianza alta o media (nunca baja/insuficiente) y ≥5 comparables,
//   (b) favorece o no perjudica la venta: precio por debajo o dentro del rango (no ALTO),
//   (c) es fresca: el cálculo no supera FRESHNESS_DAYS.
// Si no se cumple, el dato NO se muestra (vive en el admin para asesorar el precio con el
// dueño). No se afirma nada falso; se elige qué mostrar. Única fuente de verdad de la
// política — la usan EnrichmentSection, el JSON-LD y las FAQ.

export const FRESHNESS_DAYS = 120;

export function marketPublishable(enriched: StrapiPropertyEnriched | null | undefined): boolean {
  const b = enriched?.marketBenchmark;
  const p = enriched?.competitivePosition;
  if (!b || !p) return false;
  const conf = b.confidence;
  const solida = conf === "high" || conf === "medium";
  const favorable = p.status === "BAJO" || p.status === "EN_RANGO";
  if (!solida || !favorable) return false;
  if ((b.comparablesCount ?? 0) < 5) return false;

  // Gate de frescura: no publicar cifras vencidas.
  const asOf = b.asOf ?? enriched?.computedAt;
  if (asOf) {
    const ageDays = (Date.now() - new Date(asOf).getTime()) / 86_400_000;
    if (Number.isFinite(ageDays) && ageDays > FRESHNESS_DAYS) return false;
  }
  return true;
}

// Frase corta de prueba para el hero (chip above-the-fold). Null si no es publicable.
export function marketHeroProof(enriched: StrapiPropertyEnriched | null | undefined): string | null {
  if (!marketPublishable(enriched)) return null;
  const p = enriched!.competitivePosition!;
  const n = enriched!.marketBenchmark!.comparablesCount ?? 0;
  const pct = Math.abs(p.diffVsMedianPct ?? 0);
  if (p.status === "BAJO") return `Precio ${pct.toFixed(0)}% bajo la mediana del mercado · ${n} comparables`;
  return `Precio dentro del rango de mercado · validado con ${n} comparables`;
}
