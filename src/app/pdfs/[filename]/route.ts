import { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  // Sanitize: only allow alphanumeric, hyphens, dots
  if (!/^[a-zA-Z0-9._-]+\.pdf$/.test(filename)) {
    return new Response('Not found', { status: 404 })
  }

  const filePath = path.join(process.cwd(), 'public', 'pdfs', filename)

  try {
    const pdf = await readFile(filePath)
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new Response('PDF no encontrado', { status: 404 })
  }
}
