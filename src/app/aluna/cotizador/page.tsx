import type { Metadata } from "next";
import type { CSSProperties } from "react";
import CotizadorApp from "@/components/cotizador/CotizadorApp";

export const metadata: Metadata = {
  title: "Calcula tu plan de pagos | ALUNA Campestre",
  description: "Arma tu plan de pagos de ALUNA Campestre al instante: aparta con $10.000.000 y financia hasta 12 meses.",
  alternates: { canonical: "https://alunacampestre.com/aluna/cotizador" },
};

// El cotizador está 100% basado en var(--color-*). Aquí las redefinimos con la
// paleta ALUNA (verde/tierra/crema) para que se vea igual que la landing, sin
// tocar la lógica del cotizador. Al vivir bajo /aluna hereda: chrome oculto,
// tipografías ALUNA y el pixel de ALUNA (Script del layout).
const alunaTheme = {
  "--color-primary": "#29371C",
  "--color-primary-light": "#3d4f2a",
  "--color-accent": "#D8A579",
  "--color-accent-light": "#e7c6a1",
  "--color-text": "#29371C",
  "--color-text-light": "#6b6b60",
  "--color-border": "#e3ddc8",
  backgroundColor: "#FFEFD3",
  minHeight: "100vh",
} as CSSProperties;

export default function AlunaCotizadorPage() {
  return (
    <div style={alunaTheme}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a href="/aluna" aria-label="Volver a ALUNA">
          <img src="/logos/aluna-verde.png" alt="ALUNA Campestre" className="h-11 w-auto md:h-14" />
        </a>
        <a
          href="/aluna"
          className="text-sm font-semibold text-[var(--color-primary)] transition hover:opacity-70"
        >
          ← Volver a ALUNA
        </a>
      </header>
      <CotizadorApp initialSlug="aluna" />
    </div>
  );
}
