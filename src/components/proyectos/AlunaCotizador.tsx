'use client';

import { useState, useMemo } from 'react';

type Estado = 'disponible' | 'reservado' | 'vendido';

// Datos reales de ALUNA — actualizado abril 2026
const LOTES = [
  { id: 4,  area: 2500.00, precio: 498151819, estado: 'disponible' as Estado, tipo: 'Luz',    label: 'Lote 4' },
  { id: 5,  area: 2500.00, precio: 498151819, estado: 'disponible' as Estado, tipo: 'Luz',    label: 'Lote 5' },
  { id: 14, area: 2504.97, precio: 459340208, estado: 'disponible' as Estado, tipo: 'Luz',    label: 'Lote 14' },
  { id: 16, area: 2547.93, precio: 507280602, estado: 'disponible' as Estado, tipo: 'Luz',    label: 'Lote 16' },
  { id: 19, area: 2620.35, precio: 410865215, estado: 'disponible' as Estado, tipo: 'Bosque', label: 'Lote 19' },
  { id: 20, area: 2627.30, precio: 480697680, estado: 'disponible' as Estado, tipo: 'Bosque', label: 'Lote 20' },
  { id: 21, area: 2507.99, precio: 499673600, estado: 'disponible' as Estado, tipo: 'Bosque', label: 'Lote 21' },
  { id: 29, area: 2500.33, precio: 498214671, estado: 'disponible' as Estado, tipo: 'Bosque', label: 'Lote 29' },
  { id: 36, area: 2500.25, precio: 636369422, estado: 'disponible' as Estado, tipo: 'Aire',   label: 'Lote 36' },
];

const LOTES_VENDIDOS = 30; // De 39 lotes totales

const CONFIG = {
  valorizacionAnual: 0.07,    // 7% anual
  descuentoContado: 0.05,     // 5% descuento contado
  separación: 5000000,        // $5M de separación
  cuotaInicialPct: 0.30,      // 30% antes de noviembre
  créditoPct: 0.70,           // 70% crédito bancario en diciembre
  plazoCredito: 'Diciembre 2026',
};

type TabPago = 'contado' | 'cuotas' | 'crédito';

const ESTADO_COLORS: Record<Estado, string> = {
  disponible: 'bg-green-500',
  reservado: 'bg-yellow-500',
  vendido: 'bg-gray-400',
};

const ESTADO_LABELS: Record<Estado, string> = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido',
};

function formatCOP(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-CO');
}

