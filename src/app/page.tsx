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
  const [url, setUrl] = useState('')
  const [allImages, setAllImages] = useState<Image[]>([])
  const [displayedImages, setDisplayedImages] = useState<Image[]>([])
  const [format, setFormat] = useState('original')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchImages = async () => {
    if (!url) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/fetch-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      if (!response.ok) throw new Error('Failed to fetch images')
      const data = await response.json()
      const imagesWithSelected = data.images.map((img: any) => ({ ...img, selected: false }))
      setAllImages(imagesWithSelected)
      setDisplayedImages(imagesWithSelected.slice(0, BATCH_SIZE))
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
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      loadMore()
    }
  }, [loadMore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const downloadZip = async () => {
    const selected = allImages.filter(img => img.selected)
    if (selected.length === 0) return
    try {
      const response = await fetch('/api/download-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: selected.map(img => ({ id: img.id, url: img.url })), format })
      })
      if (!response.ok) throw new Error('Failed to download')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'images.zip'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('ダウンロードに失敗しました')
    }
  }

  return (
    <div className="min-h-screen">
      <header className="w-full border-b-4 border-black bg-comic-yellow relative z-30 sticky top-0 shadow-comic">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')]"></div>
        <div className="px-4 md:px-10 py-3 flex items-center justify-between mx-auto max-w-[1400px] relative">
          <div className="flex items-center gap-4">
            <div className="bg-white text-black p-2 -rotate-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full">
              <span className="material-symbols-outlined !text-4xl">menu_book</span>
            </div>
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-display uppercase tracking-wider text-punk-accent drop-shadow-[2px_2px_0px_#000] rotate-1 stroke-black" style={{ WebkitTextStroke: '1.5px black' }}>
                Image<span className="text-white">Extractor</span>
              </h1>
              <span className="absolute -top-3 -right-8 bg-black text-white text-xs font-bold px-2 py-0.5 rotate-12 rounded-sm border-2 border-white">POW!</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="hidden md:flex items-center justify-center border-4 border-black bg-white px-6 py-2 text-xl font-display uppercase tracking-wider text-black hover:bg-comic-cyan hover:-translate-y-1 transition-all shadow-comic active:translate-y-0 active:shadow-none rounded-lg">
              History
            </button>
            <div className="w-12 h-12 border-4 border-black bg-punk-accent flex items-center justify-center cursor-pointer hover:rotate-12 transition-transform shadow-comic rounded-full">
              <span className="material-symbols-outlined text-white font-bold text-2xl">person</span>
            </div>
          </div>
        </div>
      </header>
      <div className="w-full max-w-[1400px] mx-auto pt-10 pb-6 px-4 relative z-20">
        <div className="comic-panel bg-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-comic-cyan rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-comic-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute inset-0 speed-lines opacity-50 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="text-center flex flex-col items-center relative">
              <div className="speech-bubble px-8 py-4 mb-6 inline-block transform -rotate-1 shadow-comic bg-comic-cyan">
                <p className="text-xl md:text-2xl font-display uppercase text-black">
                  Hey You! Paste that URL!
                </p>
              </div>
              <h2 className="text-6xl md:text-8xl font-display uppercase text-black leading-[0.9] transform rotate-[-2deg] drop-shadow-[4px_4px_0px_rgba(255,0,60,1)]" style={{ WebkitTextStroke: '2px black', color: 'white' }}>
                RIP <span className="text-punk-accent">IMAGES</span>
              </h2>
              <div className="bg-black text-white px-4 py-1 mt-4 transform rotate-1 border-2 border-white shadow-comic">
                <p className="font-bold font-comic text-lg md:text-xl uppercase tracking-widest">
                  Download Everything • Get Loot • No Mercy
                </p>
              </div>
            </div>
            <div className="w-full max-w-[800px] mt-6 p-4 border-4 border-black border-dashed bg-comic-dots rounded-xl relative">
              <div className="absolute -top-3 -left-3 bg-punk-accent border-2 border-black text-white px-2 font-display text-lg transform -rotate-6 shadow-sm">STEP 1</div>
              <div className="flex flex-col md:flex-row w-full items-stretch gap-4 relative z-10">
                <div className="flex-1 relative group">
                  <input
                    className="w-full h-16 bg-white border-4 border-black text-black placeholder:text-gray-400 focus:ring-0 focus:border-comic-cyan px-6 text-xl font-comic font-bold shadow-comic transition-all focus:shadow-comic-lg rounded-lg"
                    placeholder="HTTPS://URL.HERE..."
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="relative md:w-auto w-full group">
                  <button
                    className="w-full h-16 px-10 bg-comic-yellow hover:bg-yellow-300 text-black font-display text-3xl tracking-wider border-4 border-black flex items-center justify-center gap-2 transition-all shadow-comic hover:shadow-comic-lg hover:-translate-y-1 active:translate-y-0 active:shadow-none rounded-lg transform md:rotate-1"
                    onClick={fetchImages}
                    disabled={loading}
                  >
                    <span>{loading ? 'LOADING...' : 'BOOM!'}</span>
                    <span className="material-symbols-outlined text-4xl">bolt</span>
                  </button>
                </div>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
      <main className="flex-grow flex flex-col w-full px-4 md:px-10 py-8 mx-auto max-w-[1400px] gap-8 relative z-0">
        {displayedImages.length > 0 && (
          <section className="comic-panel p-6 w-full flex flex-col md:flex-row items-center justify-between gap-6 bg-white transform rotate-[0.5deg]">
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <h3 className="text-4xl font-display text-black flex items-center gap-3">
                <span className="text-punk-accent" style={{ WebkitTextStroke: '1px black' }}>THE STASH</span>
                <span className="bg-black text-white text-lg px-3 py-1 font-mono rounded-full border-2 border-black -rotate-3 transform shadow-[2px_2px_0px_#ccc]">({displayedImages.length} Items)</span>
              </h3>
              <div className="flex gap-4 mt-1 pl-1">
                <button
                  className="text-sm font-bold uppercase tracking-wider text-black hover:text-punk-accent flex items-center gap-2 group decoration-2 hover:underline underline-offset-4"
                  onClick={selectAll}
                >
                  <span className="w-5 h-5 border-2 border-black bg-white group-hover:bg-punk-accent transition-colors shadow-[2px_2px_0px_#000]"></span>
                  Select All
                </button>
                <button
                  className="text-sm font-bold uppercase tracking-wider text-black hover:text-punk-accent flex items-center gap-2 group decoration-2 hover:underline underline-offset-4"
                  onClick={deselectAll}
                >
                  <span className="w-5 h-5 border-2 border-black bg-white group-hover:border-punk-accent transition-colors relative shadow-[2px_2px_0px_#000]">
                    <span className="absolute inset-0 m-auto w-3 h-0.5 bg-black group-hover:bg-punk-accent rotate-45"></span>
                    <span className="absolute inset-0 m-auto w-3 h-0.5 bg-black group-hover:bg-punk-accent -rotate-45"></span>
                  </span>
                  Deselect
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
              <div className="relative group/dropdown min-w-[160px]">
                <select
                  className="relative w-full flex items-center justify-between px-4 py-3 bg-white border-4 border-black text-black font-display text-xl tracking-wide hover:bg-gray-50 shadow-comic rounded-lg"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="original">ORIGINAL</option>
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                </select>
              </div>
              <div className="relative">
                <button
                  className="relative flex items-center justify-center gap-2 bg-punk-accent hover:bg-red-600 text-white px-8 py-3 border-4 border-black font-display text-2xl tracking-wide uppercase transition-all shadow-comic hover:shadow-comic-lg hover:-translate-y-1 active:translate-y-0 active:shadow-none rounded-lg"
                  onClick={downloadZip}
                >
                  <span className="material-symbols-outlined">download</span>
                  <span>Download ZIP</span>
                </button>
              </div>
            </div>
          </section>
        )}
        {displayedImages.length > 0 && (
          <section className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-20">
            {displayedImages.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square bg-white p-2 border-4 border-black shadow-comic transform hover:-rotate-1 transition-transform duration-300 cursor-pointer"
                onClick={() => toggleSelect(image.id)}
              >
                <div className="w-full h-full relative overflow-hidden border-2 border-black">
                  <div className={`absolute -top-2 -left-2 z-40 ${image.selected ? 'bg-comic-cyan' : 'bg-white group-hover:bg-comic-cyan'} text-${image.selected ? 'black' : 'transparent group-hover:text-black'} p-1 border-2 border-black rounded-full transition-colors`}>
                    <span className="material-symbols-outlined text-lg font-bold block">check</span>
                  </div>
                  <div className="absolute bottom-0 right-0 z-30 bg-comic-yellow border-t-2 border-l-2 border-black px-2 py-1">
                    <span className="text-xs font-bold font-mono text-black">{image.width} x {image.height}</span>
                  </div>
                  <Image
                    alt=""
                    className="w-full h-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110"
                    src={image.url}
                    width={300}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 pointer-events-none z-20"></div>
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  <span className="bg-white border-2 border-black px-2 py-0.5 font-display text-lg text-black shadow-[2px_2px_0px_#000]">NICE!</span>
                </div>
              </div>
            ))}
          </section>
        )}
        {loadingMore && (
          <div className="text-center py-8">
            <span className="text-xl font-display text-black">LOADING MORE...</span>
          </div>
        )}
      </main>
    </div>
  )
}