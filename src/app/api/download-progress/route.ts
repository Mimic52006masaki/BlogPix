import { NextRequest } from 'next/server'
import { progressMap } from '@/lib/progressStore'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return new Response('Missing id', { status: 400 })
  }

  const encoder = new TextEncoder()
  let controller: ReadableStreamDefaultController

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl
      const current = progressMap.get(id)
      if (current) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(current)}\n\n`))
      }
    }
  })

  // ポーリングしてプログレスを送る
  const sendProgress = () => {
    const current = progressMap.get(id)
    if (current && controller) {
      console.log('Sending progress:', current)
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(current)}\n\n`))
      if (current.complete) {
        controller.close()
        progressMap.delete(id) // クリーンアップ
      } else {
        setTimeout(sendProgress, 500)
      }
    }
  }

  setTimeout(sendProgress, 500)

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}