"use client";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

// Smooth scroll con momentum solo para la landing de ALUNA.
// Lenis envuelve el scroll nativo: sticky, anchors y accesibilidad siguen funcionando.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.085, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.6 }}>
      {children}
    </ReactLenis>
  );
}
