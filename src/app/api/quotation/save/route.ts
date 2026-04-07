import { NextResponse } from 'next/server'

let pool: import('pg').Pool | null = null

async function getPool() {
  if (!pool) {
    const { Pool } = await import('pg')
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

export async function POST(request: Request) {
  const body = await request.json()
  const { unit_id, project_id, payment_plan, client_data, channel } = body

  if (!unit_id || !project_id || !payment_plan) {
    return NextResponse.json({ error: 'unit_id, project_id y payment_plan son requeridos' }, { status: 400 })
  }

  const p = await getPool()
  const client = await p.connect()
  try {
    const counterResult = await client.query(`
      UPDATE hei_system_config
      SET value = (value::integer + 1)::text, updated_at = NOW()
      WHERE key = 'quotation_counter'
      RETURNING value
    `)
    const counter = counterResult.rows[0].value.padStart(5, '0')
    const year = new Date().getFullYear()
    const quotation_code = `HEI-${year}-${counter}`

    const { rows } = await client.query(`
      INSERT INTO hei_quotations (
        quotation_code, unit_id, project_id,
        list_price, separation_value, ci_percentage, ci_amount,
        ci_installments, ci_monthly, ci_target_date,
        financing_amount, reference_rate_ea, loan_term_months,
        monthly_payment_est, income_required_est,
        client_name, client_phone, client_email, client_city,
        channel
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      RETURNING id, quotation_code
    `, [
      quotation_code, unit_id, project_id,
      payment_plan.list_price, payment_plan.separation_value,
      payment_plan.ci_percentage, payment_plan.ci_amount,
      payment_plan.ci_installments, payment_plan.ci_monthly,
      payment_plan.ci_target_date_iso,
      payment_plan.financing_amount, payment_plan.reference_rate_ea,
      payment_plan.loan_term_months,
      payment_plan.total_monthly_with_insurance,
      payment_plan.income_required,
      client_data?.name || null, client_data?.phone || null,
      client_data?.email || null, client_data?.city || null,
      channel || 'web'
    ])

    return NextResponse.json({
      quotation_code: rows[0].quotation_code,
      quotation_id: rows[0].id,
    })

  } finally {
    client.release()
  }
}
