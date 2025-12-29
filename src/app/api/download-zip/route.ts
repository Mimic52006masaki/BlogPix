import JSZip from 'jszip'
import axios from 'axios'
import sharp from 'sharp'

export async function POST(request: Request) {
  const { images, format } = await request.json()
  const zip = new JSZip()
  for (const img of images) {
    try {
      const { data } = await axios.get(img.url, { responseType: 'arraybuffer' })
      let buffer = Buffer.from(data)
      if (format !== 'original') {
        buffer = await sharp(buffer).toFormat(format as any).toBuffer()
      }
      const ext = format === 'original' ? (img.url.includes('.png') ? 'png' : 'jpg') : format
      zip.file(`${img.id}.${ext}`, buffer)
    } catch (e) {
      console.error('Error processing image:', img.url, e)
    }
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  return new Response(zipBlob, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="images.zip"'
    }
  })
}