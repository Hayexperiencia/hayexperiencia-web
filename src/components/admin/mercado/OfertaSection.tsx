'use client';

import SectionCard from './SectionCard';
import { useMercadoData } from './useMercadoData';
import { formatInt, formatM, formatCOP } from '@/lib/format';

interface Row {
  city: string;
  total: number;
  venta: number;
  arriendo: number;
  med_venta_m: number | null;
  med_arriendo_cop: number | null;
  med_pxm2_venta_m: number | null;
}

export default function OfertaSection({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = useMercadoData<{ rows: Row[] }>('oferta', refreshKey);
  const rows = data?.rows ?? [];
  return (
    <SectionCard
      numero={2}
      titulo="Mapa de oferta por municipio"
      pregunta="¿Dónde está concentrada la competencia y a qué precio?"
      loading={loading}
      error={error}
      accion="Priorizar captación en municipios con alto volumen de competencia donde HEI tiene poco inventario (cruza con sección 8)."
      responsable="Cesar (venta) / Yoko (arriendo)"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-[var(--color-text-light)] border-b border-[var(--color-border)]">
            <tr>
              <th className="py-2 pr-2">Municipio</th>
              <th className="py-2 pr-2 text-right">Total</th>
              <th className="py-2 pr-2 text-right">Venta</th>
              <th className="py-2 pr-2 text-right">Arriendo</th>
              <th className="py-2 pr-2 text-right">Mediana venta</th>
              <th className="py-2 pr-2 text-right">$/m² venta</th>
              <th className="py-2 pr-2 text-right">Mediana arriendo/mes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.city} className="border-b border-gray-100">
                <td className="py-2 pr-2 font-medium">{r.city}</td>
                <td className="py-2 pr-2 text-right tabular-nums font-semibold">{formatInt(r.total)}</td>
                <td className="py-2 pr-2 text-right tabular-nums text-[var(--color-text-light)]">{formatInt(r.venta)}</td>
                <td className="py-2 pr-2 text-right tabular-nums text-[var(--color-text-light)]">{formatInt(r.arriendo)}</td>
                <td className="py-2 pr-2 text-right tabular-nums">{r.med_venta_m != null ? formatM(r.med_venta_m) : '—'}</td>
                <td className="py-2 pr-2 text-right tabular-nums">{r.med_pxm2_venta_m != null ? formatM(r.med_pxm2_venta_m, 2) : '—'}</td>
                <td className="py-2 pr-2 text-right tabular-nums">{r.med_arriendo_cop != null ? formatCOP(r.med_arriendo_cop) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
