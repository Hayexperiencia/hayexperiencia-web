"use client";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

// Corre al aterrizar en /aluna: guarda UTM + fbclid/fbc/fbp en sessionStorage
// para que viajen con el lead aunque el usuario navegue o rebote antes del form.
export default function AlunaTracking() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
