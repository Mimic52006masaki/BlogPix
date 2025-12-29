import axios from 'axios'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
  const { url } = await request.json()
  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    const images: any[] = []
    $('img').each((i, elem) => {
      let src = $(elem).attr('src') || $(elem).attr('data-src') || ''
      if (src) {
        // 広告除外ロジック
        if (!src.includes('ads') && !src.includes('banner') && !src.includes('ad.') && src.length > 10) {
          if (!src.startsWith('http')) {
            src = new URL(src, url).href
          }
          images.push({
            id: `img-${i}`,
            url: src,
            width: 800, // dummy, actual size later
            height: 600,
            format: src.includes('.png') ? 'png' : 'jpg'
          })
        }
      }
    })
    return Response.json({ images: images.slice(0, 50) })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}