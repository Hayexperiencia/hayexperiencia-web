import Link from "next/link";
import Image from "next/image";
import type { FooterGroup, SiteSettings } from "@/lib/strapi";

const FALLBACK_GROUPS: FooterGroup[] = [
  {
    title: "Navegación",
    items: [
      { url: "/propiedades", label: "Propiedades" },
      { url: "/proyectos", label: "Proyectos" },
      { url: "/nosotros", label: "Nosotros" },
      { url: "/contacto", label: "Contacto" },
    ],
  },
  {
    title: "Contacto",
    items: [
      { url: "#", label: "Marinilla, Antioquia" },
      { url: "tel:+573022343659", label: "302 234 3659" },
      { url: "https://wa.me/573022343659", label: "WhatsApp: 302 234 3659" },
      { url: "mailto:gerencia@hayexperiencia.com", label: "gerencia@hayexperiencia.com" },
    ],
  },
  {
    title: "Grupo Hay Experiencia",
    items: [
      { url: "/", label: "hayexperiencia.com — Inmobiliaria" },
      { url: "https://capiolab.com", label: "capiolab.com — Tecnología y CRM" },
      { url: "#", label: "hayexperiencia.co — Corporativa (próximamente)" },
    ],
  },
];

const FALLBACK_TAGLINE =
  "Tu sueño, nuestra experiencia. Lotes, casas, apartamentos y fincas en el Oriente Antioqueño.";
const FALLBACK_HOURS = "Lun-Vie: 8am-6pm | Sab: 9am-1pm";

function isExternal(url: string): boolean {
  return /^(https?:|mailto:|tel:|wa\.me)/i.test(url);
}

function FooterLink({ url, label }: { url: string; label: string }) {
  if (url === "#") {
    return <span className="text-sm text-gray-300">{label}</span>;
  }
  if (isExternal(url)) {
    return (
      <a
        href={url}
        target={url.startsWith("http") ? "_blank" : undefined}
        rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-sm text-gray-300 hover:text-white transition-colors"
      >
        {label}
      </a>
    );
  }
  return (
    <Link href={url} className="text-sm text-gray-300 hover:text-white transition-colors">
      {label}
    </Link>
  );
}

export type FooterProps = {
  groups?: FooterGroup[] | null;
  settings?: SiteSettings | null;
};

export default function Footer({ groups, settings }: FooterProps) {
  const cols = (groups && groups.length > 0) ? groups : FALLBACK_GROUPS;
  const tagline = settings?.tagline ?? FALLBACK_TAGLINE;
  const footerText = settings?.footerText ?? null;
  const cityLabel = settings?.address?.city
    ? `${settings.address.city}, ${settings.address.department ?? "Antioquia"}, ${settings.address.country ?? "Colombia"}`
    : "Marinilla, Antioquia, Colombia";

  return (
    <footer className="bg-[var(--color-primary)] text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Image
              src="/logos/logo-invertido.svg"
              alt={settings?.siteName ?? "Hay Experiencia"}
              width={180}
              height={45}
            />
            <p className="mt-4 text-sm text-gray-300">{tagline}</p>
          </div>

          {cols.slice(0, 3).map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={`${group.title}-${item.url}-${item.label}`}>
                    <FooterLink url={item.url} label={item.label} />
                  </li>
                ))}
              </ul>
              {group.title === "Grupo Hay Experiencia" && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500">{FALLBACK_HOURS}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            {footerText ?? `© ${new Date().getFullYear()} Hay Experiencia SAS. Todos los derechos reservados.`}
          </p>
          <p className="text-xs text-gray-500">{cityLabel}</p>
        </div>
      </div>
    </footer>
  );
}
