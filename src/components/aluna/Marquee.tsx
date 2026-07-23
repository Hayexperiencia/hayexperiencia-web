const RAZONES = [
  "Entrega inmediata",
  "Escrituración inmediata",
  "Lotes desde 2.500 m²",
  "Vías pavimentadas",
  "Reserva natural de 12.000 m²",
  "Coworking con Starlink",
  "Portería 24/7",
  "Respaldo Fideicomiso Credicorp",
  "Alianza Bancolombia",
  "A 10 min de Marinilla",
  "Marinilla, capital gastronómica",
  "Vida nocturna y cultura",
  "Alta valorización",
  "Aparta con $10.000.000",
  "Financiación hasta 12 meses",
  "Pet-friendly",
  "Maloca de meditación",
  "Senderos ecológicos",
];

export default function Marquee() {
  const items = [...RAZONES, ...RAZONES];
  return (
    <section className="bg-verde py-6 overflow-hidden">
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee gap-4 pr-4">
          {items.map((r, i) => (
            <span
              key={i}
              className="flex items-center gap-3 whitespace-nowrap rounded-full border border-tierra/40 px-6 py-3 text-crema"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-tierra" />
              <span className="text-base font-medium">{r}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
