import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://host.docker.internal:3001'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { unit, project, payment_plan, quotation_code, client_name, client_phone, client_email, return_url } = body

    if (!unit || !payment_plan) {
      return NextResponse.json({ error: 'unit y payment_plan son requeridos' }, { status: 400 })
    }

    const res = await fetch(`${PDF_SERVICE_URL}/pdf/cotizacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unit, project, payment_plan, quotation_code, client_name, client_phone, client_email }),
      signal: AbortSignal.timeout(30000),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'PDF service error' }))
      return NextResponse.json(err, { status: res.status })
    }

    const pdf = Buffer.from(await res.arrayBuffer())
    const code = quotation_code || `HEI-${Date.now()}`
    const safeCode = code.replace(/[^a-zA-Z0-9-]/g, '')
    const unitCode = (unit.unit_code || 'unidad').replace(/\s+/g, '')
    const filename = `${safeCode}-${unitCode}.pdf`

    // Save to public/pdfs/ so it's accessible by URL
    const pdfDir = path.join(process.cwd(), 'public', 'pdfs')
    await mkdir(pdfDir, { recursive: true })
    await writeFile(path.join(pdfDir, filename), pdf)

    const pdfUrl = `/pdfs/${filename}`

    // If caller wants URL instead of binary (Harry, API clients)
    if (return_url) {
      return NextResponse.json({ url: pdfUrl, filename })
    }

    // Default: return binary PDF (web browser download)
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
