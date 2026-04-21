import { NextResponse } from 'next/server'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import path from 'path'
import { Readable } from 'stream'

const MEDIA_ROOT = process.env.MEDIA_ROOT || path.join(process.cwd(), 'media')

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await context.params
  const rel = segments.join('/')
  const absolute = path.resolve(MEDIA_ROOT, rel)

  if (!absolute.startsWith(path.resolve(MEDIA_ROOT) + path.sep)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  let info
  try {
    info = await stat(absolute)
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
  if (!info.isFile()) {
    return new NextResponse('Not found', { status: 404 })
  }

  const ext = path.extname(absolute).toLowerCase()
  const contentType = MIME[ext] || 'application/octet-stream'
  const etag = `W/"${info.size.toString(16)}-${info.mtimeMs.toString(16)}"`

  const stream = Readable.toWeb(createReadStream(absolute)) as ReadableStream

  return new NextResponse(stream, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': info.size.toString(),
      'Cache-Control': 'public, max-age=3600, must-revalidate',
      ETag: etag,
      'Last-Modified': info.mtime.toUTCString(),
    },
  })
}
