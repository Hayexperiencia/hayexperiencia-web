import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hay Experiencia Inmobiliaria | Oriente Antioqueno",
    template: "%s | Hay Experiencia Inmobiliaria",
  },
  description:
    "Tu sueno, nuestra experiencia. Lotes, casas, apartamentos y fincas en el Oriente Antioqueno. Marinilla, Rionegro, La Ceja, El Penol, Guatape.",
  metadataBase: new URL("https://hayexperiencia.com"),
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Hay Experiencia Inmobiliaria",
    images: ["/images/hero-oriente.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[var(--font-montserrat)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
