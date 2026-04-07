import { NextResponse } from 'next/server'

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://host.docker.internal:3001'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { unit, project, payment_plan, quotation_code, client_name } = body

    if (!unit || !payment_plan) {
      return NextResponse.json({ error: 'unit y payment_plan son requeridos' }, { status: 400 })
    }

    const res = await fetch(`${PDF_SERVICE_URL}/pdf/cotizacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unit, project, payment_plan, quotation_code, client_name }),
      signal: AbortSignal.timeout(30000),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'PDF service error' }))
      return NextResponse.json(err, { status: res.status })
    }

    const pdf = await res.arrayBuffer()
    const filename = `${quotation_code || 'HEI'}-${(unit.unit_code || 'unidad').replace(/\s+/g, '')}.pdf`

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Error generando PDF' }, { status: 500 })
  }
}