export default function AlunaCotizador() {
  const [selected, setSelected] = useState<number | null>(null);
  const [tabPago, setTabPago] = useState<TabPago>('contado');
  const [tasaEA, setTasaEA] = useState(12);
  const [plazoCredito, setPlazoCredito] = useState(15);
  const [downloading, setDownloading] = useState(false);

  const lote = selected !== null ? LOTES.find(l => l.id === selected) : null;

  const planPagos = useMemo(() => {
    if (!lote) return [];
    const separación = CONFIG.separación;
    const cuotaInicial30 = lote.precio * CONFIG.cuotaInicialPct;
    const saldo30 = cuotaInicial30 - separación;
    const crédito70 = lote.precio * CONFIG.créditoPct;
    // Distribuir el 30% (menos separación) en cuotas mensuales hasta noviembre (aprox 7 meses)
    const mesesHastaNov = 7;
    const cuotaMensual = saldo30 / mesesHastaNov;
    const rows = [];
    let saldo = lote.precio;
    rows.push({ mes: 'Hoy', concepto: 'Separacion', valor: separación, saldo: saldo -= separación });
    for (let i = 1; i <= mesesHastaNov; i++) {
      rows.push({ mes: `Mes ${i}`, concepto: `Cuota ${i}`, valor: cuotaMensual, saldo: saldo -= cuotaMensual });
    }
    rows.push({ mes: 'Dic 2026', concepto: 'Credito bancario (70%)', valor: crédito70, saldo: 0 });
    return rows;
  }, [lote]);

  const cuotaCredito = useMemo(() => {
    if (!lote) return 0;
    const r = Math.pow(1 + tasaEA / 100, 1 / 12) - 1;
    const n = plazoCredito * 12;
    const P = lote.precio * 0.7; // 70% financiado
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [lote, tasaEA, plazoCredito]);

  const valorizacion = useMemo(() => {
    if (!lote) return [];
    return Array.from({ length: 5 }, (_, i) => ({
      year: i + 1,
      valor: lote.precio * Math.pow(1 + CONFIG.valorizacionAnual, i + 1),
    }));
  }, [lote]);

  async function handleDownloadPdf() {
    if (!lote) return;
    setDownloading(true);
    try {
      const pdfData = {
        price: formatCOP(lote.precio),
        transactionType: 'Venta',
        code: `ALUNA-${lote.id}`,
        area: lote.area.toLocaleString(),
        rooms: '-',
        baths: '-',
        parking: '-',
        stratum: '-',
        propType: `Lote ${lote.tipo}`,
        location: 'Marinilla, Oriente Antioqueño',
        description: `<p>Lote campestre de ${lote.area.toLocaleString()} m2 en ALUNA Campestre, Marinilla. Tipo ${lote.tipo}. Entrega inmediata. Unidad cerrada con vías pavimentadas y redes subterráneas.</p><p>Plan de pagos: Separación $5.000.000 + 30% antes de noviembre + 70% crédito bancario en diciembre 2026. Descuento del 5% por pago de contado.</p>`,
        heroImage: 'https://hayexperiencia.com/images/proyectos/aluna-drone-1.jpg',
        gallery: [
          'https://hayexperiencia.com/images/proyectos/aluna-drone-2.jpg',
          'https://hayexperiencia.com/images/proyectos/aluna-drone-3.jpg',
          'https://hayexperiencia.com/images/proyectos/aluna-evento-1.jpg',
          'https://hayexperiencia.com/images/proyectos/aluna-evento-2.jpg',
        ],
        logo: 'https://hayexperiencia.com/logos/logo-invertido.svg',
        asesorName: 'César Delgado',
        asesorContact: 'WhatsApp: 573022343659',
      };
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: pdfData, modo: 'con-marca' }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const today = new Date().toISOString().slice(0, 10);
        a.download = `ALUNA-Lote${lote.id}-Cotización-${today}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch { /* ignore */ }
    setDownloading(false);
  }

  return (
    <section id="cotizador" className="py-16 bg-gray-50/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-2">Cotizador</h2>
        <p className="text-[var(--color-text-light)] mb-2">9 lotes disponibles de 39 — {Math.round((LOTES_VENDIDOS / 39) * 100)}% vendido</p>
        <p className="text-sm text-[var(--color-text-light)] mb-8">Entrega inmediata. Selecciona un lote para ver la cotización.</p>

        {/* Grid de lotes */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-10">
          {LOTES.map(l => (
            <button
              key={l.id}
              disabled={l.estado === 'vendido'}
              onClick={() => setSelected(l.id)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left
                ${selected === l.id ? 'border-[var(--color-accent)] bg-[var(--color-primary)] text-white' :
                  l.estado === 'vendido' ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed' :
                  'border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]'}`}
            >
              <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${ESTADO_COLORS[l.estado]}`} />
              <div className="font-bold text-sm">{l.label}</div>
              <div className={`text-xs mt-1 ${selected === l.id ? 'text-gray-300' : 'text-[var(--color-text-light)]'}`}>
                {l.area.toLocaleString()} m2
              </div>
              <span className={`text-xs ${selected === l.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent)]'}`}>{l.tipo}</span>
            </button>
          ))}
        </div>

        {/* Resultado */}
        {lote && (
          <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
            {/* Header lote */}
            <div className="bg-[var(--color-primary)] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{lote.label} — ALUNA Campestre</h3>
                  <p className="text-gray-300 mt-1">{lote.area.toLocaleString()} m2 | Tipo {lote.tipo} | Entrega inmediata</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Precio base</div>
                  <div className="text-3xl font-bold text-[var(--color-accent)]">{formatCOP(lote.precio)}</div>
                </div>
              </div>
            </div>

            {/* Tabs de pago */}
            <div className="border-b border-[var(--color-border)]">
              <div className="flex">
                {(['contado', 'cuotas', 'crédito'] as TabPago[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setTabPago(tab)}
                    className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors
                      ${tabPago === tab ? 'bg-[var(--color-accent)] text-[var(--color-primary)]' : 'text-[var(--color-text-light)] hover:bg-gray-50'}`}
                  >
                    {tab === 'contado' ? 'Contado' : tab === 'cuotas' ? 'Cuotas directas' : 'Credito hipotecario'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Contado */}
              {tabPago === 'contado' && (
                <div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 mb-4">
                    <span className="text-green-800 font-medium">Descuento por pago de contado ({CONFIG.descuentoContado * 100}%)</span>
                    <span className="text-green-800 font-bold text-xl">{formatCOP(lote.precio * (1 - CONFIG.descuentoContado))}</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-light)]">Ahorras {formatCOP(lote.precio * CONFIG.descuentoContado)} pagando de contado.</p>
                </div>
              )}

              {/* Cuotas */}
              {tabPago === 'cuotas' && (
                <div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-blue-50">
                      <div className="text-sm text-blue-600">Separacion</div>
                      <div className="text-xl font-bold text-blue-800">{formatCOP(CONFIG.separación)}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50">
                      <div className="text-sm text-blue-600">30% antes de noviembre</div>
                      <div className="text-xl font-bold text-blue-800">{formatCOP(lote.precio * CONFIG.cuotaInicialPct)}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50">
                      <div className="text-sm text-blue-600">70% crédito (dic 2026)</div>
                      <div className="text-xl font-bold text-blue-800">{formatCOP(lote.precio * CONFIG.créditoPct)}</div>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-auto rounded-xl border border-[var(--color-border)]">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Momento</th>
                          <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Concepto</th>
                          <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Valor</th>
                          <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {planPagos.map((row, i) => (
                          <tr key={i} className={`border-t border-gray-100 ${i === planPagos.length - 1 ? 'bg-blue-50/50' : ''}`}>
                            <td className="p-3 text-[var(--color-text-light)]">{row.mes}</td>
                            <td className="p-3 text-[var(--color-text-light)]">{row.concepto}</td>
                            <td className="p-3 text-right font-medium">{formatCOP(row.valor)}</td>
                            <td className="p-3 text-right text-[var(--color-text-light)]">{formatCOP(row.saldo)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Credito */}
              {tabPago === 'crédito' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                      Tasa de interés (EA): {tasaEA}%
                    </label>
                    <input
                      type="range" min="8" max="20" step="0.5" value={tasaEA}
                      onChange={e => setTasaEA(parseFloat(e.target.value))}
                      className="w-full accent-[var(--color-accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                      Plazo: {plazoCredito} años
                    </label>
                    <input
                      type="range" min="5" max="30" step="1" value={plazoCredito}
                      onChange={e => setPlazoCredito(parseInt(e.target.value))}
                      className="w-full accent-[var(--color-accent)]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-purple-50">
                      <div className="text-sm text-purple-600">Cuota inicial (30%)</div>
                      <div className="text-xl font-bold text-purple-800">{formatCOP(lote.precio * 0.3)}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50">
                      <div className="text-sm text-purple-600">Cuota mensual estimada</div>
                      <div className="text-xl font-bold text-purple-800">{formatCOP(cuotaCredito)}</div>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--color-text-light)]">
                    * Simulación con tasa {tasaEA}% EA a {plazoCredito} años. Sujeta a aprobación crediticia.
                  </p>
                </div>
              )}
            </div>

            {/* Valorizacion */}
            <div className="border-t border-[var(--color-border)] p-6">
              <h4 className="text-lg font-bold text-[var(--color-primary)] mb-4">Proyección de valorización</h4>
              <div className="flex items-end gap-2 h-40">
                {valorizacion.map((v, i) => {
                  const maxVal = valorizacion[valorizacion.length - 1].valor;
                  const height = (v.valor / maxVal) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <span className="text-xs font-semibold text-[var(--color-primary)] mb-1">{formatCOP(v.valor)}</span>
                      <div
                        className="w-full rounded-t-lg bg-[var(--color-accent)]"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-[var(--color-text-light)] mt-1">Año {v.year}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-[var(--color-text-light)] mt-3">
                Supuesto: {CONFIG.valorizacionAnual * 100}% de valorización anual en la zona del Oriente Antioqueño.
                Valor esperado en 5 años: {formatCOP(valorizacion[4]?.valor || 0)}.
              </p>
            </div>

            {/* Asesor */}
            <div className="border-t border-[var(--color-border)] p-6 bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-2 uppercase tracking-wide">Tu asesor</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-accent)] font-bold text-lg">C</div>
                    <div>
                      <div className="font-semibold text-[var(--color-primary)]">César Delgado</div>
                      <div className="text-sm text-[var(--color-text-light)]">Asesor Comercial</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-2 uppercase tracking-wide">Broker financiero</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-primary)] font-bold text-lg">J</div>
                    <div>
                      <div className="font-semibold text-[var(--color-primary)]">Jessica — Cazatasa</div>
                      <div className="text-sm text-[var(--color-text-light)]">
                        <a href="https://wa.me/573166940421" target="_blank" rel="noopener noreferrer" className="hover:underline">+57 316 694 0421</a>
                        {' | '}
                        <a href="https://cazatasa.com" target="_blank" rel="noopener noreferrer" className="hover:underline">cazatasa.com</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="border-t border-[var(--color-border)] p-6">
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/573022343659?text=Hola%2C%20me%20interesa%20el%20${encodeURIComponent(lote.label)}%20del%20proyecto%20ALUNA%20Campestre.%20Precio%3A%20${formatCOP(lote.precio)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
                >
                  Escribir por WhatsApp
                </a>
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="flex-1 text-center px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 transition-colors disabled:opacity-50"
                >
                  {downloading ? 'Generando...' : 'Descargar cotización PDF'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
