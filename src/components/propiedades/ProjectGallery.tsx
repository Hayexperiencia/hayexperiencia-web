"use client";

import Image from "next/image";
import { useState } from "react";

interface ProjectGalleryProps {
  images: { src: string; alt: string }[];
  title?: string;
}

export default function ProjectGallery({ images, title = "Galeria del proyecto" }: ProjectGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!images.length) return null;

  return (
    <>
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">{title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setLightbox(i)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white text-3xl z-10" onClick={() => setLightbox(null)}>&times;</button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10"
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.max(0, lightbox - 1)); }}
          >
            &#8249;
          </button>
          <div className="relative w-full max-w-5xl aspect-[4/3] mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10"
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
