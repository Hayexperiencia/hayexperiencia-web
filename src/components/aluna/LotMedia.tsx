"use client";
import { useState } from "react";
import Image from "next/image";

// Acepta id de 11 chars, youtu.be/, shorts/, watch?v=, embed/
function ytId(url: string): string | null {
  if (/^[\w-]{11}$/.test(url)) return url;
  const m = url.match(/(?:youtu\.be\/|shorts\/|watch\?v=|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export default function LotMedia({
  images,
  video,
  alt,
  fallbackHref,
  onFallback,
}: {
  images: string[];
  video?: string;
  alt: string;
  fallbackHref: string;
  onFallback?: () => void;
}) {
  const [i, setI] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const imgs = images.length ? images : ["/images/aluna-hero-poster.jpg"];
  const n = imgs.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);
  const yt = video ? ytId(video) : null;

  if (showVideo && video) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-verde">
        {yt ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
            title={`Recorrido aéreo — ${alt}`}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video className="absolute inset-0 h-full w-full object-cover" src={video} controls autoPlay playsInline />
        )}
        <button
          onClick={() => setShowVideo(false)}
          className="absolute left-3 top-3 rounded-full bg-verde/90 px-3 py-1.5 text-xs font-semibold text-crema backdrop-blur transition hover:bg-verde"
        >
          ‹ Volver a fotos
        </button>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-verde-100">
      {imgs.map((src, idx) => (
        <Image
          key={idx}
          src={src}
          alt={alt}
          fill
          sizes="(max-width:768px) 100vw, 720px"
          priority={idx === 0}
          className={`object-cover transition-opacity duration-500 ${idx === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {n > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-verde/70 text-lg text-crema backdrop-blur transition hover:bg-verde"
          >
            ‹
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-verde/70 text-lg text-crema backdrop-blur transition hover:bg-verde"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {imgs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Ir a la foto ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-crema" : "w-1.5 bg-crema/50"}`}
              />
            ))}
          </div>
        </>
      )}

      {video ? (
        <button
          onClick={() => setShowVideo(true)}
          className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-verde/90 px-4 py-2 text-sm font-semibold text-crema backdrop-blur transition hover:bg-verde"
        >
          ▶ Recorrido aéreo
        </button>
      ) : (
        <a
          href={fallbackHref}
          onClick={onFallback}
          className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-verde/90 px-4 py-2 text-sm font-semibold text-crema backdrop-blur transition hover:bg-verde"
        >
          ▶ Recorrido aéreo
        </a>
      )}
    </div>
  );
}
