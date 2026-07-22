import Marquee from "@/components/aluna/Marquee";
import LotSelector from "@/components/aluna/LotSelector";
import Reveal from "@/components/aluna/Reveal";

const WA = "https://wa.me/573137939382?text=" +
  encodeURIComponent("Hola, quiero conocer ALUNA y agendar una visita.");

export default function AlunaLanding() {
  return (
    <div style={{ background: "var(--color-crema)" }}>
      <div className="al-grain" aria-hidden />

      {/* HERO — V3 alto contraste */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/aluna-hero-poster.jpg"
            className="h-full w-full object-cover"
          >
            <source src="/videos/aluna-hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0" aria-hidden style={{ background: "linear-gradient(100deg, rgba(41,55,28,.92) 0%, rgba(41,55,28,.55) 38%, rgba(41,55,28,.12) 72%, rgba(41,55,28,0) 100%)" }} />
        <div aria-hidden className="al-float pointer-events-none absolute -right-24 top-8 h-[440px] w-[440px] rounded-full border border-tierra/25" />
        <div aria-hidden className="al-float pointer-events-none absolute right-28 top-44 h-[230px] w-[230px] rounded-full border border-crema/12" style={{ animationDelay: "1.5s" }} />

        <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/aluna-blanco.png" alt="ALUNA Campestre" className="h-16 md:h-20 w-auto al-heroin" />
          <span className="hidden md:inline-block al-heroin rounded-full border-2 border-crema/80 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-crema" style={{ animationDelay: ".1s" }}>
            Entrega inmediata
          </span>
        </header>

        <div className="relative z-10 px-6 pb-20 md:px-12 md:pb-28 max-w-4xl">
          <div className="al-heroin text-sm font-semibold uppercase tracking-[0.28em] text-tierra mb-6">Marinilla · Entrega inmediata</div>
          <h1 className="al-heroin al-display text-crema text-7xl md:text-[9.5rem]" style={{ lineHeight: 0.85, animationDelay: ".08s" }}>
            Ten las<br /><em className="italic text-tierra-400">dos</em> vidas.
          </h1>
          <p className="al-heroin mt-7 max-w-xl text-lg md:text-2xl text-crema-200" style={{ animationDelay: ".16s" }}>
            El proyecto consciente para tu cuerpo, mente y espíritu. De una reunión virtual a la maloca,
            en dos minutos — en Marinilla, Oriente Antioqueño.
          </p>
          <div className="al-heroin mt-9 flex flex-wrap gap-4" style={{ animationDelay: ".24s" }}>
            <a href={WA} className="rounded-full bg-tierra px-8 py-4 text-base font-semibold text-verde transition hover:bg-tierra-400 hover:-translate-y-0.5">Agenda tu visita</a>
            <a href="#lotes" className="rounded-full border-2 border-crema/80 px-8 py-4 text-base font-semibold text-crema transition hover:bg-crema/10">Ver lotes disponibles</a>
          </div>
        </div>
      </section>

      {/* VIDEO PROMO */}
      <section className="bg-crema px-6 py-16 md:px-12 md:py-20">
        <Reveal className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-5 md:items-center">
            <div className="md:col-span-2">
              <span className="text-sm font-semibold uppercase tracking-widest text-tierra">Conócelo de mi voz</span>
              <h2 className="al-display mt-3 text-4xl md:text-5xl text-verde leading-[1.05]">Te cuento por qué ALUNA es distinto</h2>
              <p className="mt-4 text-gris">Un recorrido corto por el proyecto: la portería, el bosque, el coworking y la maloca — y por qué ya es una realidad.</p>
            </div>
            <div className="md:col-span-3">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-verde shadow-lg">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube-nocookie.com/embed/8IQI6uGWI2c?rel=0"
                  title="ALUNA Campestre — video del proyecto"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* MARQUEE */}
      <Marquee />

      {/* YA ES REAL */}
      <section className="bg-crema px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-widest text-tierra">Ya no es un sueño</span>
            <h2 className="al-display mt-3 text-4xl md:text-6xl text-verde leading-[1.02]">Es hoy. Lotes listos para caminar y escriturar.</h2>
            <p className="mt-5 max-w-2xl text-lg text-gris">
              A diferencia de los proyectos sobre planos, ALUNA ya está construido: vías pavimentadas, reserva
              natural de 12.000 m², coworking con Starlink y portería 24/7. Escrituración inmediata, con respaldo
              de Fideicomiso Credicorp y Alianza Bancolombia.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Coworking con Starlink", "Trabaja hiperconectado sin renunciar a nada."],
              ["12.000 m² de reserva", "Cierra el portátil y respira en minutos."],
              ["Entrega inmediata", "Ya existe. Ven y camínalo hoy."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 110} className="rounded-2xl bg-crema-50 p-6 transition hover:-translate-y-1 hover:shadow-md">
                <h3 className="al-display text-2xl text-verde">{t}</h3>
                <p className="mt-2 text-gris">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTOR DE LOTES */}
      <LotSelector />

      {/* PLAN DE PAGOS */}
      <section id="plan" className="bg-verde px-6 py-20 md:px-12 md:py-28 text-crema">
        <Reveal className="mx-auto max-w-4xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-tierra">Plan de pagos</span>
          <h2 className="al-display mt-3 text-5xl md:text-8xl leading-[0.95]">Aparta con <em className="italic text-tierra-400">$10.000.000</em></h2>
          <p className="mt-6 text-lg md:text-xl text-crema-200">Financiación hasta 12 meses sobre un lote que ya existe y se escritura.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/cotizador?proyecto=aluna" className="inline-block rounded-full bg-tierra px-9 py-4 text-base font-semibold text-verde transition hover:bg-tierra-400 hover:-translate-y-0.5">Calcula tu plan de pagos</a>
            <a href={WA} className="inline-block rounded-full border-2 border-crema/80 px-9 py-4 text-base font-semibold text-crema transition hover:bg-crema/10">Agenda tu visita</a>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/aluna-blanco.png" alt="ALUNA Campestre" className="mx-auto mt-14 h-20 w-auto opacity-95" />
        </Reveal>
      </section>
    </div>
  );
}
