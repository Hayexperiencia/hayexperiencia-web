import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + descripcion */}
          <div className="md:col-span-1">
            <Image
              src="/logos/logo-invertido.svg"
              alt="Hay Experiencia"
              width={180}
              height={45}
            />
            <p className="mt-4 text-sm text-gray-300">
              Tu sueño, nuestra experiencia. Lotes, casas, apartamentos y fincas en el Oriente Antioqueño.
            </p>
          </div>

          {/* Navegacion */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider">Navegación</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/propiedades" className="text-sm text-gray-300 hover:text-white transition-colors">Propiedades</Link></li>
              <li><Link href="/proyectos" className="text-sm text-gray-300 hover:text-white transition-colors">Proyectos</Link></li>
              <li><Link href="/nosotros" className="text-sm text-gray-300 hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link href="/contacto" className="text-sm text-gray-300 hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider">Contacto</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-300">Marinilla, Antioquia</li>
              <li><a href="tel:+573022343659" className="text-sm text-gray-300 hover:text-white transition-colors">302 234 3659</a></li>
              <li><a href="https://wa.me/573022343659" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">WhatsApp: 302 234 3659</a></li>
              <li><a href="mailto:gerencia@hayexperiencia.com" className="text-sm text-gray-300 hover:text-white transition-colors">gerencia@hayexperiencia.com</a></li>
            </ul>
          </div>

          {/* Marcas del grupo */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider">Grupo Hay Experiencia</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">
                  hayexperiencia.com — Inmobiliaria
                </Link>
              </li>
              <li>
                <a href="https://capiolab.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">
                  capiolab.com — Tecnología y CRM
                </a>
              </li>
              <li className="text-sm text-gray-500">
                hayexperiencia.co — Corporativa (próximamente)
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-gray-500">Lun-Vie: 8am-6pm | Sab: 9am-1pm</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Hay Experiencia SAS. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-500">
            Marinilla, Antioquia, Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
