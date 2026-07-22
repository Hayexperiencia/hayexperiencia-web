"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "hei_cookie_consent";
const VERSION = "v1";

type Choice = "accepted" | "essential";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved || !saved.startsWith(VERSION)) setVisible(true);
  }, []);

  const choose = (c: Choice) => {
    localStorage.setItem(STORAGE_KEY, `${VERSION}:${c}:${Date.now()}`);
    setVisible(false);
    window.dispatchEvent(new CustomEvent("hei-cookie-consent", { detail: c }));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center">
        <p className="flex-1 text-xs leading-snug text-gray-700 sm:text-sm">
          Hay Experiencia usa cookies para mejorar tu experiencia y entender qué propiedades te interesan.
          Al continuar aceptas el uso de Google Analytics y Meta Pixel.{" "}
          <Link href="/privacidad" className="underline text-[var(--color-primary)]">
            Política de privacidad
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2 sm:justify-end">
          <button
            onClick={() => choose("essential")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Solo necesarias
          </button>
          <button
            onClick={() => choose("accepted")}
            className="rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-light)]"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
