"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// La landing de ALUNA (/aluna) es una pieza de conversión con identidad propia:
// no muestra el Navbar/Footer/WhatsApp de Hay Experiencia.
export default function ConditionalChrome({
  navbar,
  footer,
  whatsapp,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  whatsapp: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/aluna");

  if (bare) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      {navbar}
      <main className="flex-1">{children}</main>
      {footer}
      {whatsapp}
    </>
  );
}
