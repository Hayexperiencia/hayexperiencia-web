import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
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
};

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
      <body className="min-h-full flex flex-col font-[var(--font-montserrat)]">
        <Analytics />
        <Navbar primary={navigation?.primary ?? null} />
        <main className="flex-1">{children}</main>
        <Footer groups={navigation?.footer ?? null} settings={settings} />
        <WhatsAppButton phone={settings?.whatsapp ?? null} />
      </body>
    </html>
  );
}
