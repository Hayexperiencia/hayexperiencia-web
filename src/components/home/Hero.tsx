import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-primary)] leading-tight">
              Tu sueño,{" "}
              <span className="relative">
                nuestra experiencia
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-[var(--color-accent)] opacity-40 rounded"></span>
              </span>
            </h1>
            <p className="mt-6 text-lg text-[var(--color-text-light)] max-w-lg">
              Lotes, casas, apartamentos y fincas en el Oriente Antioqueño.
              Te acompañamos a encontrar el lugar perfecto para tu próximo proyecto.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/images/hero-oriente.jpg"
              alt="Paisaje del Oriente Antioqueño"
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
