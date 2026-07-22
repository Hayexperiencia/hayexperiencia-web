"use client";
import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/aluna/Reveal";
import { lots, cop, elementLabel, type Lot } from "@/lib/aluna-lots";

const WA = (code: string) =>
  "https://wa.me/573137939382?text=" +
  encodeURIComponent(`Hola, me interesa el ${code} de ALUNA. ¿Podemos agendar una visita?`);

const elementColor: Record<Lot["element"], string> = {
  LUZ: "bg-tierra text-verde",
  BOSQUE: "bg-verde-500 text-crema",
  AGUA: "bg-verde-600 text-crema",
  AIRE: "bg-crema-200 text-verde",
  "—": "bg-gris/20 text-gris",
};

export default function LotSelector() {
  const [sel, setSel] = useState<Lot | null>(null);
  const disponibles = lots.filter((l) => l.status === "disponible").length;

  return (
    <section id="lotes" className="bg-crema-50 px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-widest text-tierra">Elige tu lote</span>
          <h2 className="al-display mt-3 text-4xl md:text-6xl text-verde leading-[1.02]">
            {disponibles} lotes disponibles. Cada uno, un elemento.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-gris">
            Selecciona un lote para ver su hoja de vida: fotos, recorrido, plano y ficha técnica — antes de cotizar.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lots.map((l, i) => {
            const sold = l.status === "vendido";
            return (
              <Reveal key={l.code} delay={(i % 3) * 90}>
                <button
                  onClick={() => !sold && setSel(l)}
                  disabled={sold}
                  className={`group w-full text-left overflow-hidden rounded-2xl bg-crema shadow-sm transition ${
                    sold ? "opacity-55 cursor-not-allowed" : "hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <div className="relative h-44 w-full overflow-hidden bg-verde-100">
                    <Image
                      src={l.image || ""}
                      alt={l.code}
                      fill
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${elementColor[l.element]}`}>
                      {sold ? "Vendido" : elementLabel[l.element]}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-xl font-bold text-verde">{l.code}</h3>
                      <span className="text-sm text-gris">{l.area.toLocaleString("es-CO")} m²</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-marron">{cop(l.price)}</p>
                    {!sold && (
                      <span className="mt-3 inline-block text-sm font-semibold text-tierra group-hover:underline">
                        Ver hoja de vida →
                      </span>
                    )}
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* HOJA DE VIDA */}
      {sel && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8"
          style={{ background: "rgba(41,55,28,.8)" }}
          onClick={() => setSel(null)}
        >
          <div className="w-full max-w-3xl rounded-3xl bg-crema p-6 md:p-8 my-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${elementColor[sel.element]}`}>
                  Elemento {elementLabel[sel.element]}
                </span>
                <h3 className="al-display mt-3 text-4xl text-verde">{sel.code}</h3>
                <p className="al-display mt-1 text-2xl text-marron">{cop(sel.price)}</p>
              </div>
              <button onClick={() => setSel(null)} className="rounded-full bg-verde/10 px-4 py-2 text-verde font-semibold transition hover:bg-verde/20">
                Cerrar
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="relative col-span-3 sm:col-span-2 h-56 overflow-hidden rounded-2xl bg-verde-100">
                <Image src={sel.image || ""} alt={sel.code} fill sizes="(max-width:640px) 100vw, 66vw" className="object-cover" />
              </div>
              <div className="hidden sm:flex h-56 flex-col gap-3">
                <div className="flex-1 rounded-2xl bg-verde/5 flex items-center justify-center text-center text-sm text-gris">+ Fotos<br />del lote</div>
                <div className="flex-1 rounded-2xl bg-verde flex items-center justify-center text-crema text-sm font-semibold">▶ Recorrido</div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-tierra">Ficha técnica</h4>
                <dl className="mt-3 divide-y divide-verde-100">
                  {[
                    ["Código", sel.code],
                    ["Elemento", elementLabel[sel.element]],
                    ["Área", `${sel.area.toLocaleString("es-CO")} m²`],
                    ["Precio", cop(sel.price)],
                    ["Estado", "Disponible"],
                    ["Entrega", "Inmediata · escriturado"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2.5">
                      <dt className="text-gris">{k}</dt>
                      <dd className="font-semibold text-verde">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-tierra">Plano del lote</h4>
                <div className="mt-3 h-40 rounded-2xl border-2 border-dashed border-verde-200 bg-crema-50 flex items-center justify-center text-center text-sm text-gris">
                  Plano {sel.code}<br />(DWG/PDF disponible)
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/cotizador?proyecto=aluna" className="rounded-full bg-tierra px-7 py-3 font-semibold text-verde transition hover:bg-tierra-400">Cotizar este lote</a>
              <a href={WA(sel.code)} className="rounded-full border-2 border-verde px-7 py-3 font-semibold text-verde transition hover:bg-verde/5">Agenda por WhatsApp</a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
