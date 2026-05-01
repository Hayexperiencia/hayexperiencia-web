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
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[100] rounded-xl bg-white shadow-2xl border border-gray-200 p-5">
      <p className="text-sm text-gray-700 leading-relaxed">
        Hay Experiencia usa cookies para mejorar tu experiencia y entender qué propiedades te interesan.
        Al continuar aceptas el uso de Google Analytics y Meta Pixel.{" "}
        <Link href="/privacidad" className="underline text-[var(--color-primary)]">
          Política de privacidad
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-3 justify-end">
        <button
          onClick={() => choose("essential")}
          className="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Solo necesarias
        </button>
        <button
          onClick={() => choose("accepted")}
          className="text-sm px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
