"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

const PHOTOS = Array.from({ length: 8 }, (_, i) => `/images/aluna-gallery/g${i + 1}.jpg`);

export default function AlunaGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (d: number) => setOpen((p) => (p === null ? null : (p + d + PHOTOS.length) % PHOTOS.length)),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, go]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:auto-rows-[190px] md:grid-cols-4 md:gap-4">
        {PHOTOS.map((src, i) => (
          <button
            key={src}
            onClick={() => setOpen(i)}
            aria-label={`Ampliar foto ${i + 1} de ALUNA`}
            className={`group relative overflow-hidden rounded-2xl bg-verde-100 ring-1 ring-verde-100 ${
              i === 0
                ? "col-span-2 row-span-2 aspect-square md:aspect-auto"
                : "aspect-[4/3] md:aspect-auto"
            }`}
          >
            <Image
              src={src}
              alt={`Vista aérea de ALUNA Campestre y su entorno natural en Marinilla ${i + 1}`}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-0 bg-verde/0 transition duration-500 group-hover:bg-verde/10" />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
          style={{ background: "rgba(41,55,28,.93)" }}
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-crema/15 px-4 py-2 text-sm font-semibold text-crema backdrop-blur transition hover:bg-crema/25"
          >
            Cerrar
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Foto anterior"
            className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-crema/15 text-2xl text-crema backdrop-blur transition hover:bg-crema/25 md:left-6"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Foto siguiente"
            className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-crema/15 text-2xl text-crema backdrop-blur transition hover:bg-crema/25 md:right-6"
          >
            ›
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={PHOTOS[open]}
              alt={`Vista aérea de ALUNA Campestre ${open + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
