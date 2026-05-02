import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de tratamiento de datos personales de Hay Experiencia SAS. Cumple Ley 1581 de 2012 y Decreto 1377 de 2013 (Habeas Data Colombia).",
};

export const revalidate = 86400;

export default function PrivacidadPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose prose-headings:text-[var(--color-primary)] prose-a:text-[var(--color-primary)]">
      <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
      <p className="text-sm text-gray-500 mt-0">
        Hay Experiencia SAS · NIT 901-XXX-XXX · Marinilla, Antioquia, Colombia
        <br />
        Última actualización: 1 de mayo de 2026
      </p>

      <h2>1. Quiénes somos</h2>
      <p>
        Hay Experiencia SAS (en adelante &quot;Hay Experiencia&quot;, &quot;nosotros&quot;) es una sociedad
        colombiana con domicilio en Marinilla, Antioquia, dedicada a servicios inmobiliarios,
        marketing y consultoría tecnológica en el Oriente Antioqueño. Operamos el sitio web{" "}
        <a href="https://hayexperiencia.com">hayexperiencia.com</a>.
      </p>

      <h2>2. Marco legal</h2>
      <p>
        Esta política da cumplimiento a la <strong>Ley 1581 de 2012</strong> (Régimen General de
        Protección de Datos Personales), su Decreto Reglamentario <strong>1377 de 2013</strong>, y
        normas concordantes de la Superintendencia de Industria y Comercio (SIC) de Colombia.
      </p>

      <h2>3. Datos que recolectamos</h2>
      <h3>3.1 Datos que tú nos proporcionas</h3>
      <ul>
        <li>Nombre, correo electrónico, número de teléfono cuando completas formularios de contacto, cotizador o agenda de asesoría.</li>
        <li>Información sobre la propiedad de tu interés cuando consultas el cotizador.</li>
        <li>Mensajes que nos envías por WhatsApp, correo o formulario.</li>
      </ul>

      <h3>3.2 Datos de navegación (automáticos)</h3>
      <p>Al visitar el sitio recolectamos automáticamente:</p>
      <ul>
        <li>Páginas visitadas y tiempo de permanencia (Google Analytics 4 y herramienta propia).</li>
        <li>Tipo de dispositivo, navegador, sistema operativo, país e idioma aproximados.</li>
        <li>Origen del tráfico (búsqueda directa, Google, Meta, WhatsApp, etc).</li>
        <li>Identificadores anónimos de sesión (no contienen tu nombre ni correo).</li>
        <li>Eventos de interacción: clic en WhatsApp, inicio de cotizador, envío de formulario.</li>
      </ul>

      <h2>4. Finalidades del tratamiento</h2>
      <p>Usamos tus datos para:</p>
      <ul>
        <li>Atender solicitudes de información sobre propiedades y proyectos.</li>
        <li>Generar cotizaciones personalizadas (proyectos ALUNA, El Faro, Aquaverde, Remanso).</li>
        <li>Coordinar asesorías presenciales o virtuales con nuestros asesores.</li>
        <li>Enviarte información comercial sobre propiedades que coincidan con tus intereses, solo si autorizas explícitamente este uso.</li>
        <li>Cumplir obligaciones legales, contables y tributarias.</li>
        <li>Mejorar la experiencia del sitio web mediante análisis estadístico agregado.</li>
        <li>Optimizar campañas publicitarias en Google y Meta (Facebook/Instagram) con datos agregados y anónimos.</li>
      </ul>

      <h2>5. Cookies y tecnologías similares</h2>
      <p>
        Usamos cookies y herramientas de terceros que pueden setear cookies en tu navegador. Las
        principales son:
      </p>
      <ul>
        <li>
          <strong>Google Analytics 4</strong> — análisis de comportamiento del sitio. Datos
          agregados, sin identificadores personales directos.
        </li>
        <li>
          <strong>Meta Pixel (Facebook/Instagram)</strong> — medición de campañas publicitarias y
          construcción de audiencias. Permite mostrar anuncios relevantes en redes Meta.
        </li>
        <li>
          <strong>Cookies propias</strong> — preferencias de sesión, identificador anónimo para
          contar visitas únicas, estado del banner de cookies.
        </li>
      </ul>
      <p>
        Puedes configurar tu navegador para rechazar cookies en cualquier momento. Esto no impide
        usar el sitio pero limita la personalización.
      </p>

      <h2>6. Cómo compartimos información</h2>
      <p>
        No vendemos tus datos personales. Compartimos información únicamente con:
      </p>
      <ul>
        <li>
          Nuestro CRM (GoHighLevel) y motor de propiedades (Wasi) — proveedores que nos ayudan a
          operar.
        </li>
        <li>
          Plataformas de analítica y publicidad (Google, Meta) — datos agregados y anónimos para
          medir campañas.
        </li>
        <li>
          Proveedores de servicios estrictamente necesarios (hosting Coolify, email transaccional
          Dreamhost).
        </li>
        <li>
          Autoridades competentes cuando sea legalmente requerido.
        </li>
      </ul>
      <p>Todos los terceros mencionados están obligados contractualmente a confidencialidad.</p>

      <h2>7. Tiempo de conservación</h2>
      <p>
        Conservamos tus datos por el tiempo necesario para las finalidades descritas y mientras
        mantengas alguna relación comercial con nosotros. Los datos de prospectos sin actividad por
        más de 24 meses son anonimizados o eliminados.
      </p>

      <h2>8. Tus derechos</h2>
      <p>Como titular de tus datos personales tienes derecho a:</p>
      <ul>
        <li><strong>Conocer</strong> qué datos tenemos sobre ti.</li>
        <li><strong>Actualizar</strong> o rectificar datos incorrectos o incompletos.</li>
        <li><strong>Solicitar prueba</strong> de la autorización que diste para el tratamiento.</li>
        <li><strong>Revocar</strong> tu autorización en cualquier momento.</li>
        <li><strong>Suprimir</strong> tus datos cuando consideres que el tratamiento no respeta principios legales o ya no son necesarios.</li>
        <li><strong>Presentar quejas</strong> ante la Superintendencia de Industria y Comercio (SIC).</li>
      </ul>

      <h2>9. Cómo ejercer tus derechos</h2>
      <p>Para ejercer cualquier derecho, escríbenos a:</p>
      <ul>
        <li>
          Correo: <a href="mailto:gerencia@hayexperiencia.com">gerencia@hayexperiencia.com</a>
        </li>
        <li>
          WhatsApp:{" "}
          <a
            href="https://wa.me/573022343659"
            target="_blank"
            rel="noopener noreferrer"
          >
            +57 302 234 3659
          </a>
        </li>
        <li>Dirección: Marinilla, Antioquia, Colombia.</li>
      </ul>
      <p>
        Responderemos tu solicitud dentro de los 15 días hábiles siguientes (consulta) o 15 días
        hábiles (reclamo), de acuerdo con la Ley 1581 de 2012.
      </p>

      <h2>10. Cambios a esta política</h2>
      <p>
        Podemos actualizar esta política periódicamente. Los cambios materiales serán notificados
        en este sitio con antelación razonable. La fecha de última actualización aparece al inicio
        del documento.
      </p>

      <h2>11. Contacto</h2>
      <p>
        Hay Experiencia SAS
        <br />
        Marinilla, Antioquia, Colombia
        <br />
        <a href="mailto:gerencia@hayexperiencia.com">gerencia@hayexperiencia.com</a>
        <br />
        <a
          href="https://wa.me/573022343659"
          target="_blank"
          rel="noopener noreferrer"
        >
          +57 302 234 3659
        </a>
      </p>

      <hr />
      <p className="text-sm italic text-gray-500">
        Este documento es la política de tratamiento de datos personales de Hay Experiencia SAS.
        Se entrega como información para visitantes y prospectos. Para casos legales específicos
        recomendamos asesoría profesional.{" "}
        <Link href="/contacto">¿Tienes una pregunta? Escríbenos.</Link>
      </p>
    </article>
  );
}
