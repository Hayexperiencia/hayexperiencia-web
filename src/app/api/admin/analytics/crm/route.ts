import { NextRequest } from 'next/server';
import { checkAdminAuth, jsonWithCache, jsonError } from '@/lib/admin-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GHL_URL = process.env.GHL_SERVICE_URL || 'http://host.docker.internal:3002';
const GHL_KEY = process.env.GHL_SERVICE_API_KEY || '';

async function ghl(path: string): Promise<Record<string, unknown>> {
  const r = await fetch(`${GHL_URL}${path}`, {
    headers: { Authorization: `Bearer ${GHL_KEY}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw new Error(`GHL service ${r.status} en ${path}`);
  return r.json();
}

type Pipeline = { id: string; name: string; stages?: Array<{ id: string; name: string }> };

export async function GET(req: NextRequest) {
  const unauth = checkAdminAuth(req);
  if (unauth) return unauth;
  if (!GHL_KEY) return jsonError('GHL_SERVICE_API_KEY no configurada', 503);

  try {
    const pipelinesRes = (await ghl('/pipelines')) as { pipelines: Pipeline[] };
    const pipelines = pipelinesRes.pipelines ?? [];

    // Total de oportunidades abiertas por pipeline via meta.total (limit=1 —
    // evita paginar miles de opps; mismo patron del reporte n8n diario).
    const porPipeline = await Promise.all(
      pipelines.map(async (pl) => {
        try {
          const d = (await ghl(`/opportunities?pipeline=${pl.id}&limit=1`)) as {
            meta?: { total?: number };
          };
          return { pipeline: pl.name, total: d.meta?.total ?? 0 };
        } catch {
          return { pipeline: pl.name, total: -1 };
        }
      })
    );

    const contactos = (await ghl('/contacts?limit=100&sort=dateAdded&order=desc')) as {
      contacts?: Array<{ dateAdded?: string }>;
      meta?: { total?: number };
    };
    const ahora = Date.now();
    const lista = contactos.contacts ?? [];
    const en = (dias: number) =>
      lista.filter((c) => c.dateAdded && ahora - Date.parse(c.dateAdded) < dias * 86400000).length;
    const nuevos7 = en(7);
    const nuevos30 = en(30);

    return jsonWithCache({
      ok: true,
      contactosTotal: contactos.meta?.total ?? null,
      nuevos7d: nuevos7,
      // si los 100 mas recientes caen todos dentro de 30d, el conteo esta capado
      nuevos30d: nuevos30,
      nuevos30dCapado: nuevos30 >= lista.length && lista.length === 100,
      porPipeline: porPipeline.sort((a, b) => b.total - a.total),
    });
  } catch (e) {
    return jsonError((e as Error).message);
  }
}
