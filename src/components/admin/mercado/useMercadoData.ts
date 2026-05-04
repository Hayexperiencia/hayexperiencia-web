'use client';

import { useEffect, useState } from 'react';

const ADMIN_KEY = 'hayexperiencia';

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useMercadoData<T>(endpoint: string, refreshKey: number = 0, params?: Record<string, string>): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    const url = new URL(`/api/admin/mercado/${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v));
    }
    if (refreshKey) url.searchParams.set('t', String(refreshKey));

    fetch(url.toString(), { headers: { 'x-admin-key': ADMIN_KEY } })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: T) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((e: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error: e.message });
      });

    return () => { cancelled = true; };
  }, [endpoint, refreshKey, JSON.stringify(params ?? {})]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}

export async function postRefresh(): Promise<{ ok: boolean; refreshed?: string[]; skipped?: string[]; duration_ms?: number; error?: string }> {
  const r = await fetch('/api/admin/mercado/refresh', {
    method: 'POST',
    headers: { 'x-admin-key': ADMIN_KEY },
  });
  return r.json();
}
