import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let pool: import("pg").Pool | null = null;
async function getPool() {
  if (!pool) {
    const { Pool } = await import("pg");
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ wasiId: string }> }
) {
  const { checkAdminAuth } = await import("@/lib/admin-db");
  const unauthorized = checkAdminAuth(req);
  if (unauthorized) return unauthorized;
  const { wasiId } = await params;
  if (!/^\d+$/.test(wasiId)) {
    return NextResponse.json({ error: "Invalid wasiId" }, { status: 400 });
  }

  try {
    const p = await getPool();
    const r = await p.query(
      `SELECT rank, source_domain, source_url, title, price_cop, area_m2,
              price_per_m2, scraped_at
       FROM market_intel.hei_comparables_private
       WHERE hei_wasi_id = $1::bigint
       ORDER BY rank ASC`,
      [wasiId]
    );
    return NextResponse.json({
      ok: true,
      wasiId,
      count: r.rows.length,
      comparables: r.rows,
    });
  } catch (e) {
    console.error("[admin/comparables] error", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
