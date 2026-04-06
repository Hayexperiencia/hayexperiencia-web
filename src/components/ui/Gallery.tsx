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

type Tab = "fotos" | "tour" | "video";

export default function Gallery({ images, virtualTourUrl, videoUrl, className = "" }: GalleryProps) {
  const [activeTab, setActiveTab] = useState<Tab>("fotos");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const hasTabs = !!virtualTourUrl || !!videoUrl;

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

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  if (!images.length) return null;

  return (
    <div className={className}>
      {/* Tabs */}
      {hasTabs && (
        <div className="flex gap-1 mb-3">
          <button onClick={() => setActiveTab("fotos")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "fotos" ? "bg-[var(--color-primary)] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            Fotos ({images.length})
          </button>
          {virtualTourUrl && (
            <button onClick={() => setActiveTab("tour")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "tour" ? "bg-[var(--color-primary)] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              Tour Virtual
            </button>
          )}
          {videoUrl && (
            <button onClick={() => setActiveTab("video")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "video" ? "bg-[var(--color-primary)] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              Video
            </button>
          )}
        </div>
      )}

      {/* Tour Virtual */}
      {activeTab === "tour" && virtualTourUrl && (
        <div className="aspect-video rounded-2xl overflow-hidden">
          <iframe src={virtualTourUrl} className="w-full h-full" allowFullScreen title="Tour Virtual" />
        </div>
      )}

      {/* Video */}
      {activeTab === "video" && videoUrl && (
        <div className="aspect-video rounded-2xl overflow-hidden">
          <iframe src={videoUrl.replace("watch?v=", "embed/")} className="w-full h-full" allowFullScreen title="Video" />
        </div>
      )}

      {/* Photo Grid */}
      {activeTab === "fotos" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
          {images.slice(0, 7).map((img, i) => (
            <button
              key={i}
              onClick={() => openLightbox(i)}
              className={`relative overflow-hidden group ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              style={{ aspectRatio: i === 0 ? "4/3" : "3/2" }}
            >
              <Image
                src={img.url}
                alt={img.alt || `Foto ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium flex items-center gap-1.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                  {i === 0 && images.length > 7 ? `Ver todas (${images.length})` : ""}
                </span>
              </div>
              {i === 6 && images.length > 7 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">+{images.length - 7} mas</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close */}
          <button onClick={closeLightbox} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Cerrar">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Arrows */}
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors" aria-label="Anterior">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors" aria-label="Siguiente">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Main image */}
          <div className="relative w-full max-w-5xl mx-auto px-16" style={{ maxHeight: "85vh" }}>
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

          {/* Thumbnails */}
          <div ref={thumbsRef} className="flex gap-2 mt-4 px-4 overflow-x-auto max-w-full pb-2 scrollbar-hide">
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
