"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import BookingModal from "@/components/ui/BookingModal";

const PROJECTS = [
  { href: "/proyectos/aluna", label: "ALUNA Campestre" },
  { href: "/proyectos/el-faro", label: "El Faro" },
  { href: "/proyectos/remanso", label: "Remanso de Oriente" },
  { href: "/proyectos/aquaverde", label: "Aquaverde" },
];

const MUNICIPIOS = [
  "Marinilla", "El Peñol", "Guatapé", "Rionegro", "El Retiro", "La Ceja", "San Vicente",
];

function Dropdown({ label, href, items, type }: { label: string; href: string; items: { href: string; label: string }[]; type: "link" | "filter" }) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  const show = () => { if (timeout.current) clearTimeout(timeout.current); setOpen(true); };
  const hide = () => { timeout.current = setTimeout(() => setOpen(false), 150); };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link href={href} className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors duration-200 flex items-center gap-1">
        {label}
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </Link>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {type === "link" && items.map((item) => (
            <Link key={item.href} href={item.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[var(--color-primary)] hover:text-white transition-colors" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          {type === "filter" && (
            <>
              <Link href="/propiedades" className="block px-4 py-2.5 text-sm font-medium text-[var(--color-primary)] hover:bg-gray-50 transition-colors border-b border-gray-100" onClick={() => setOpen(false)}>
                Ver todas
              </Link>
              {items.map((item) => (
                <Link key={item.href} href={item.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[var(--color-primary)] hover:text-white transition-colors" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MobileAccordion({ label, items }: { label: string; items: { href: string; label: string }[]; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] hover:bg-gray-50">
        {label}
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="pl-6 space-y-1">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="block px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const municipioItems = MUNICIPIOS.map((m) => {
    const cityIds: Record<string, string> = { "Marinilla": "488", "El Peñol": "278", "Guatapé": "358", "Rionegro": "685", "El Retiro": "677", "La Ceja": "410", "San Vicente": "773" };
    return { href: `/propiedades?ciudad=${cityIds[m] || ""}`, label: m };
  });

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex-shrink-0 py-2">
            <Image
              src="/logos/logo-completo.svg"
              alt="Hay Experiencia Inmobiliaria"
              width={200}
              height={50}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Dropdown label="Propiedades" href="/propiedades" items={municipioItems} type="filter" />
            <Dropdown label="Proyectos" href="/proyectos" items={PROJECTS} type="link" />
            <Link href="/nosotros" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors duration-200">
              Nosotros
            </Link>
            <BookingModal
              trigger={
                <span className="rounded-lg border-2 border-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-200">
                  Agendar asesoría
                </span>
              }
            />
            <Link
              href="/contacto"
              className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-accent-light)] transition-colors duration-200"
            >
              Contáctanos
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg className="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-1">
            <MobileAccordion label="Propiedades" items={[{ href: "/propiedades", label: "Ver todas" }, ...municipioItems]} onClose={() => setOpen(false)} />
            <MobileAccordion label="Proyectos" items={PROJECTS} onClose={() => setOpen(false)} />
            <Link href="/nosotros" className="block px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] hover:bg-gray-50" onClick={() => setOpen(false)}>
              Nosotros
            </Link>
            <BookingModal
              trigger={
                <span className="block mx-3 text-center rounded-lg border-2 border-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)]">
                  Agendar asesoría
                </span>
              }
            />
            <Link href="/contacto" className="block mx-3 text-center rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)]" onClick={() => setOpen(false)}>
              Contáctanos
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
