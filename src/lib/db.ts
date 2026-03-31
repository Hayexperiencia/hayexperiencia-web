import { EnrichedData, MarketAverage } from "./types";

let pool: import("pg").Pool | null = null;

async function getPool() {
  if (!pool) {
    try {
      const { Pool } = await import("pg");
      pool = new Pool({ connectionString: process.env.DATABASE_URL });
    } catch {
      return null;
    }
  }
  return pool;
}

export async function getEnrichedData(
  propertyId: string
): Promise<EnrichedData | null> {
  try {
    const p = await getPool();
    if (!p) return null;
    const result = await p.query(
      "SELECT * FROM enriched_properties WHERE wasi_id = $1",
      [propertyId]
    );
    return (result.rows[0] as EnrichedData) || null;
  } catch {
    return null;
  }
}

export async function getMarketAverage(
  city: string,
  propertyType: number
): Promise<MarketAverage | null> {
  try {
    const p = await getPool();
    if (!p) return null;
    const result = await p.query(
      "SELECT avg_price_m2, city, property_type, period FROM market_analytics WHERE city = $1 AND property_type = $2 ORDER BY period DESC LIMIT 1",
      [city, propertyType]
    );
    return (result.rows[0] as MarketAverage) || null;
  } catch {
    return null;
  }
}
