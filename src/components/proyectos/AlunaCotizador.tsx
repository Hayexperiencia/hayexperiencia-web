'use client';

import { useState, useMemo } from 'react';

type Estado = 'disponible' | 'reservado' | 'vendido';

// PLACEHOLDER — Gabriel debe confirmar datos reales
const LOTES = [
  { id: 1, area: 2500, precio: 411000000, estado: 'disponible' as Estado, esquinero: false, label: 'Lote 1' },
  { id: 2, area: 2800, precio: 430000000, estado: 'disponible' as Estado, esquinero: false, label: 'Lote 2' },
  { id: 3, area: 3000, precio: 450000000, estado: 'disponible' as Estado, esquinero: true, label: 'Lote 3' },
  { id: 4, area: 2600, precio: 420000000, estado: 'disponible' as Estado, esquinero: false, label: 'Lote 4' },
  { id: 5, area: 2700, precio: 425000000, estado: 'disponible' as Estado, esquinero: false, label: 'Lote 5' },
  { id: 6, area: 3200, precio: 460000000, estado: 'disponible' as Estado, esquinero: true, label: 'Lote 6' },
  { id: 7, area: 2500, precio: 411000000, estado: 'disponible' as Estado, esquinero: false, label: 'Lote 7' },
  { id: 8, area: 2900, precio: 440000000, estado: 'disponible' as Estado, esquinero: false, label: 'Lote 8' },
  { id: 9, area: 3100, precio: 455000000, estado: 'disponible' as Estado, esquinero: false, label: 'Lote 9' },
];

const CONFIG = {
  valorizacionAnual: 0.08,
  descuentoContado: 0.05,
  cuotaInicialPct: 0.30,
  plazoCuotas: 24,
};

type TabPago = 'contado' | 'cuotas' | 'credito';

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

  const cuotasMensuales = useMemo(() => {
    if (!lote) return [];
    const cuotaInicial = lote.precio * CONFIG.cuotaInicialPct;
    const saldoFinanciar = lote.precio - cuotaInicial;
    const cuotaMensual = saldoFinanciar / CONFIG.plazoCuotas;
    const rows = [];
    let saldo = saldoFinanciar;
    rows.push({ mes: 1, concepto: 'Cuota inicial', valor: cuotaInicial, saldo });
    for (let i = 1; i <= CONFIG.plazoCuotas; i++) {
      saldo -= cuotaMensual;
      rows.push({ mes: i + 1, concepto: `Cuota ${i}`, valor: cuotaMensual, saldo: Math.max(0, saldo) });
    }
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
      const res = await fetch(`/api/pdf?id=aluna-lote-${lote.id}&modo=con-marca`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ALUNA-Lote${lote.id}-Cotizacion.pdf`;
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
        <p className="text-[var(--color-text-light)] mb-8">Selecciona un lote para ver la cotizacion completa</p>

        {/* Leyenda */}
        <div className="flex gap-6 mb-6 text-sm">
          {(Object.entries(ESTADO_LABELS) as [Estado, string][]).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${ESTADO_COLORS[key]}`} />
              <span className="text-[var(--color-text-light)]">{label}</span>
            </div>
          ))}
        </div>

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
              {l.esquinero && (
                <span className={`text-xs ${selected === l.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent)]'}`}>Esquinero</span>
              )}
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
                  <p className="text-gray-300 mt-1">{lote.area.toLocaleString()} m2 {lote.esquinero ? '| Lote esquinero' : ''} | {ESTADO_LABELS[lote.estado]}</p>
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
                {(['contado', 'cuotas', 'credito'] as TabPago[]).map(tab => (
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
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-blue-50">
                      <div className="text-sm text-blue-600">Cuota inicial ({CONFIG.cuotaInicialPct * 100}%)</div>
                      <div className="text-xl font-bold text-blue-800">{formatCOP(lote.precio * CONFIG.cuotaInicialPct)}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50">
                      <div className="text-sm text-blue-600">Cuota mensual x {CONFIG.plazoCuotas} meses</div>
                      <div className="text-xl font-bold text-blue-800">{formatCOP((lote.precio * (1 - CONFIG.cuotaInicialPct)) / CONFIG.plazoCuotas)}</div>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-auto rounded-xl border border-[var(--color-border)]">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Mes</th>
                          <th className="text-left p-3 font-semibold text-[var(--color-primary)]">Concepto</th>
                          <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Valor</th>
                          <th className="text-right p-3 font-semibold text-[var(--color-primary)]">Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cuotasMensuales.map((row, i) => (
                          <tr key={i} className="border-t border-gray-100">
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
              {tabPago === 'credito' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                      Tasa de interes (EA): {tasaEA}%
                    </label>
                    <input
                      type="range" min="8" max="20" step="0.5" value={tasaEA}
                      onChange={e => setTasaEA(parseFloat(e.target.value))}
                      className="w-full accent-[var(--color-accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                      Plazo: {plazoCredito} anos
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
                    * Simulacion con tasa {tasaEA}% EA a {plazoCredito} anos. Sujeta a aprobacion crediticia.
                  </p>
                </div>
              )}
            </div>

            {/* Valorizacion */}
            <div className="border-t border-[var(--color-border)] p-6">
              <h4 className="text-lg font-bold text-[var(--color-primary)] mb-4">Proyeccion de valorizacion</h4>
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
                      <span className="text-xs text-[var(--color-text-light)] mt-1">Ano {v.year}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-[var(--color-text-light)] mt-3">
                Supuesto: {CONFIG.valorizacionAnual * 100}% de valorizacion anual en la zona del Oriente Antioqueno.
                Valor esperado en 5 anos: {formatCOP(valorizacion[4]?.valor || 0)}.
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
                      <div className="font-semibold text-[var(--color-primary)]">Cesar Delgado</div>
                      <div className="text-sm text-[var(--color-text-light)]">Asesor Comercial</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-2 uppercase tracking-wide">Broker financiero</h4>
                  <p className="text-sm text-[var(--color-text-light)]">Por definir</p>
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
                  {downloading ? 'Generando...' : 'Descargar cotizacion PDF'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
