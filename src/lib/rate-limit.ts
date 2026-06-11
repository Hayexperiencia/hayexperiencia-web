/**
 * Rate limiting in-memory por IP (sliding window).
 * Suficiente para el deploy actual: 1 replica Node detras de Cloudflare.
 * Si algun dia hay multiples replicas, migrar a Redis o similar.
 */
const buckets = new Map<string, number[]>()
let lastSweep = Date.now()

function sweep(windowMs: number) {
  const now = Date.now()
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [key, hits] of buckets) {
    const alive = hits.filter(t => now - t < windowMs)
    if (alive.length === 0) buckets.delete(key)
    else buckets.set(key, alive)
  }
}

/** true = permitido; false = limite excedido. */
export function rateLimit(key: string, limit: number, windowMs = 60_000): boolean {
  sweep(windowMs)
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter(t => now - t < windowMs)
  if (hits.length >= limit) {
    buckets.set(key, hits)
    return false
  }
  hits.push(now)
  buckets.set(key, hits)
  return true
}

/** IP del cliente detras de Cloudflare/proxy. */
export function clientIp(req: Request): string {
  const h = (name: string) => req.headers.get(name)
  return (
    h('cf-connecting-ip') ??
    h('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}
