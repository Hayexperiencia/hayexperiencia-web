import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const MEDIA_ROOT = process.env.MEDIA_ROOT || path.join(process.cwd(), 'media')

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const folder = (formData.get('folder') as string) || 'general'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const ext = path.extname(file.name).toLowerCase()
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg']
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
  }

  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '-')
  if (safeFolder.includes('..')) {
    return NextResponse.json({ error: 'Carpeta invalida' }, { status: 400 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
  const timestamp = Date.now()
  const filename = `${timestamp}-${safeName}`

  const dir = path.join(MEDIA_ROOT, safeFolder)
  await mkdir(dir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  const filePath = path.join(dir, filename)
  await writeFile(filePath, buffer)

  const publicUrl = `/media/${safeFolder}/${filename}`
  return NextResponse.json({ url: publicUrl, filename })
}
