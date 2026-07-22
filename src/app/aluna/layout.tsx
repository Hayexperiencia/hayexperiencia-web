import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import SmoothScroll from "@/components/aluna/SmoothScroll";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
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
      "Lotes campestres listos para entregar en Marinilla. Trabaja hiperconectado y desconéctate en minutos. Ten las dos vidas.",
  },
};

export default function AlunaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={poppins.variable}
      style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", color: "var(--color-verde)" }}
    >
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
