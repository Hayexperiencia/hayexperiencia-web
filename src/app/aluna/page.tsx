import Marquee from "@/components/aluna/Marquee";
import LotSelector from "@/components/aluna/LotSelector";
import Reveal from "@/components/aluna/Reveal";
import AlunaLeadForm from "@/components/aluna/AlunaLeadForm";
import { getAlunaLots } from "@/lib/aluna-inventory";

// Inventario en vivo del cotizador: SSR en cada request (la BD no es alcanzable
// en build, y el mapa debe reflejar disponibilidad real siempre).
export const dynamic = "force-dynamic";

export default async function AlunaLanding() {
  const lots = await getAlunaLots();
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
          <h1 className="al-heroin al-display text-crema text-6xl sm:text-8xl md:text-[8.5rem]" style={{ lineHeight: 0.86, animationDelay: ".08s" }}>
            El equilibrio<br /><em className="italic text-tierra-400">consciente</em>.
          </h1>
          <p className="al-heroin mt-7 max-w-xl text-lg md:text-2xl text-crema-200" style={{ animationDelay: ".16s" }}>
            El proyecto consciente para tu cuerpo, mente y espíritu. De una reunión virtual a la maloca,
            en dos minutos — en Marinilla, Oriente Antioqueño.
          </p>
          <div className="al-heroin mt-9 flex flex-wrap gap-4" style={{ animationDelay: ".24s" }}>
            <a href="#contacto" className="rounded-full bg-tierra px-8 py-4 text-base font-semibold text-verde transition hover:bg-tierra-400 hover:-translate-y-0.5">Agenda tu visita</a>
            <a href="#lotes" className="rounded-full border-2 border-crema/80 px-8 py-4 text-base font-semibold text-crema transition hover:bg-crema/10">Ver lotes disponibles</a>
          </div>
        </div>
      </section>

      {/* VIDEO PROMO */}
      <section id="video-aluna" className="scroll-mt-8 bg-crema px-6 py-16 md:px-12 md:py-20">
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
                  src="https://www.youtube-nocookie.com/embed/IciI90J9vtM?rel=0"
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

      {/* MARINILLA — pueblo moderno */}
      <section className="bg-verde px-6 py-20 md:px-12 md:py-28 text-crema">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-widest text-tierra">A minutos de tu lote</span>
            <h2 className="al-display mt-3 text-4xl md:text-6xl leading-[1.02]">
              Marinilla, tu <em className="italic text-tierra-400">pueblo moderno</em>.
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-crema-200">
              El equilibrio consciente no es renunciar a la buena vida: es tenerla al lado. Una de las
              plazas gastronómicas más vibrantes del Oriente, cultura y planes de noche — y en minutos,
              el silencio de tu reserva.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Capital gastronómica del Oriente", "Cocina de autor y de talla mundial a minutos: Marinilla se volvió el epicentro gastronómico de la región."],
              ["Vida nocturna", "Bares, cafés de especialidad, música y planes de noche. La vida social no se queda en la ciudad."],
              ["Pueblo moderno y conectado", "Autopista Medellín–Bogotá, Aeropuerto JMC a ~25 min, comercio, salud y colegios. Todo cerca."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 110} className="rounded-2xl bg-crema/5 p-6 ring-1 ring-crema/10 transition hover:-translate-y-1 hover:bg-crema/10">
                <h3 className="al-display text-2xl text-crema">{t}</h3>
                <p className="mt-2 text-crema-200">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTOR DE LOTES */}
      <LotSelector lots={lots} />

      {/* TESTIMONIOS / VALIDADORES */}
      <section className="bg-crema px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-widest text-tierra">Testimonios</span>
            <h2 className="al-display mt-3 text-4xl md:text-6xl text-verde leading-[1.02]">
              Quienes ya creen en <em className="italic text-marron">ALUNA</em>.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gris">
              Propietarios y voces del Oriente que ya eligieron el proyecto. Escúchalos.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {["F1Z1HcUPmk8", "pCQ6Q_4wflw", "_5dOljaBbdQ"].map((id, i) => (
              <Reveal key={id} delay={i * 110} className="mx-auto w-full max-w-[320px]">
                <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-verde shadow-lg ring-1 ring-verde-100">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
                    title={`Testimonio ALUNA ${i + 1}`}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PLAN DE PAGOS */}
      <section id="plan" className="bg-verde px-6 py-20 md:px-12 md:py-28 text-crema">
        <Reveal className="mx-auto max-w-4xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-tierra">Plan de pagos</span>
          <h2 className="al-display mt-3 text-5xl md:text-8xl leading-[0.95]">Aparta con <em className="italic text-tierra-400">$10.000.000</em></h2>
          <p className="mt-6 text-lg md:text-xl text-crema-200">Financiación hasta 12 meses sobre un lote que ya existe y se escritura.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/cotizador?proyecto=aluna" className="inline-block rounded-full bg-tierra px-9 py-4 text-base font-semibold text-verde transition hover:bg-tierra-400 hover:-translate-y-0.5">Calcula tu plan de pagos</a>
            <a href="#contacto" className="inline-block rounded-full border-2 border-crema/80 px-9 py-4 text-base font-semibold text-crema transition hover:bg-crema/10">Agenda tu visita</a>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/aluna-blanco.png" alt="ALUNA Campestre" className="mx-auto mt-14 h-20 w-auto opacity-95" />
        </Reveal>
      </section>

      {/* CONTACTO / LEAD (GHL + UTM + pixel ALUNA) */}
      <section id="contacto" className="scroll-mt-8 bg-crema-50 px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-widest text-tierra">Da el paso</span>
            <h2 className="al-display mt-3 text-4xl md:text-6xl text-verde leading-[1.02]">
              Vive el equilibrio <em className="italic text-marron">consciente</em>.
            </h2>
            <p className="mt-4 max-w-md text-lg text-gris">
              Déjanos tus datos y un asesor de ALUNA te contacta hoy para agendar tu visita. Sin compromiso.
            </p>
            <ul className="mt-6 space-y-2.5 text-verde">
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-tierra" /> Entrega inmediata y escrituración</li>
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-tierra" /> Lotes desde 2.500 m² · aparta con $10.000.000</li>
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-tierra" /> Respaldo Fideicomiso Credicorp · Bancolombia</li>
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <AlunaLeadForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
