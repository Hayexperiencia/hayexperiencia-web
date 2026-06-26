"use client";

import { useState } from "react";

type Opt = { k: string; label: string };

const USO: Opt[] = [
  { k: "vivir", label: "Para vivir" },
  { k: "inversion", label: "Inversión (arriendo o valorización)" },
  { k: "descanso", label: "Casa de descanso" },
  { k: "lote", label: "Lote para construir" },
  { k: "negocio", label: "Negocio / local" },
];
const PAGO: Opt[] = [
  { k: "contado", label: "De contado" },
  { k: "credito", label: "Con crédito hipotecario" },
  { k: "permuta", label: "Permuta (entrego otro inmueble)" },
  { k: "mixto", label: "Mixto" },
  { k: "indeciso", label: "Aún no sé" },
];
const PLAZO: Opt[] = [
  { k: "ya", label: "Lo antes posible" },
  { k: "1-3m", label: "En 1 a 3 meses" },
  { k: "3-6m", label: "En 3 a 6 meses" },
  { k: "6m+", label: "En más de 6 meses" },
  { k: "explorando", label: "Solo estoy explorando" },
];

function fmtMM(n: number): string {
  const mm = Math.round(n / 1_000_000);
  return mm >= 1000 ? `$${(mm / 1000).toFixed(1).replace(".", ",")} mil M` : `$${mm} M`;
}

type PresuOpt = { label: string; value: number | null };
function budgetOptions(price: number): PresuOpt[] {
  if (!price || price <= 0) {
    return [
      { label: "Menos de $200 M", value: 150_000_000 },
      { label: "$200 M – $400 M", value: 300_000_000 },
      { label: "$400 M – $700 M", value: 550_000_000 },
      { label: "Más de $700 M", value: 850_000_000 },
      { label: "Prefiero hablarlo", value: null },
    ];
  }
  return [
    { label: `Menos de ${fmtMM(price * 0.8)}`, value: Math.round(price * 0.7) },
    { label: `${fmtMM(price * 0.8)} – ${fmtMM(price)}`, value: Math.round(price * 0.9) },
    { label: `${fmtMM(price)} – ${fmtMM(price * 1.2)}`, value: Math.round(price * 1.1) },
    { label: `Más de ${fmtMM(price * 1.2)}`, value: Math.round(price * 1.3) },
    { label: "Prefiero hablarlo", value: null },
  ];
}

