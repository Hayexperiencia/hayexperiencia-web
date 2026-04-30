import Image from "next/image";

type HeroProps = {
  headline?: string | null;
  subhead?: string | null;
  imageSrc?: string;
  imageAlt?: string;
};

export default function Hero({ headline, subhead, imageSrc, imageAlt }: HeroProps = {}) {
  const fullHeadline = headline ?? "Tu sueño, nuestra experiencia";
  // Split headline at last word/phrase for the accent underline (defaults: "nuestra experiencia")
  const accentMatch = fullHeadline.match(/^(.+?)(\s\S+\s+\S+)\s*$/);
  const headlineMain = accentMatch ? accentMatch[1] : fullHeadline;
  const headlineAccent = accentMatch ? accentMatch[2].trim() : "";

  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-primary)] leading-tight">
              {headlineMain}
              {headlineAccent && (
                <>
                  {" "}
                  <span className="relative">
                    {headlineAccent}
                    <span className="absolute -bottom-1 left-0 w-full h-2 bg-[var(--color-accent)] opacity-40 rounded"></span>
                  </span>
                </>
              )}
            </h1>
            <p className="mt-6 text-lg text-[var(--color-text-light)] max-w-lg">
              {subhead ??
                "Lotes, casas, apartamentos y fincas en el Oriente Antioqueño. Te acompañamos a encontrar el lugar perfecto para tu próximo proyecto."}
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={imageSrc ?? "/images/hero-oriente.jpg"}
              alt={imageAlt ?? "Paisaje del Oriente Antioqueño"}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
