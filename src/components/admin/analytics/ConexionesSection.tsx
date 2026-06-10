'use client';

import SectionCard from '../mercado/SectionCard';

export default function ConexionesSection() {
  return (
    <SectionCard
      numero={5}
      titulo="GA4 y Meta — datos en vivo (pendiente conexión)"
      pregunta="¿Cómo traemos los números de Google y Meta a este mismo dashboard?"
      accion="Dos pasos de Gabriel (~10 min) y Claude agrega las secciones con datos en vivo."
      responsable="Gabriel → Claude"
    >
      <div className="grid md:grid-cols-2 gap-5 text-xs">
        <div className="bg-gray-50 rounded-xl border border-[var(--color-border)] p-4">
          <h3 className="text-sm font-semibold mb-2">Google Analytics 4 (G-28CMQ5P5TP)</h3>
          <p className="mb-2 text-[var(--color-text-light)]">
            Los eventos ya llegan a GA4. Para verlos aquí se usa la GA4 Data API con la service
            account que ya existe (la misma de Calendar/Drive).
          </p>
          <ol className="list-decimal ml-4 space-y-1">
            <li><strong>Gabriel:</strong> en GA4 → Admin → Property access management → agregar el email de la service account (pedírselo a Claude/Harry) con rol <em>Viewer</em>.</li>
            <li><strong>Claude:</strong> agrega la sección con usuarios, sesiones, fuentes y eventos del cotizador en vivo.</li>
          </ol>
          <p className="mt-2">Mientras tanto: <a className="text-[var(--color-accent)] hover:underline" href="https://analytics.google.com" target="_blank">analytics.google.com</a></p>
        </div>
        <div className="bg-gray-50 rounded-xl border border-[var(--color-border)] p-4">
          <h3 className="text-sm font-semibold mb-2">Meta Pixel (355638822100588)</h3>
          <p className="mb-2 text-[var(--color-text-light)]">
            El Pixel dispara eventos pero la atribución está coja hasta cerrar HEI-84 (AEM + Domain
            Verification). Para datos en vivo aquí se necesita un token de la Marketing API.
          </p>
          <ol className="list-decimal ml-4 space-y-1">
            <li><strong>Gabriel:</strong> cerrar HEI-84 en Meta Business (AEM + verificar dominio hayexperiencia.com).</li>
            <li><strong>Gabriel:</strong> generar token de sistema (Business Settings → System users) con permiso <em>ads_read</em> y pasarlo por canal seguro.</li>
            <li><strong>Claude:</strong> agrega la sección con resultados de eventos y costo por lead cuando haya pauta activa.</li>
          </ol>
          <p className="mt-2">Mientras tanto: <a className="text-[var(--color-accent)] hover:underline" href="https://business.facebook.com/events_manager2" target="_blank">Events Manager</a></p>
        </div>
      </div>
    </SectionCard>
  );
}
