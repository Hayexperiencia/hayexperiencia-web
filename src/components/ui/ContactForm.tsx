"use client";

import { useState, FormEvent } from "react";

interface ContactFormProps {
  source: string;
  title?: string;
  subtitle?: string;
  showMessage?: boolean;
  compact?: boolean;
  className?: string;
}

const GHL_WEBHOOK_URL = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL || "";

export default function ContactForm({
  source,
  title,
  subtitle,
  showMessage = true,
  compact = false,
  className = "",
}: ContactFormProps) {
  const [form, setForm] = useState({ firstName: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const isValid = form.firstName.trim() && form.email.trim() && form.phone.trim();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setStatus("loading");

    const payload = {
      firstName: form.firstName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
      source,
      timestamp: new Date().toISOString(),
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
    };

    if (!GHL_WEBHOOK_URL) {
      console.warn("[ContactForm] GHL_WEBHOOK_URL no configurado. Simulando envío en desarrollo.");
      console.log("[ContactForm] Payload:", payload);
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      return;
    }

    try {
      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch (err) {
      console.error("[ContactForm] Error:", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`rounded-2xl bg-green-50 p-6 text-center ${className}`}>
        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <p className="font-semibold text-green-800">Mensaje enviado</p>
        <p className="text-sm text-green-600 mt-1">Te contactaremos pronto.</p>
        <button onClick={() => { setStatus("idle"); setForm({ firstName: "", email: "", phone: "", message: "" }); }} className="mt-4 text-sm text-green-700 underline hover:no-underline">
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && <h3 className={`font-bold text-[var(--color-primary)] ${compact ? "text-lg mb-2" : "text-2xl mb-3"}`}>{title}</h3>}
      {subtitle && <p className={`text-[var(--color-text-light)] ${compact ? "text-sm mb-4" : "mb-6"}`}>{subtitle}</p>}

      <form onSubmit={handleSubmit} className={`space-y-${compact ? "3" : "4"}`}>
        <div>
          <input
            type="text"
            placeholder="Nombre completo *"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className={`w-full rounded-xl border border-[var(--color-border)] bg-white px-4 ${compact ? "py-2.5 text-sm" : "py-3"} text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-shadow`}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email *"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full rounded-xl border border-[var(--color-border)] bg-white px-4 ${compact ? "py-2.5 text-sm" : "py-3"} text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-shadow`}
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Teléfono *"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`w-full rounded-xl border border-[var(--color-border)] bg-white px-4 ${compact ? "py-2.5 text-sm" : "py-3"} text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-shadow`}
          />
        </div>
        {showMessage && (
          <div>
            <textarea
              placeholder="Mensaje (opcional)"
              rows={compact ? 2 : 3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`w-full rounded-xl border border-[var(--color-border)] bg-white px-4 ${compact ? "py-2.5 text-sm" : "py-3"} text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-shadow resize-none`}
            />
          </div>
        )}
        <button
          type="submit"
          disabled={!isValid || status === "loading"}
          className={`w-full rounded-xl bg-[var(--color-accent)] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-accent-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${compact ? "py-2.5 text-sm" : "py-3"}`}
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Enviando...
            </span>
          ) : "Enviar mensaje"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-600 text-center">Hubo un error. Intenta de nuevo o escríbenos por WhatsApp.</p>
        )}
      </form>
    </div>
  );
}
