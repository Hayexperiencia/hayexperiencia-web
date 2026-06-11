import { NextResponse } from 'next/server'
import { getPool } from '@/lib/pg'

const VALID_STATUS = ['disponible', 'reservado', 'vendido', 'bloqueado']

/**
 * Acciones masivas sobre unidades seleccionadas:
 *  - { ids, action: 'status',    value: 'reservado' }
 *  - { ids, action: 'price_pct', value: 5 }        → +5% (negativo = rebaja)
 *  - { ids, action: 'price_set', value: 180000000 } → precio fijo
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Body JSON invalido' }, { status: 400 })

  const ids: number[] = Array.isArray(body.ids)
    ? body.ids.map(Number).filter((n: number) => Number.isInteger(n) && n > 0)
    : []
  if (ids.length === 0 || ids.length > 200) {
    return NextResponse.json({ error: 'ids: lista de 1 a 200 unidades' }, { status: 400 })
  }

  const p = await getPool()

  if (body.action === 'status') {
    if (!VALID_STATUS.includes(body.value)) {
      return NextResponse.json({ error: `value debe ser uno de: ${VALID_STATUS.join(', ')}` }, { status: 400 })
    }
    const { rowCount } = await p.query(
      `UPDATE hei_inventory_units SET unit_status = $1, updated_at = NOW() WHERE id = ANY($2::int[])`,
      [body.value, ids]
    )
    return NextResponse.json({ ok: true, updated: rowCount })
  }

  if (body.action === 'price_pct') {
    const pct = Number(body.value)
    if (!Number.isFinite(pct) || pct < -50 || pct > 100) {
      return NextResponse.json({ error: 'value: porcentaje entre -50 y 100' }, { status: 400 })
    }
    const { rowCount } = await p.query(
      `UPDATE hei_inventory_units
       SET list_price = ROUND(list_price * (1 + $1::numeric / 100)), updated_at = NOW()
       WHERE id = ANY($2::int[])`,
      [pct, ids]
    )
    return NextResponse.json({ ok: true, updated: rowCount })
  }

  if (body.action === 'price_set') {
    const price = Number(body.value)
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: 'value: precio en COP mayor a 0' }, { status: 400 })
    }
    const { rowCount } = await p.query(
      `UPDATE hei_inventory_units SET list_price = $1, updated_at = NOW() WHERE id = ANY($2::int[])`,
      [Math.round(price), ids]
    )
    return NextResponse.json({ ok: true, updated: rowCount })
  }

  return NextResponse.json({ error: 'action invalida (status | price_pct | price_set)' }, { status: 400 })
}
