"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface GalleryImage {
  url: string;
  alt?: string;
  title?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  virtualTourUrl?: string;
  videoUrl?: string;
  className?: string;
}

export default function Gallery({ images, virtualTourUrl, videoUrl, className = "" }: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const touchStartX = useRef(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goTo = useCallback((index: number) => {
    setCurrentIndex((index + images.length) % images.length);
  }, [images.length]);

  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, prev, next]);

  useEffect(() => {
    if (lightboxOpen && thumbsRef.current) {
      const thumb = thumbsRef.current.children[currentIndex] as HTMLElement;
      if (thumb) thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentIndex, lightboxOpen]);

  // Autoplay del hero: la foto principal rota sola; pausa al pasar el mouse o con el lightbox abierto.
  useEffect(() => {
    if (images.length < 2 || lightboxOpen || heroPaused) return;
    const id = setInterval(() => setHeroIndex((i) => (i + 1) % images.length), 4500);
    return () => clearInterval(id);
  }, [images.length, lightboxOpen, heroPaused]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  if (!images.length) {
    return (
      <div className="aspect-[16/9] rounded-2xl bg-gray-100 flex items-center justify-center">
        <p className="text-sm text-[var(--color-text-light)]">Fotos próximamente</p>
      </div>
    );
  }

  const side = images.slice(1, 5);
  const remaining = images.length - 5;

  return (
    <div className={className}>
      {/* Grid: main left + 4 thumbnails right */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 rounded-2xl overflow-hidden">
        <button
          onClick={() => openLightbox(heroIndex)}
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
          className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto overflow-hidden group cursor-pointer"
        >
          {images.map((img, i) => (
            <Image
              key={i}
              src={img.url}
              alt={img.alt || "Foto principal"}
              fill
              className={`object-cover transition-opacity duration-700 ${i === heroIndex ? "opacity-100" : "opacity-0"}`}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
          ))}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
              {images.length <= 8 ? (
                <div className="flex gap-1.5">
                  {images.map((_, i) => (
                    <span key={i} className={`h-1.5 rounded-full transition-all ${i === heroIndex ? "w-5 bg-white" : "w-1.5 bg-white/60"}`} />
                  ))}
                </div>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium">{heroIndex + 1} / {images.length}</span>
              )}
            </div>
          )}
        </button>
        {side.map((img, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i + 1)}
            className="hidden md:block relative aspect-[4/3] overflow-hidden group cursor-pointer"
          >
            <Image src={img.url} alt={img.alt || `Foto ${i + 2}`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="25vw" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            {i === 3 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">+{remaining}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Action bar below gallery */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={() => openLightbox(0)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-primary)] hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Ver {images.length} fotos
        </button>
        {virtualTourUrl && (
          <a
            href={virtualTourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-primary)] hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Tour Virtual
          </a>
        )}
        {videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-primary)] hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Video
          </a>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95"
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Cerrar">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors" aria-label="Anterior">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors" aria-label="Siguiente">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          <div className="relative w-full max-w-5xl mx-auto px-16" style={{ maxHeight: "80vh" }}>
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].alt || `Foto ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain w-full h-auto max-h-[75vh] rounded-lg"
              priority
            />
            {images[currentIndex].title && (
              <p className="text-center text-white/80 text-sm mt-3">{images[currentIndex].title}</p>
            )}
          </div>

          <div ref={thumbsRef} className="flex gap-2 mt-4 px-4 overflow-x-auto max-w-full pb-2" style={{ scrollbarWidth: "none" }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all ${i === currentIndex ? "ring-2 ring-[var(--color-accent)] opacity-100" : "opacity-50 hover:opacity-80"}`}
              >
                <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
