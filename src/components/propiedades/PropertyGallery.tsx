"use client";

import Image from "next/image";
import { useState } from "react";
import { WasiImage } from "@/lib/types";

export default function PropertyGallery({ images }: { images: WasiImage[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!images.length) {
    return (
      <div className="aspect-[16/9] rounded-2xl bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Image src="/logos/isotipo.svg" alt="" width={64} height={64} className="mx-auto opacity-20" />
          <p className="mt-2 text-sm text-[var(--color-text-light)]">Fotos próximamente</p>
        </div>
      </div>
    );
  }

  const main = images[0];
  const thumbs = images.slice(1, 5);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
        {/* Main image */}
        <div
          className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto cursor-pointer"
          onClick={() => setLightbox(0)}
        >
          <Image
            src={main.url}
            alt={main.description || "Foto principal"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        {/* Thumbnails */}
        {thumbs.map((img, i) => (
          <div
            key={i}
            className="hidden md:block relative aspect-[4/3] cursor-pointer"
            onClick={() => setLightbox(i + 1)}
          >
            <Image
              src={img.url}
              alt={img.description || `Foto ${i + 2}`}
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
        ))}
        {images.length > 5 && (
          <button
            onClick={() => setLightbox(0)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] shadow"
          >
            Ver las {images.length} fotos
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setLightbox(null)}>&times;</button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.max(0, lightbox - 1)); }}
          >
            &#8249;
          </button>
          <div className="relative w-full max-w-4xl aspect-[4/3] mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightbox].url}
              alt={images[lightbox].description || `Foto ${lightbox + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.min(images.length - 1, lightbox + 1)); }}
          >
            &#8250;
          </button>
          <p className="absolute bottom-4 text-white text-sm">{lightbox + 1} de {images.length}</p>
        </div>
      )}
    </>
  );
}
