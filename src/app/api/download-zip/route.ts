import { NextRequest } from 'next/server'
import JSZip from 'jszip'

export const runtime = 'nodejs' // ← ★ これがないと必ず落ちる

type DownloadImage = {
  id: string
  url: string
}

type RequestBody = {
  images: DownloadImage[]
  format: string
  id: string
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RequestBody
  const { images, format, id } = body

  if (!id) {
    return new Response('Missing id', { status: 400 })
  }

  console.log('Downloading images:', images.map((img) => img.url))

  const zip = new JSZip()

  for (const img of images) {
    const res = await fetch(img.url)
    const buffer = await res.arrayBuffer()
    zip.file(
      `${img.id}.${format === 'original' ? 'jpg' : format}`,
      buffer
    )
  }

  const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' })

  return new Response(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="images.zip"',
    },
  })
}