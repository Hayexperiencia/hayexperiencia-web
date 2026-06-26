"use client";

import { useState } from "react";
import PropertyIntentModal from "./PropertyIntentModal";

// Botón + modal del lead-magnet. Se monta en la página de propiedad (server component)
// recibiendo los datos ya resueltos; abre el wizard por intención (clic), no automático.
export default function PropertyIntentCTA(props: {
  wasiId: string;
  headline: string;
  precioNum: number;
  precioLabel: string;
  waLink: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-gray-50 p-5">
        <div>
          <p className="font-semibold text-[var(--color-primary)]">¿Te interesa esta propiedad?</p>
          <p className="text-sm text-[var(--color-text-light)]">
            Cuéntanos qué buscas y cómo planeas pagarla; un asesor te contacta hoy.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent-light)]"
        >
          Quiero que me contacten
        </button>
      </div>
      {open && <PropertyIntentModal {...props} onClose={() => setOpen(false)} />}
    </>
  );
}
