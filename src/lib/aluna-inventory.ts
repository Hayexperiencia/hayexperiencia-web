import "server-only";
import { getPool } from "@/lib/pg";
import { LOT_COORDS, type Lot, type Element } from "@/lib/aluna-lots";

const M = "https://hayexperiencia.com";
const ELEMENTS: Element[] = ["LUZ", "BOSQUE", "AGUA", "AIRE"];

function toAbs(url: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return M + (url.startsWith("/") ? "" : "/") + url;
}

// Lee el inventario ALUNA en vivo del cotizador (hei_inventory_units) y lo
// combina con las coordenadas del plano. Se actualiza solo: cambias el estado
// de un lote en /admin/cotizador y el mapa lo refleja (revalidate abajo).
export async function getAlunaLots(): Promise<Lot[]> {
  try {
    const p = await getPool();
    const client = await p.connect();
    try {
      const { rows } = await client.query(`
        SELECT u.unit_code, u.unit_type, u.area_total_m2, u.list_price, u.unit_status,
               COALESCE(u.image_url, ti.image_url, p.cover_image_url) AS image_url
        FROM hei_inventory_units u
        JOIN hei_projects p ON p.id = u.project_id
        LEFT JOIN hei_unit_type_images ti
               ON ti.project_id = u.project_id
              AND ti.unit_type = u.unit_type
              AND ti.sort_order = 0
        WHERE p.slug = 'aluna' AND u.is_active = true
        ORDER BY NULLIF(regexp_replace(u.unit_code, '\\D', '', 'g'), '')::bigint NULLS LAST,
                 u.unit_code
      `);
      return rows.map((r): Lot => {
        const num = (r.unit_code as string).replace(/\D/g, "");
        const t = String(r.unit_type || "").toUpperCase() as Element;
        const element: Element = ELEMENTS.includes(t) ? t : "—";
        return {
          code: r.unit_code,
          element,
          area: Math.round(Number(r.area_total_m2) * 100) / 100,
          price: Number(r.list_price) || 0,
          status: r.unit_status === "vendido" ? "vendido" : "disponible",
          image: toAbs(r.image_url),
          ...(LOT_COORDS[num] || {}),
        };
      });
    } finally {
      client.release();
    }
  } catch (e) {
    console.error("getAlunaLots error:", e);
    return [];
  }
}
