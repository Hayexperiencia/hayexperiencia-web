'use client';

import SectionCard from '../mercado/SectionCard';

const EVENTOS = [
  { evento: 'Vista de página (PageView)', ga4: true, meta: true, propio: false },
  { evento: 'Vista de propiedad', ga4: true, meta: true, propio: true },
  { evento: 'Click WhatsApp', ga4: true, meta: true, propio: false },
  { evento: 'Cotizador iniciado', ga4: true, meta: true, propio: false },
  { evento: 'Cotizador enviado (Lead)', ga4: true, meta: true, propio: true },
  { evento: 'Formulario contacto', ga4: true, meta: true, propio: false },
  { evento: 'Cita agendada (GHL)', ga4: false, meta: false, propio: false },
  { evento: 'Venta (Wasi vendido)', ga4: false, meta: false, propio: false },
];

const GAPS = [
  { gap: 'Meta AEM (matching avanzado) sin configurar', impacto: 'Se pierde ~20% de atribución en Meta Ads', quien: 'Gabriel (HEI-84, admin Meta Business)' },
  { gap: 'Domain Verification de Meta sin hacer', impacto: 'Aggregated Event Measurement (iOS) no funciona', quien: 'Gabriel (HEI-84)' },
  { gap: 'Meta CAPI server-side no existe', impacto: '~30% de eventos perdidos por adblockers/iOS', quien: 'Claude (tras HEI-84)' },
  { gap: 'Enhanced Conversions de Google sin activar', impacto: 'Prerrequisito para campañas AI Max', quien: 'Gabriel + Claude' },
  { gap: 'Cotizador/WhatsApp no se guardan en Postgres', impacto: 'El embudo propio queda incompleto', quien: 'Claude (tabla lead_attribution)' },
  { gap: 'GHL sin campo de fuente (UTM) en leads del cotizador', impacto: 'No se sabe qué canal trae los leads que cierran', quien: 'Claude' },
];

function Check({ ok }: { ok: boolean }) {
  return ok ? <span className="text-green-600 font-bold">✓</span> : <span className="text-red-400">✗</span>;
}

export default function InstrumentacionSection() {
  return (
    <SectionCard
      numero={4}
      titulo="Estado de instrumentación (las 3 patas)"
      pregunta="¿Qué captura cada sistema hoy y qué falta para medir el embudo completo?"
      accion="Cerrar HEI-84 desbloquea la mitad de los gaps. Es el siguiente paso del proyecto analytics."
      responsable="Gabriel + Claude"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <h3 className="text-sm font-semibold mb-2">Cobertura por evento</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[var(--color-text-light)] text-left">
                <th className="py-1">Evento</th>
                <th className="text-center">GA4</th>
                <th className="text-center">Meta Pixel</th>
                <th className="text-center">Propio (Postgres)</th>
              </tr>
            </thead>
            <tbody>
              {EVENTOS.map((e) => (
                <tr key={e.evento} className="border-b border-gray-100">
                  <td className="py-1.5">{e.evento}</td>
                  <td className="text-center"><Check ok={e.ga4} /></td>
                  <td className="text-center"><Check ok={e.meta} /></td>
                  <td className="text-center"><Check ok={e.propio} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Gaps y a quién le toca</h3>
          <ul className="space-y-2 text-xs">
            {GAPS.map((g) => (
              <li key={g.gap} className="border-b border-gray-100 pb-2">
                <p className="font-medium text-[var(--color-text)]">{g.gap}</p>
                <p className="text-[var(--color-text-light)]">{g.impacto} · <strong>{g.quien}</strong></p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}
