/**
 * Pool unico de Postgres para el sitio (cotizador, tracking, paginas server).
 * Reemplaza los 4+ pools ad-hoc que vivian en cada route handler.
 */
let pool: import('pg').Pool | null = null

export async function getPool() {
  if (!pool) {
    const { Pool } = await import('pg')
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  }
  return pool
}
