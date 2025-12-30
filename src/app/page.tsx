"use client"

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Image {
  id: string
  url: string
  width: number
  height: number
  selected: boolean
  format: string
}

const BATCH_SIZE = 10

export default function Home() {
  const [urls, setUrls] = useState('')
  const [allImages, setAllImages] = useState<Image[]>([])
  const [displayedImages, setDisplayedImages] = useState<Image[]>([])
  const [format, setFormat] = useState('original')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCount, setSelectedCount] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState({ progress: 0, total: 0 })
  const [downloadMessage, setDownloadMessage] = useState('')

  const fetchImages = async () => {
    const urlsArray = urls.split('\n').map(u => u.trim()).filter(u => u)
    if (urlsArray.length === 0) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/fetch-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: urlsArray })
      })
      if (!response.ok) throw new Error('Failed to fetch images')
      const data = await response.json()
      console.log('API response data:', data)
      const imagesWithSelected = data.images.map((img: any) => ({ ...img, selected: false }))
      console.log('Processed images:', imagesWithSelected)
      setAllImages(imagesWithSelected)
      setDisplayedImages(imagesWithSelected.slice(0, BATCH_SIZE))
      setUrls('')
    } catch (err) {
      setError('画像の取得に失敗しました')
    }
    setLoading(false)
  }

  const selectAll = () => {
    const newAllImages = allImages.map(img => ({ ...img, selected: true }))
    setAllImages(newAllImages)
    setDisplayedImages(displayedImages.map(img => ({ ...img, selected: true })))
  }

  const deselectAll = () => {
    const newAllImages = allImages.map(img => ({ ...img, selected: false }))
    setAllImages(newAllImages)
    setDisplayedImages(displayedImages.map(img => ({ ...img, selected: false })))
  }

  const resetImages = () => {
    setAllImages([])
    setDisplayedImages([])
    setSelectedCount(0)
    setError('')
  }

  const toggleSelect = (id: string) => {
    const newAllImages = allImages.map(img => img.id === id ? { ...img, selected: !img.selected } : img)
    setAllImages(newAllImages)
    const newDisplayedImages = displayedImages.map(img => img.id === id ? { ...img, selected: !img.selected } : img)
    setDisplayedImages(newDisplayedImages)
  }

  const loadMore = useCallback(() => {
    if (displayedImages.length >= allImages.length || loadingMore) return
    setLoadingMore(true)
    const nextBatch = allImages.slice(displayedImages.length, displayedImages.length + BATCH_SIZE)
    setDisplayedImages(prev => [...prev, ...nextBatch])
    setLoadingMore(false)
  }, [allImages, displayedImages, loadingMore])

  const handleScroll = useCallback(() => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
      loadMore()
    }
  }, [loadMore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const count = allImages.filter(img => img.selected).length
    setSelectedCount(count)
  }, [allImages])

  const downloadZip = () => {
    const selected = allImages.filter(img => img.selected)
    if (selected.length === 0) return
    const id = crypto.randomUUID()
    setDownloading(true)
    setDownloadProgress({ progress: 0, total: selected.length })
    setDownloadMessage('')
    const eventSource = new EventSource(`/api/download-progress?id=${id}`)
    eventSource.onopen = () => console.log('SSE opened for id:', id)
    eventSource.onmessage = (event) => {
      console.log('SSE message:', event.data)
      const data = JSON.parse(event.data)
      setDownloadProgress(data)
      if (data.complete) {
        eventSource.close()
        setDownloadMessage('ダウンロードが完了しました！')
        setDownloading(false)
        setTimeout(() => setDownloadMessage(''), 3000)
      }
    }
    eventSource.onerror = (e) => console.log('SSE error:', e)
    // Fetch the ZIP
    fetch('/api/download-zip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: selected.map(img => ({ id: img.id, url: img.url })), format, id })
    }).then(response => {
      if (!response.ok) throw new Error('Failed to download')
      return response.blob()
    }).then(blob => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'images.zip'
      a.click()
      URL.revokeObjectURL(url)
    }).catch(err => {
      setError('ダウンロードに失敗しました')
      setDownloading(false)
    })
  }

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 w-full border-b-4 border-black bg-white/90 backdrop-blur-sm z-50">
        <div className="px-4 md:px-10 py-4 flex items-center justify-between mx-auto max-w-[1400px]">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 rotate-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,0,60,1)]">
              <span className="font-display text-lg uppercase tracking-widest">GET IMAGES!</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display uppercase tracking-widest text-black drop-shadow-sm rotate-1">Blog<span className="text-punk-accent">Pix</span></h1>
          </div>
          <div className="flex gap-4">
            {/* <button className="hidden md:flex items-center justify-center border-2 border-black bg-white px-4 py-1 text-sm font-bold uppercase tracking-wider text-black hover:bg-punk-accent hover:text-white hover:border-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
              History
            </button> */}
            {/* <div className="w-20 h-10 border-2 border-black bg-punk-accent flex items-center justify-center cursor-pointer hover:rotate-12 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined text-white font-bold">person</span>
            </div> */}
          </div>
        </div>
      </header>

      <div className="pt-[80px] flex flex-col min-h-screen">
        <section className="w-full bg-white text-black checker-bg relative pb-12 dripping-border max-w-[960px] mx-auto flex flex-col items-center gap-8 py-12 px-4 relative z-20">
          <div className="text-center flex flex-col gap-4 relative">
            <h2 className="text-5xl md:text-7xl font-display uppercase text-black bg-white px-6 py-2 rotate-[-2deg] border-4 border-black shadow-[8px_8px_0px_0px_#ff003c]">
              BlogPix
            </h2>
            <p className="text-black font-bold bg-white inline-block mx-auto px-2 py-1 text-base md:text-lg border-2 border-black rotate-1 mt-4">
              Paste URL. Get Loot. Download Everything.
            </p>
          </div>
          <div className="w-full max-w-[700px] mt-4">
            <div className="relative flex flex-col md:flex-row w-full items-stretch gap-2">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2"></div>
                <textarea
                  className="relative w-full h-20 md:h-24 bg-white border-4 border-black text-black placeholder:text-gray-500 focus:ring-0 focus:border-punk-accent px-4 py-3 text-base md:text-lg font-mono font-bold uppercase tracking-tight resize-none"
                  placeholder="Enter URLs, one per line...&#10;https://example1.com&#10;https://example2.com"
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="relative md:w-auto w-full group">
                <div className="absolute inset-0 bg-punk-accent translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2"></div>
                <button
                  className="relative w-full h-14 md:h-16 px-8 bg-black hover:bg-zinc-800 text-white font-display text-xl tracking-wider border-4 border-black flex items-center justify-center gap-2 transition-transform active:translate-x-1 active:translate-y-1"
                  onClick={fetchImages}
                  disabled={loading}
                >
                  <span>{loading ? 'FETCHING...' : 'FETCH'}</span>
                  <span className="material-symbols-outlined text-2xl">bolt</span>
                </button>
              </div>
            </div>
          </div>
        </section>

      <section className="sticky top-[80px] w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b-2 border-dashed border-gray-800 bg-black z-30 px-4 md:px-10 mx-auto max-w-[1400px]">


            <div className="flex flex-col gap-2">
              <h3 className="text-3xl font-display text-white flex items-center gap-3">
                <span className="bg-punk-accent text-black px-2 py-1 rotate-2 border border-white">STASH</span>
                <span className="text-gray-400 font-mono text-xl">({selectedCount}/{allImages.length} Items)</span>
              </h3>
              <div className="flex gap-4 mt-2">
                <button
                  className="text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white glitch-hover flex items-center gap-2 group"
                  onClick={selectAll}
                >
                  <span className="w-4 h-4 border border-gray-400 group-hover:bg-white transition-colors"></span>
                  Select All
                </button>
                <button
                  className="text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-punk-accent glitch-hover flex items-center gap-2 group"
                  onClick={deselectAll}
                >
                  <span className="w-4 h-4 border border-gray-400 group-hover:border-punk-accent transition-colors relative">
                    <span className="absolute inset-0 m-auto w-2 h-0.5 bg-punk-accent opacity-0 group-hover:opacity-100 rotate-45"></span>
                    <span className="absolute inset-0 m-auto w-2 h-0.5 bg-punk-accent opacity-0 group-hover:opacity-100 -rotate-45"></span>
                  </span>
                  Deselect
                </button>
                <button
                  className="text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-red-400 glitch-hover flex items-center gap-2 group"
                  onClick={resetImages}
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                  Reset Images
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="relative group/dropdown min-w-[160px]">
                <div className="absolute inset-0 bg-gray-700 translate-x-1 translate-y-1"></div>
                <select
                  className="relative w-full flex items-center justify-between px-4 py-3 bg-black border-2 border-white text-white font-mono font-bold hover:bg-white hover:text-black transition-colors"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="original">ORIGINAL</option>
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                </select>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-white translate-x-1 translate-y-1"></div>
                <button
                  className="relative flex items-center justify-center gap-2 bg-punk-accent hover:bg-red-600 text-white px-6 py-3 border-2 border-transparent font-display text-lg tracking-wide uppercase transition-all active:translate-x-1 active:translate-y-1"
                  onClick={downloadZip}
                  disabled={downloading}
                >
                  <span className="material-symbols-outlined">download</span>
                  <span>{downloading ? 'DOWNLOADING...' : 'Download ZIP'}</span>
                </button>
              </div>
              {downloading && (
                <div className="mt-4 w-full max-w-md">
                  <div className="bg-gray-200 border-4 border-black rounded-lg h-8 overflow-hidden shadow-[4px_4px_0px_0px_#000]">
                    <div
                      className="bg-punk-accent h-full transition-all duration-500 shadow-inner"
                      style={{ width: `${(downloadProgress.progress / downloadProgress.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-2 text-xl font-display text-black">{downloadProgress.progress} / {downloadProgress.total}</p>
                  {downloadMessage && <p className="text-center mt-2 text-xl font-display text-green-600">{downloadMessage}</p>}
                </div>
              )}
            </div>
          </section>
      <section className="flex-1 w-full px-4 md:px-10 mx-auto max-w-[1400px] bg-black text-white">
        <section className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20 relative z-0">
              {displayedImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square bg-gray-900 cursor-pointer overflow-hidden"
                  onClick={() => toggleSelect(image.id)}
                >
                  <div className={`absolute inset-0 border-4 z-30 pointer-events-none ${image.selected ? 'border-punk-accent' : 'border-transparent hover:border-white'} transition-colors`}></div>
                  <div className={`absolute -top-1 -left-1 z-40 p-1 border shadow-[2px_2px_0px_0px_#000] transition-all ${image.selected ? 'bg-punk-accent text-white border-black' : 'bg-black/50 text-transparent hover:bg-punk-accent hover:text-white border-white'}`}>
                    <span className="material-symbols-outlined text-lg font-bold block">check</span>
                  </div>
                  <div className="absolute bottom-2 right-2 z-30">
                    <span className="text-[10px] font-mono font-bold text-black bg-white px-1.5 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
                      {image.width} x {image.height}
                    </span>
                  </div>
                  <Image
                    alt=""
                    className="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-300 group-hover:scale-110"
                    src={image.url}
                    width={300}
                    height={300}
                    unoptimized={true}
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity z-20 mix-blend-overlay"></div>
                </div>
              ))}
            </section>
            {loadingMore && (
              <div className="text-center py-8">
                <span className="text-xl font-display text-white">LOADING MORE...</span>
              </div>
            )}
      </section>
      </div>
      <footer className="w-full border-t-2 border-white py-8 bg-black">
        <div className="px-10 max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-mono text-gray-500">© 2026 BLOGPIX. NO RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a className="text-sm font-bold uppercase tracking-wider text-white hover:text-punk-accent hover:underline transition-colors decoration-wavy underline-offset-4" href="#">Privacy</a>
            <a className="text-sm font-bold uppercase tracking-wider text-white hover:text-punk-accent hover:underline transition-colors decoration-wavy underline-offset-4" href="#">Terms</a>
          </div>
        </div>
      </footer>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
