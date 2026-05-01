import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

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

const SALT = process.env.ANALYTICS_HASH_SALT ?? "hei-default-salt";

function hashSession(raw: string): string {
  return crypto.createHash("sha256").update(`${SALT}:${raw}`).digest("hex");
}

function detectDevice(ua: string | null): string {
  if (!ua) return "unknown";
  const u = ua.toLowerCase();
  if (/ipad|tablet/.test(u)) return "tablet";
  if (/mobile|android|iphone|ipod/.test(u)) return "mobile";
  return "desktop";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      wasiId?: string | number;
      sessionId?: string;
      source?: string;
      pagePath?: string;
    };

    if (!body.wasiId) {
      return NextResponse.json({ error: "wasiId required" }, { status: 400 });
    }

    const sessionId = body.sessionId ?? `${req.headers.get("x-forwarded-for") ?? ""}:${req.headers.get("user-agent") ?? ""}`;
    const sessionHash = hashSession(sessionId);
    const ua = req.headers.get("user-agent") ?? null;
    const country = req.headers.get("cf-ipcountry") ?? null;
    const city = req.headers.get("cf-ipcity") ?? null;

    const p = await getPool();
    await p.query(
      `INSERT INTO analytics.property_views
         (wasi_id, session_hash, source, device, country, city, user_agent_short, page_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        String(body.wasiId),
        sessionHash,
        body.source ?? null,
        detectDevice(ua),
        country,
        city,
        ua ? ua.slice(0, 255) : null,
        body.pagePath ?? null,
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[analytics/view] error", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
