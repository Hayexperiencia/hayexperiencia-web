"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type Photo = { src: string; caption: string };

// Orden curado: portería y vías reales primero (obra 2026), luego el entorno.
const PHOTOS: Photo[] = [
  { src: "/images/aluna-gallery/g9.jpg", caption: "La portería, ya construida" },
  { src: "/images/aluna-gallery/g10.jpg", caption: "Vías pavimentadas entre los lotes" },
  { src: "/images/aluna-gallery/g11.jpg", caption: "ALUNA en el Oriente antioqueño" },
  { src: "/images/aluna-gallery/g1.jpg", caption: "El proyecto desde el aire" },
  { src: "/images/aluna-gallery/g2.jpg", caption: "Bosque y reserva natural" },
  { src: "/images/aluna-gallery/g5.jpg", caption: "12.000 m² de reserva" },
  { src: "/images/aluna-gallery/g3.jpg", caption: "Loteo y entorno" },
  { src: "/images/aluna-gallery/g4.jpg", caption: "Naturaleza que te rodea" },
  { src: "/images/aluna-gallery/g6.jpg", caption: "Vida campestre en Marinilla" },
  { src: "/images/aluna-gallery/g7.jpg", caption: "Verde en cada rincón" },
  { src: "/images/aluna-gallery/g8.jpg", caption: "Colinas del Oriente" },
];

export default function AlunaGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // scroll-lock del fondo
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, go]);

  return (
    <>
      {/* Grid mosaico: la portería (primera) es la pieza destacada */}
      <div className="grid grid-cols-2 gap-3 md:auto-rows-[190px] md:grid-cols-4 md:gap-4">
        {PHOTOS.map((p, i) => (
          <button
            key={p.src}
            onClick={() => setOpen(i)}
            aria-label={`Ampliar: ${p.caption}`}
            className={`group relative overflow-hidden rounded-2xl bg-verde-100 ring-1 ring-verde-100 ${
              i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[4/3] md:aspect-auto"
            }`}
          >
            <Image
              src={p.src}
              alt={p.caption}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              priority={i === 0}
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-verde/85 to-transparent p-3 pt-8 text-left text-sm font-medium text-crema opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {p.caption}
            </span>
          </button>
        ))}
      </div>

      {/* LIGHTBOX (en portal a document.body para escapar del transform de Lenis) */}
      {open !== null && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[120] flex h-[100dvh] flex-col bg-verde/95 backdrop-blur-sm"
          onClick={close}
        >
          <div className="flex items-center justify-between px-5 py-4 text-crema" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-medium tabular-nums">{open + 1} / {PHOTOS.length}</span>
            <button
              onClick={close}
              aria-label="Cerrar"
              className="rounded-full bg-crema/15 px-4 py-1.5 text-sm font-semibold backdrop-blur transition hover:bg-crema/25"
            >
              Cerrar ✕
            </button>
          </div>

          <div
            className="relative min-h-0 flex-1"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <Image
              src={PHOTOS[open].src}
              alt={PHOTOS[open].caption}
              fill
              sizes="100vw"
              priority
              className="object-contain px-4"
            />
            <button
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-crema/12 text-2xl text-crema backdrop-blur transition hover:bg-crema/25 md:left-6"
            >
              ‹
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Foto siguiente"
              className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-crema/12 text-2xl text-crema backdrop-blur transition hover:bg-crema/25 md:right-6"
            >
              ›
            </button>
          </div>

          <p className="px-5 pt-3 text-center text-base text-crema md:text-lg" onClick={(e) => e.stopPropagation()}>
            {PHOTOS[open].caption}
          </p>

          <div className="flex gap-2 overflow-x-auto px-5 py-4" onClick={(e) => e.stopPropagation()}>
            {PHOTOS.map((p, i) => (
              <button
                key={p.src}
                onClick={() => setOpen(i)}
                aria-label={`Ver: ${p.caption}`}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                  i === open ? "ring-tierra" : "ring-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={p.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
