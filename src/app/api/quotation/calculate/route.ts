import { NextResponse } from 'next/server'
import { getPool } from '@/lib/pg'
import { calculatePlanForUnit } from '@/lib/quotation-pipeline'
import { asPositiveInt, parseOverrides } from '@/lib/validate'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  if (!rateLimit(`calc:${clientIp(request)}`, 60)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes, intenta en un minuto' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Body JSON invalido' }, { status: 400 })

  const unitId = asPositiveInt(body.unit_id)
  if (!unitId) {
    return NextResponse.json({ error: 'unit_id es requerido' }, { status: 400 })
  }
  // Overrides acotados por el motor (ci_percentage, ci_installments,
  // loan_term_years, reference_rate_ea) — soporta el body plano legacy de Harry
  // ({"unit_id":42,"ci_installments":18}) y el shape v2 ({overrides:{...}}).
  const overrides = parseOverrides(body.overrides) ?? parseOverrides(body)

  const p = await getPool()
  const client = await p.connect()
  try {
    const calc = await calculatePlanForUnit(client, unitId, overrides)
    if (!calc) {
      return NextResponse.json({ error: 'Unidad no encontrada' }, { status: 404 })
    }
    return NextResponse.json({
      unit: calc.unit,
      project: calc.project,
      payment_plan: calc.payment_plan,
    })
  } catch (e) {
    console.error('calculate error:', e)
    return NextResponse.json({ error: 'Error calculando el plan' }, { status: 500 })
  } finally {
    client.release()
  }
}
