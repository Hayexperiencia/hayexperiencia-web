"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const ADMIN_PASSWORD = "hayexperiencia";

type Comparable = {
  rank: number;
  source_domain: string;
  source_url: string;
  title: string | null;
  price_cop: number | null;
  area_m2: number | null;
  price_per_m2: number | null;
  scraped_at: string | null;
};

function formatCop(n: number | null): string {
  if (n === null) return "—";
  return `$${(n / 1_000_000).toFixed(1)}M`;
}

export default function ComparablesPage() {
  const params = useParams<{ wasiId: string }>();
  const wasiId = params?.wasiId;
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<{ comparables: Comparable[]; count: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!authed || !wasiId) return;
    setLoading(true);
    fetch(`/api/admin/comparables/${wasiId}?key=${ADMIN_PASSWORD}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((d) => setData(d))
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [authed, wasiId]);

  if (!authed) {
    return (
      <div className="mx-auto max-w-md p-8">
        <h1 className="text-2xl font-bold mb-4">Acceso restringido</h1>
        <p className="text-sm text-gray-600 mb-4">
          Comparables privados de la propiedad. Solo equipo HEI.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full border rounded px-3 py-2 mb-3"
          onKeyDown={(e) => {
            if (e.key === "Enter" && password === ADMIN_PASSWORD) setAuthed(true);
          }}
        />
        <button
          onClick={() => password === ADMIN_PASSWORD && setAuthed(true)}
          className="w-full bg-[var(--color-primary)] text-white rounded py-2"
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-bold mb-1">Comparables privados</h1>
      <p className="text-sm text-gray-500 mb-6">wasiId: {wasiId}</p>

      {loading && <p>Cargando…</p>}
      {err && <p className="text-red-600">Error: {err}</p>}
      {data && data.count === 0 && (
        <p className="text-gray-600">
          Esta propiedad no tiene comparables todavía. Corre el enrichment desde
          servidor:{" "}
          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
            python3 scripts/enrich_hei_properties.py --wasi-id={wasiId}
          </code>
        </p>
      )}
      {data && data.count > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-sm">
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b">Título</th>
                <th className="p-3 border-b">Fuente</th>
                <th className="p-3 border-b text-right">Precio</th>
                <th className="p-3 border-b text-right">m²</th>
                <th className="p-3 border-b text-right">$/m²</th>
                <th className="p-3 border-b">Scraped</th>
                <th className="p-3 border-b">Link</th>
              </tr>
            </thead>
            <tbody>
              {data.comparables.map((c) => (
                <tr key={c.rank} className="text-sm hover:bg-gray-50">
                  <td className="p-3 border-b">{c.rank}</td>
                  <td className="p-3 border-b max-w-md truncate" title={c.title ?? ""}>
                    {c.title ?? "—"}
                  </td>
                  <td className="p-3 border-b text-gray-600">{c.source_domain}</td>
                  <td className="p-3 border-b text-right">{formatCop(c.price_cop)}</td>
                  <td className="p-3 border-b text-right">
                    {c.area_m2 ? Number(c.area_m2).toFixed(0) : "—"}
                  </td>
                  <td className="p-3 border-b text-right">{formatCop(c.price_per_m2)}</td>
                  <td className="p-3 border-b text-gray-500 text-xs">
                    {c.scraped_at ? new Date(c.scraped_at).toLocaleDateString("es-CO") : "—"}
                  </td>
                  <td className="p-3 border-b">
                    <a
                      href={c.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-primary)] underline"
                    >
                      Abrir
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
