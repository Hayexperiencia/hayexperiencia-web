'use client';

import { useState } from 'react';
import AdminPanel from '@/components/admin/AdminCotizador';

export default function AdminCotizadorPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!authenticated) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 w-full max-w-sm shadow-sm">
          <h1 className="text-xl font-bold text-[var(--color-primary)] mb-2">Admin Cotizador</h1>
          <p className="text-sm text-[var(--color-text-light)] mb-6">Ingresa la contraseña para continuar.</p>
          <form onSubmit={async e => {
            e.preventDefault();
            const r = await fetch('/api/admin/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password }),
            });
            if (r.ok) {
              setAuthenticated(true);
              setError(false);
            } else {
              setError(true);
            }
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

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <AdminPanel />
    </main>
  );
}
