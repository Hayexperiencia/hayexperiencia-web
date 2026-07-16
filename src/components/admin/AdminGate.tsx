'use client';

import { useEffect, useState, type ReactNode } from 'react';

// Puerta de acceso del admin. Al montar verifica si el usuario ya está autenticado
// (cookie hei_admin o intranet Authelia vía /api/admin/check). Si lo está, muestra el
// contenido sin pedir contraseña — ese es el flujo de la intranet: quien ya entró con
// su login único NO vuelve a poner contraseña. Si no, muestra el login clásico (compat
// para acceso directo sin pasar por la intranet).
export default function AdminGate({ title, children }: { title: string; children: ReactNode }) {
  const [state, setState] = useState<'checking' | 'in' | 'out'>('checking');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/admin/check')
      .then(r => { if (alive) setState(r.ok ? 'in' : 'out'); })
      .catch(() => { if (alive) setState('out'); });
    return () => { alive = false; };
  }, []);

  if (state === 'checking') {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--color-text-light)]">Cargando…</p>
      </main>
    );
  }

  if (state === 'out') {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 w-full max-w-sm shadow-sm">
          <h1 className="text-xl font-bold text-[var(--color-primary)] mb-2">{title}</h1>
          <p className="text-sm text-[var(--color-text-light)] mb-6">Ingresa la contraseña para continuar.</p>
          <form onSubmit={async e => {
            e.preventDefault();
            const r = await fetch('/api/admin/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password }),
            });
            if (r.ok) { setState('in'); setError(false); } else { setError(true); }
          }}>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Contraseña"
              autoFocus
              className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${error ? 'border-red-400' : 'border-[var(--color-border)]'}`}
            />
            {error && <p className="text-red-500 text-xs mt-2">Contraseña incorrecta</p>}
            <button type="submit" className="w-full mt-4 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 transition-colors">
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
