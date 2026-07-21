import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CookieBanner from "@/components/layout/CookieBanner";
import ConditionalChrome from "@/components/layout/ConditionalChrome";
import Analytics from "@/components/analytics/Analytics";
import { getNavigation, getSiteSettings } from "@/lib/strapi";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hay Experiencia Inmobiliaria | Oriente Antioqueño",
    template: "%s | Hay Experiencia Inmobiliaria",
  },
  description:
    "Tu sueño, nuestra experiencia. Lotes, casas, apartamentos y fincas en el Oriente Antioqueño. Marinilla, Rionegro, La Ceja, El Peñol, Guatapé.",
  metadataBase: new URL("https://hayexperiencia.com"),
  icons: {
    icon: "/logos/favicon.svg",
    apple: "/logos/isotipo.svg",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Hay Experiencia Inmobiliaria",
    images: ["/images/hero-oriente.jpg"],
  },
  other: {
    "facebook-domain-verification": "s8fji1xy0ttj08b2lyynsb04t8j8ts",
  },
};

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navigation, settings] = await Promise.all([
    getNavigation(),
    getSiteSettings(),
  ]);

  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <head>
        <Analytics />
      </head>
      <body className="min-h-full flex flex-col font-[var(--font-montserrat)]">
        {META_PIXEL_ID ? (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        ) : null}
        <ConditionalChrome
          navbar={<Navbar primary={navigation?.primary ?? null} />}
          footer={<Footer groups={navigation?.footer ?? null} settings={settings} />}
          whatsapp={<WhatsAppButton phone={settings?.whatsapp ?? null} />}
        >
          {children}
        </ConditionalChrome>
        <CookieBanner />
      </body>
    </html>
  );
}
