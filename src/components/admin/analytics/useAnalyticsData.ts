'use client';

import { useEffect, useState } from 'react';

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAnalyticsData<T>(endpoint: string, refreshKey: number = 0): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    const url = new URL(`/api/admin/analytics/${endpoint}`, window.location.origin);
    if (refreshKey) url.searchParams.set('t', String(refreshKey));

    fetch(url.toString())
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
  }, [endpoint, refreshKey]);

  return state;
}
