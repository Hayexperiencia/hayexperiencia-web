"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// La landing de ALUNA (/aluna) es una pieza de conversión con identidad propia:
// no muestra el Navbar/Footer/WhatsApp de Hay Experiencia.
// El admin conserva el navbar para navegar, pero no el chrome comercial: el footer
// y el botón de WhatsApp son ruido en una herramienta interna y en el celular
// empujan el contenido útil fuera de pantalla.
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
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (bare) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      {navbar}
      <main className="flex-1">{children}</main>
      {!isAdmin && footer}
      {!isAdmin && whatsapp}
    </>
  );
}
