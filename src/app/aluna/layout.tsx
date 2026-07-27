import type { Metadata } from "next";
import Script from "next/script";
import { DM_Serif_Display, Bricolage_Grotesque } from "next/font/google";
import SmoothScroll from "@/components/aluna/SmoothScroll";
import AlunaTracking from "@/components/aluna/AlunaTracking";

// Pixel dedicado de ALUNA (campaña de pauta). Coexiste con el global de HE:
// usamos trackSingle para que los eventos de ALUNA vayan solo a este pixel.
const ALUNA_PIXEL = process.env.NEXT_PUBLIC_ALUNA_META_PIXEL_ID || "894787075010721";

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
  metadataBase: new URL("https://alunacampestre.com"),
  title: "ALUNA Campestre | Lotes campestres listos para entregar en Marinilla",
  description:
    "El proyecto consciente para tu cuerpo, mente y espíritu. Lotes campestres de 2.500 m² con entrega inmediata y escrituración en Marinilla, Oriente Antioqueño. Aparta con $10.000.000, financiación hasta 12 meses.",
  alternates: { canonical: "https://alunacampestre.com" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://alunacampestre.com",
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
      <Script id="aluna-meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${ALUNA_PIXEL}');
          fbq('trackSingle','${ALUNA_PIXEL}','PageView');
        `}
      </Script>
      <AlunaTracking />
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
