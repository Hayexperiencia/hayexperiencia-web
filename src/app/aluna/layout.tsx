import type { Metadata } from "next";
import { DM_Serif_Display, Bricolage_Grotesque } from "next/font/google";
import SmoothScroll from "@/components/aluna/SmoothScroll";

// Sistema tipografico ALUNA 2026 (direccion "alto contraste / moda-lujo", elegida por Gabriel):
// Display de alto contraste para titulares/stats + grotesca calida para cuerpo/UI. Adios Poppins.
const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const body = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ALUNA Campestre | Lotes campestres listos para entregar en Marinilla",
  description:
    "El proyecto consciente para tu cuerpo, mente y espíritu. Lotes campestres de 2.500 m² con entrega inmediata y escrituración en Marinilla, Oriente Antioqueño. Aparta con $10.000.000, financiación hasta 12 meses.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "ALUNA Campestre",
    title: "ALUNA Campestre | El proyecto consciente",
    description:
      "Lotes campestres listos para entregar en Marinilla. Trabaja hiperconectado y desconéctate en minutos: el equilibrio consciente.",
  },
};

export default function AlunaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${display.variable} ${body.variable}`}
      style={{ fontFamily: "var(--font-body), sans-serif", color: "var(--color-verde)" }}
    >
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