function validPhoneCO(v: string): boolean {
  const d = v.replace(/\D/g, "");
  return d.length === 10 || (d.length === 12 && d.startsWith("57"));
}
function validEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export default function PropertyIntentModal({
  wasiId,
  headline,
  precioNum,
  precioLabel,
  waLink,
  onClose,
}: {
  wasiId: string;
  headline: string;
  precioNum: number;
  precioLabel: string;
  waLink: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [uso, setUso] = useState("");
  const [pago, setPago] = useState("");
  const [plazo, setPlazo] = useState("");
  const [presu, setPresu] = useState<PresuOpt | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const TOTAL = 5; // pasos 0..4 (5 = confirmación)
  const budgets = budgetOptions(precioNum);

  function choose(setter: (v: string) => void, value: string) {
    setter(value);
    setStep((s) => s + 1);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 3) errs.name = "Escribe tu nombre completo";
    if (!validPhoneCO(phone)) errs.phone = "Celular colombiano de 10 dígitos (ej: 3001234567)";
    if (email && !validEmail(email)) errs.email = "Email inválido";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/lead/property-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wasiId,
          name: name.trim(),
          phone,
          email: email || undefined,
          uso,
          pago,
          plazo,
          presupuesto: presu?.value ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrors({ form: data.error || "No pudimos registrar tus datos. Intenta de nuevo." });
      } else {
        setDone(true);
        setStep(5);
      }
    } catch {
      setErrors({ form: "Error de conexión. Intenta de nuevo." });
    }
    setSubmitting(false);
  }

  const Chip = ({ label, onClick, active }: { label: string; onClick: () => void; active?: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-colors ${
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-primary)]"
          : "border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-accent)] hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-bold text-[var(--color-primary)] pr-4">
            {done ? "¡Listo!" : "Cuéntanos qué buscas"}
          </h3>
          <button onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            ×
          </button>
        </div>
        <p className="text-xs text-[var(--color-text-light)] mb-4">
          {headline} · {precioLabel}
        </p>

        {/* Progreso */}
        {!done && (
          <div className="h-1.5 w-full bg-gray-100 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] transition-all duration-300"
              style={{ width: `${((step + 1) / (TOTAL + 1)) * 100}%` }}
            />
          </div>
        )}

        {/* Paso 0 — Uso */}
        {step === 0 && (
          <div className="space-y-2.5">
            <p className="font-semibold text-[var(--color-primary)] mb-2">¿Para qué estás buscando esta propiedad?</p>
            {USO.map((o) => (
              <Chip key={o.k} label={o.label} active={uso === o.k} onClick={() => choose(setUso, o.k)} />
            ))}
          </div>
        )}

        {/* Paso 1 — Pago */}
        {step === 1 && (
          <div className="space-y-2.5">
            <p className="font-semibold text-[var(--color-primary)] mb-2">¿Cómo pensarías pagarla?</p>
            {PAGO.map((o) => (
              <Chip key={o.k} label={o.label} active={pago === o.k} onClick={() => choose(setPago, o.k)} />
            ))}
          </div>
        )}

        {/* Paso 2 — Plazo */}
        {step === 2 && (
          <div className="space-y-2.5">
            <p className="font-semibold text-[var(--color-primary)] mb-2">¿En cuánto tiempo te gustaría comprar?</p>
            {PLAZO.map((o) => (
              <Chip key={o.k} label={o.label} active={plazo === o.k} onClick={() => choose(setPlazo, o.k)} />
            ))}
          </div>
        )}

        {/* Paso 3 — Presupuesto */}
        {step === 3 && (
          <div className="space-y-2.5">
            <p className="font-semibold text-[var(--color-primary)] mb-2">¿Cuál es tu presupuesto aproximado?</p>
            {budgets.map((b) => (
              <Chip
                key={b.label}
                label={b.label}
                active={presu?.label === b.label}
                onClick={() => {
                  setPresu(b);
                  setStep(4);
                }}
              />
            ))}
          </div>
        )}

        {/* Paso 4 — Contacto */}
        {step === 4 && (
          <form onSubmit={submit} className="space-y-4" noValidate>
            <p className="font-semibold text-[var(--color-primary)]">¿A nombre de quién y cómo te contactamos?</p>
            <div>
              <label className="block text-sm font-medium text-[var(--color-primary)] mb-1" htmlFor="pi-name">Nombre completo *</label>
              <input id="pi-name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${errors.name ? "border-red-400" : "border-[var(--color-border)]"}`} />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-primary)] mb-1" htmlFor="pi-phone">Celular / WhatsApp *</label>
              <input id="pi-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="3001234567"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${errors.phone ? "border-red-400" : "border-[var(--color-border)]"}`} />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-primary)] mb-1" htmlFor="pi-email">Email <span className="font-normal text-[var(--color-text-light)]">(opcional)</span></label>
              <input id="pi-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${errors.email ? "border-red-400" : "border-[var(--color-border)]"}`} />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            {errors.form && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{errors.form}</p>}
            <button type="submit" disabled={submitting}
              className="w-full px-6 py-3.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] font-bold hover:bg-[var(--color-accent-light)] transition-colors disabled:opacity-60">
              {submitting ? "Enviando…" : "Quiero que me contacten"}
            </button>
            <p className="text-[11px] text-[var(--color-text-light)] text-center">
              Al continuar aceptas nuestra <a href="/privacidad" target="_blank" className="underline">política de datos</a> (Ley 1581/2012).
            </p>
          </form>
        )}

        {/* Paso 5 — Confirmación */}
        {done && (
          <div className="text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl mb-3">✓</div>
            <p className="text-[var(--color-primary)] font-semibold">Gracias{name ? `, ${name.split(" ")[0]}` : ""}.</p>
            <p className="text-sm text-[var(--color-text-light)] mt-1 mb-5">
              Un asesor de Hay Experiencia te contacta hoy. Si quieres, escríbenos ya por WhatsApp.
            </p>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="block w-full text-center px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:opacity-90 transition-opacity">
              Hablar ahora por WhatsApp
            </a>
            <button onClick={onClose} className="block w-full text-center text-sm text-[var(--color-text-light)] hover:underline pt-3">
              Cerrar
            </button>
          </div>
        )}

        {/* Atrás */}
        {!done && step > 0 && step <= 4 && (
          <button onClick={() => setStep((s) => s - 1)} className="mt-4 text-sm text-[var(--color-text-light)] hover:underline">
            ← Atrás
          </button>
        )}
      </div>
    </div>
  );
}
