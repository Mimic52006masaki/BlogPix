import axios from 'axios'
import cheerio from 'cheerio'

export async function POST(request: Request) {
  const { urls } = await request.json()
  if (!Array.isArray(urls) || urls.length === 0) {
    return Response.json({ error: 'URLs must be a non-empty array' }, { status: 400 })
  }
  try {
    const allImages: any[] = []
    for (const url of urls) {
      console.log(`Fetching URL: ${url}`)
      const { data } = await axios.get(url)
      const $ = cheerio.load(data)
      const imgCount = $('img').length
      console.log(`Found ${imgCount} img tags in ${url}`)
      $('img').each((i, elem) => {
        let src = $(elem).attr('src') || $(elem).attr('data-src') || ''
        if (src) {
          console.log(`Processing img src: ${src}`)
          // 広告除外ロジック
          if (!src.includes('ads') && !src.includes('banner') && !src.includes('ad.') && src.length > 10) {
            if (!src.startsWith('http')) {
              src = new URL(src, url).href
            }
            console.log(`Added image: ${src}`)
            allImages.push({
              id: `img-${allImages.length}`,
              url: src,
              width: 800, // dummy, actual size later
              height: 600,
              format: src.includes('.png') ? 'png' : 'jpg'
            })
          } else {
            console.log(`Filtered out: ${src}`)
          }
        }
      })
    }
    console.log(`Total images collected: ${allImages.length}`)
    return Response.json({ images: allImages.slice(0, 200) }) // 複数URLなので上限を増やす
  } catch (error) {
    console.error(`Error fetching images: ${error instanceof Error ? error.message : String(error)}`)
    return Response.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}