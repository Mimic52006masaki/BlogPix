import JSZip from 'jszip'
import { NextRequest } from 'next/server'
import { progressMap } from '../download-progress/route'

export const runtime = 'nodejs'

type DownloadImage = {
  id: string
  url: string
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const images = body.images as DownloadImage[]
  const format = body.format as string
  const id = body.id as string

  if (!id) {
    return new Response('Missing id', { status: 400 })
  }

  console.log('Downloading images:', images.map((img: DownloadImage) => img.url))

  progressMap.set(id, { progress: 0, total: images.length, complete: false })

  const zip = new JSZip()

  let current = 0
  for (const img of images) {
    const res = await fetch(img.url)
    const buffer = await res.arrayBuffer()
    zip.file(`${img.id}.${format === 'original' ? 'jpg' : format}`, buffer)
    current++
    progressMap.set(id, { progress: current, total: images.length, complete: false })
  }

  progressMap.set(id, { progress: images.length, total: images.length, complete: true })

  const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' })

  return new Response(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="images.zip"',
    },
  })
}