import Reveal from "@/components/aluna/Reveal";

// Banda CTA intermedia hacia el formulario (#contacto). La página es larga;
// estos cortes recuerdan el paso a dar sin tener que llegar hasta el final.
export default function AlunaCTA({ text }: { text: string }) {
  return (
    <section className="bg-crema px-6 py-14 md:px-12">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl bg-verde px-8 py-10 text-center text-crema md:flex-row md:justify-between md:gap-8 md:text-left">
        <p className="al-display text-2xl leading-snug md:text-3xl">{text}</p>
        <a
          href="#contacto"
          className="shrink-0 rounded-full bg-tierra px-8 py-4 text-base font-semibold text-verde transition hover:-translate-y-0.5 hover:bg-tierra-400"
        >
          Agenda tu visita
        </a>
      </Reveal>
    </section>
  );
}
