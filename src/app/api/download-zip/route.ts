import JSZip from 'jszip'
import axios from 'axios'
import sharp from 'sharp'
import { progressMap } from '../download-progress/route'

export async function POST(request: Request) {
  const { images, format, id } = await request.json()
  if (!id) {
    return new Response('Missing id', { status: 400 })
  }
  console.log('Downloading images:', images.map(img => img.url))
  progressMap.set(id, { progress: 0, total: images.length, complete: false })
  const zip = new JSZip()
  for (const img of images) {
    try {
      console.log('Processing image:', img.url)
      const { data } = await axios.get(img.url, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })
      let buffer = Buffer.from(data)
      if (format !== 'original') {
        buffer = await sharp(buffer).toFormat(format as any).toBuffer()
      }
      const ext = format === 'original' ? (img.url.includes('.png') ? 'png' : 'jpg') : format
      zip.file(`${img.id}.${ext}`, buffer)
      console.log('Added to zip:', img.url)
      const current = progressMap.get(id)
      if (current) {
        progressMap.set(id, { ...current, progress: current.progress + 1 })
      }
    } catch (e) {
      console.error('Error processing image:', img.url, e instanceof Error ? e.message : String(e))
    }
    // レート制限回避のため1秒待機
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  progressMap.set(id, { ...progressMap.get(id)!, complete: true })
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  return new Response(zipBlob, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="images.zip"'
    }
  })
}