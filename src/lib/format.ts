export function formatCOP(n: number | string | null | undefined): string {
  if (n === null || n === undefined || n === '') return '—';
  const num = typeof n === 'string' ? Number(n) : n;
  if (!Number.isFinite(num) || num === 0) return '$0';
  return '$' + Math.round(num).toLocaleString('es-CO');
}

export function formatM(n: number | string | null | undefined, decimals = 1): string {
  if (n === null || n === undefined || n === '') return '—';
  const num = typeof n === 'string' ? Number(n) : n;
  if (!Number.isFinite(num)) return '—';
  return '$' + num.toFixed(decimals) + 'M';
}

export function formatPct(n: number | string | null | undefined, decimals = 1): string {
  if (n === null || n === undefined || n === '') return '—';
  const num = typeof n === 'string' ? Number(n) : n;
  if (!Number.isFinite(num)) return '—';
  const sign = num > 0 ? '+' : '';
  return sign + num.toFixed(decimals) + '%';
}

export function formatM2(n: number | string | null | undefined): string {
  if (n === null || n === undefined || n === '') return '—';
  const num = typeof n === 'string' ? Number(n) : n;
  if (!Number.isFinite(num)) return '—';
  return Math.round(num).toLocaleString('es-CO') + ' m²';
}

export function formatInt(n: number | string | null | undefined): string {
  if (n === null || n === undefined || n === '') return '—';
  const num = typeof n === 'string' ? Number(n) : n;
  if (!Number.isFinite(num)) return '—';
  return Math.round(num).toLocaleString('es-CO');
}

export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return 'hace unos segundos';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffH < 24) return `hace ${diffH} h`;
  if (diffD < 30) return `hace ${diffD} d`;
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function freshnessColor(date: string | Date | null | undefined): 'green' | 'yellow' | 'red' | 'gray' {
  if (!date) return 'gray';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'gray';
  const diffH = (Date.now() - d.getTime()) / 3600000;
  if (diffH < 24) return 'green';
  if (diffH < 24 * 7) return 'yellow';
  return 'red';
}
