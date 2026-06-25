import type { StrapiPropertyEnriched } from "@/lib/strapi";

const POSITION_LABEL: Record<string, string> = {
  BAJO: "Bajo el promedio del mercado",
  EN_RANGO: "Dentro del rango de mercado",
  ALTO: "Sobre el promedio del mercado",
  SIN_BENCHMARK: "Sin suficientes comparables",
  SIN_DATOS: "Sin datos suficientes",
};

const POSITION_COLOR: Record<string, string> = {
  BAJO: "bg-green-50 text-green-700 border-green-200",
  EN_RANGO: "bg-blue-50 text-blue-700 border-blue-200",
  ALTO: "bg-orange-50 text-orange-700 border-orange-200",
  SIN_BENCHMARK: "bg-gray-50 text-gray-600 border-gray-200",
  SIN_DATOS: "bg-gray-50 text-gray-600 border-gray-200",
};

const CONF_LABEL: Record<string, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
  insufficient: "Insuficiente",
};

function formatCop(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

export default function EnrichmentSection({ enriched }: { enriched: StrapiPropertyEnriched }) {
  const benchmark = enriched.marketBenchmark;
  const position = enriched.competitivePosition;
  const depreciation = enriched.depreciation;
  const proximity = enriched.proximity;
  const activity = enriched.marketActivity;
  const comparables = enriched.comparablesPublic ?? [];
  const conf = benchmark?.confidence ?? "insufficient";

  // Política HE: la posición de mercado se publica como argumento de venta SOLO cuando
  // (a) es estadísticamente sólida — confianza alta o media, nunca baja/insuficiente — y
  // (b) favorece o no perjudica la venta (precio por debajo o dentro del rango de mercado).
  // Si la propiedad está sobre el mercado o la confianza es baja, NO se muestra el bloque
  // de posición: ese dato vive en el admin para asesorar el precio con el dueño. No se
  // afirma nada falso; se elige qué mostrar al comprador.
  const confSolida = conf === "high" || conf === "medium";
  const posicionFavorable = position?.status === "BAJO" || position?.status === "EN_RANGO";
  const hasMarket =
    !!benchmark && (benchmark.comparablesCount ?? 0) >= 5 && confSolida && posicionFavorable;
  const hasProximity = proximity && (proximity.distanceToAutopistaKm !== undefined);
  const hasDepreciation = depreciation?.applicable !== false && depreciation?.yearBuilt;

  if (!hasMarket && !hasProximity && !hasDepreciation) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-1">
          Posición de mercado
        </h3>
        <p className="text-xs text-gray-500">
          Estimación referencial calculada desde {benchmark?.comparablesCount ?? 0} listings de mercado
          ·{" "}
          {benchmark?.segment?.areaBand
            ? `${benchmark.segment.propertyType} ${benchmark.segment.areaBand} en ${benchmark.segment.city}`
            : ""}
        </p>
      </div>

      {/* Banner de posición */}
      {hasMarket && position && position.status && (
        <div className={`rounded-2xl border-2 ${POSITION_COLOR[position.status]} p-5`}>
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <span className="text-sm font-semibold uppercase tracking-wide">
              {POSITION_LABEL[position.status]}
            </span>
            {position.diffVsMedianPct !== undefined && (
              <span className="text-2xl font-bold">
                {position.diffVsMedianPct > 0 ? "+" : ""}
                {position.diffVsMedianPct.toFixed(1)}%
              </span>
            )}
          </div>
          {position.narrativeLong && (
            <p className="text-sm mt-2 leading-relaxed">{position.narrativeLong}</p>
          )}
        </div>
      )}

      {/* Stats grid */}
      {hasMarket && benchmark && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <Stat
            label="Mediana mercado"
            value={`${formatCop(benchmark.medianPxM2)}/m²`}
          />
          <Stat
            label="Tu propiedad"
            value={position?.pxM2Property ? `${formatCop(position.pxM2Property)}/m²` : "—"}
          />
          <Stat label="Comparables" value={`${benchmark.comparablesCount ?? 0}`} />
          <Stat
            label="Confianza"
            value={CONF_LABEL[conf] ?? "—"}
          />
        </div>
      )}

      {/* Cercanías */}
      {hasProximity && proximity && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wide mb-3">
            Cercanías
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {proximity.distanceToCascoUrbanoKm !== undefined && (
              <ProxItem label="Casco urbano" km={proximity.distanceToCascoUrbanoKm} />
            )}
            {proximity.distanceToAutopistaKm !== undefined && (
              <ProxItem label="Autopista Med-Bog" km={proximity.distanceToAutopistaKm} />
            )}
            {proximity.distanceToAirportJmcKm !== undefined && (
              <ProxItem label="Aeropuerto JMC" km={proximity.distanceToAirportJmcKm} />
            )}
            {proximity.distanceToMedellinKm !== undefined && (
              <ProxItem label="Medellín centro" km={proximity.distanceToMedellinKm} />
            )}
          </div>
        </div>
      )}

      {/* Edad de construcción */}
      {hasDepreciation && depreciation && depreciation.yearBuilt && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wide mb-3">
            Construcción
          </h4>
          <p className="text-sm text-gray-700">
            Año {depreciation.yearBuilt} · {depreciation.ageYears ?? "—"} años de edad ·
            depreciación referencial {depreciation.depreciationPct ?? "—"}% (método{" "}
            {depreciation.method ?? "Fitto-Corvini"})
          </p>
        </div>
      )}

      {/* Comparables */}
      {comparables.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wide mb-3">
            Listings parecidos en el mercado
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {comparables.slice(0, 3).map((c, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-4 text-sm">
                <p className="font-medium line-clamp-2">{c.title ?? "Propiedad comparable"}</p>
                <div className="mt-2 text-gray-600 space-y-1">
                  <div>{formatCop(c.price)} · {c.areaM2 ?? "—"}m²</div>
                  <div className="text-xs">{formatCop(c.pxM2)}/m²</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actividad del mercado — el "nuevos en 30 días" se omite si es igual al total
          (señal del bug donde el motor copia el total del segmento). */}
      {activity && activity.competitorListingsActive !== undefined && (
        <p className="text-xs text-gray-500">
          Mercado: {activity.competitorListingsActive} listings activos en este segmento ·
          saturación <span className="font-medium">{activity.saturationLabel}</span>
          {activity.newInLast30Days !== undefined &&
          activity.newInLast30Days > 0 &&
          activity.newInLast30Days < (activity.competitorListingsActive ?? 0)
            ? ` · ${activity.newInLast30Days} nuevos en 30 días`
            : ""}
        </p>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 italic leading-relaxed">
        Estimación referencial calculada automáticamente desde 22.499 listings de mercado del Oriente Antioqueño.
        NO constituye avalúo certificado. Para avalúos legales (escrituras, garantías, juicios) consultar
        profesional inscrito en RAA (Ley 1673/2013).
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-lg font-semibold text-[var(--color-primary)]">{value}</div>
    </div>
  );
}

function ProxItem({ label, km }: { label: string; km: number }) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium text-gray-800">{km.toFixed(1)} km</div>
    </div>
  );
}
