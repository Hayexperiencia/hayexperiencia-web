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
              Tu sueno, nuestra experiencia. Lotes, casas, apartamentos y fincas en el Oriente Antioqueno.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider">Navegacion</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/propiedades" className="text-sm text-gray-300 hover:text-white transition-colors">Propiedades</Link></li>
              <li><Link href="/proyectos/aluna" className="text-sm text-gray-300 hover:text-white transition-colors">Proyecto ALUNA</Link></li>
              <li><Link href="/proyectos/el-faro" className="text-sm text-gray-300 hover:text-white transition-colors">Proyecto El Faro</Link></li>
              <li><Link href="/nosotros" className="text-sm text-gray-300 hover:text-white transition-colors">Nosotros</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider">Contacto</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-300">Marinilla, Antioquia</li>
              <li><a href="tel:+573043270606" className="text-sm text-gray-300 hover:text-white transition-colors">304 327 0606</a></li>
              <li><a href="https://wa.me/573022343659" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">WhatsApp: 302 234 3659</a></li>
              <li><a href="mailto:gerencia@hayexperiencia.com" className="text-sm text-gray-300 hover:text-white transition-colors">gerencia@hayexperiencia.com</a></li>
            </ul>
          </div>

          {/* Horario */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider">Horario</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-300">Lunes a Viernes: 8am - 6pm</li>
              <li className="text-sm text-gray-300">Sabado: 9am - 1pm</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Hay Experiencia SAS. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
