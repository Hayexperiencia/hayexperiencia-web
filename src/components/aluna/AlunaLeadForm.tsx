"use client";
import { useState } from "react";
import { getAttribution, newEventId, ALUNA_PIXEL_ID } from "@/lib/attribution";

const WA =
  "https://wa.me/573137939382?text=" +
  encodeURIComponent("Hola, quiero información de ALUNA y agendar una visita.");

const INTERES = [
  { v: "vivir", l: "Vivir / construir" },
  { v: "inversion", l: "Inversión" },
  { v: "descanso", l: "Casa de descanso" },
];

const field =
  "w-full rounded-xl border border-verde-200 bg-white px-4 py-3 text-verde placeholder:text-gris/60 focus:border-tierra focus:outline-none focus:ring-2 focus:ring-tierra/30";

function validPhone(v: string) {
  const d = v.replace(/\D/g, "");
  return d.length === 10 || (d.length === 12 && d.startsWith("57"));
}

export default function AlunaLeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interes, setInteres] = useState("vivir");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (name.trim().length < 3) return setErr("Escribe tu nombre completo.");
    if (!validPhone(phone)) return setErr("Escribe un celular válido (10 dígitos).");

    setState("sending");
    const eventId = newEventId();
    try {
      const res = await fetch("/api/aluna/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || null,
          interes,
          company,
          event_id: eventId,
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) throw new Error();
      // Evento Lead al pixel de ALUNA, deduplicado con CAPI por eventID.
      const w = window as unknown as { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void };
      try {
        w.fbq?.("trackSingle", ALUNA_PIXEL_ID, "Lead", { content_name: "ALUNA", currency: "COP", value: 0 }, { eventID: eventId });
        w.gtag?.("event", "generate_lead", { proyecto: "aluna" });
      } catch {}
      setState("ok");
    } catch {
      setState("error");
      setErr("No pudimos enviar. Intenta de nuevo o escríbenos por WhatsApp.");
    }
  }

  if (state === "ok") {
    return (
      <div className="rounded-3xl bg-crema p-8 text-center shadow-sm ring-1 ring-verde-100">
        <h3 className="al-display text-3xl text-verde">¡Listo! Te contactamos hoy.</h3>
        <p className="mt-3 text-gris">
          Un asesor de ALUNA se comunica contigo para agendar tu visita. Si quieres, adelántate por WhatsApp.
        </p>
        <a
          href={WA}
          className="mt-6 inline-block rounded-full bg-tierra px-8 py-4 font-semibold text-verde transition hover:bg-tierra-400"
        >
          Escribir por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-crema p-6 shadow-sm ring-1 ring-verde-100 md:p-8">
      <div className="grid gap-4">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre completo" className={field} autoComplete="name" />
        <input required inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Celular (WhatsApp)" className={field} autoComplete="tel" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo (opcional)" className={field} autoComplete="email" />
        <select value={interes} onChange={(e) => setInteres(e.target.value)} className={field} aria-label="Interés">
          {INTERES.map((o) => (
            <option key={o.v} value={o.v}>{o.l}</option>
          ))}
        </select>
        {/* honeypot: oculto para humanos, tentador para bots */}
        <input
          tabIndex={-1}
          autoComplete="off"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="hidden"
          aria-hidden="true"
        />
      </div>
      {err && <p className="mt-3 text-sm font-medium text-marron">{err}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 w-full rounded-full bg-tierra px-8 py-4 text-base font-semibold text-verde transition hover:bg-tierra-400 disabled:opacity-60"
      >
        {state === "sending" ? "Enviando…" : "Quiero que me contacten"}
      </button>
      <p className="mt-3 text-center text-xs text-gris">
        O escríbenos directo por{" "}
        <a href={WA} className="font-semibold text-verde underline">WhatsApp</a>.
      </p>
    </form>
  );
}
