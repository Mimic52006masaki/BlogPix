# 03_ScreenSpecifications.md

## 1. URL入力画面
- 入力フォーム: URL入力用テキストボックス
- ボタン: 「画像を取得」
- バリデーション: URL形式チェック
- エラーメッセージ: 無効なURL、取得失敗時に表示

## 2. 画像一覧画面
- グリッド表示: サムネイル＋解像度表示
- チェックボックス: 選択/解除
- 操作ボタン:
  - 「全選択」
  - 「全解除」
  - 「ZIPでダウンロード」
- 変換形式選択ドロップダウン（PNG/JPG）
- スクロール: 無限スクロール対応（※仮定: 最大50件）

## 3. ダウンロード処理
- 選択画像をサーバーレスAPIに送信
- ZIP形式でブラウザに返却

## 4.参考イメージ
<!DOCTYPE html>
<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>URL Image Extractor - Comic Punk Edition</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Bangers&amp;family=Permanent+Marker&amp;family=Roboto+Mono:wght@400;700&amp;family=Comic+Neue:wght@400;700&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "punk-black": "#050505",
                        "punk-white": "#f0f0f0",
                        "punk-accent": "#ff003c",
                        "comic-yellow": "#f9d71c",
                        "comic-cyan": "#00e0ff",
                        "comic-dots": "#e5e5e5",
                    },
                    fontFamily: {
                        "display": ["Bangers", "cursive"],
                        "marker": ["Permanent Marker", "cursive"],
                        "comic": ["Comic Neue", "cursive"],
                        "mono": ["Roboto Mono", "monospace"]
                    },
                    backgroundImage: {
                        'halftone-pattern': "radial-gradient(circle, #333 1px, transparent 1px)",
                        'halftone-light': "radial-gradient(circle, #000 1px, transparent 1px)"
                    },
                    backgroundSize: {
                        'halftone': '20px 20px'
                    },
                    boxShadow: {
                        'comic': '4px 4px 0px 0px #000',
                        'comic-lg': '8px 8px 0px 0px #000',
                        'comic-xl': '12px 12px 0px 0px #000',
                    }
                },
            },
        }
    </script>
<style>
    body {
        font-family: "Comic Neue", "Roboto Mono", monospace;
        background-color: #f0f0f0;
        color: #050505;
        background-image: radial-gradient(#ccc 15%, transparent 16%), radial-gradient(#ccc 15%, transparent 16%);
        background-size: 20px 20px;
        background-position: 0 0, 10px 10px;
    }
    .comic-panel {
        background-color: white;
        border: 4px solid black;
        box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
    }
    .speech-bubble {
        position: relative;
        background: #fff;
        border: 4px solid #000;
        border-radius: .4em;
    }
    .speech-bubble:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 20%;
        width: 0;
        height: 0;
        border: 20px solid transparent;
        border-top-color: #000;
        border-bottom: 0;
        margin-left: -20px;
        margin-bottom: -20px;
    }
    .speech-bubble-right:after {
        left: 80%;
    }::-webkit-scrollbar {
        width: 16px;
    }
    ::-webkit-scrollbar-track {
        background: #fff;
        border-left: 2px solid #000;
        background-image: radial-gradient(circle, #000 1px, transparent 1px);
        background-size: 8px 8px;
    }
    ::-webkit-scrollbar-thumb {
        background: #f9d71c;
        border: 3px solid #000;
        border-radius: 999px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #ff003c;
    }
    .halftone-bg {
        background-image: radial-gradient(circle, rgba(0,0,0,0.1) 2px, transparent 2.5px);
        background-size: 10px 10px;
    }
    .speed-lines {
        background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.05) 10px,
            rgba(0,0,0,0.05) 20px
        );
    }
</style>
</head>
<body class="min-h-screen flex flex-col overflow-x-hidden selection:bg-comic-yellow selection:text-black">
<header class="w-full border-b-4 border-black bg-comic-yellow relative z-30 sticky top-0 shadow-comic">
<div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')]"></div>
<div class="px-4 md:px-10 py-3 flex items-center justify-between mx-auto max-w-[1400px] relative">
<div class="flex items-center gap-4">
<div class="bg-white text-black p-2 -rotate-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full">
<span class="material-symbols-outlined !text-4xl">menu_book</span>
</div>
<div class="relative">
<h1 class="text-4xl md:text-5xl font-display uppercase tracking-wider text-punk-accent drop-shadow-[2px_2px_0px_#000] rotate-1 stroke-black" style="-webkit-text-stroke: 1.5px black;">
                    Image<span class="text-white">Extractor</span>
</h1>
<span class="absolute -top-3 -right-8 bg-black text-white text-xs font-bold px-2 py-0.5 rotate-12 rounded-sm border-2 border-white">POW!</span>
</div>
</div>
<div class="flex gap-4">
<button class="hidden md:flex items-center justify-center border-4 border-black bg-white px-6 py-2 text-xl font-display uppercase tracking-wider text-black hover:bg-comic-cyan hover:-translate-y-1 transition-all shadow-comic active:translate-y-0 active:shadow-none rounded-lg">
                History
            </button>
<div class="w-12 h-12 border-4 border-black bg-punk-accent flex items-center justify-center cursor-pointer hover:rotate-12 transition-transform shadow-comic rounded-full">
<span class="material-symbols-outlined text-white font-bold text-2xl">person</span>
</div>
</div>
</div>
</header>
<div class="w-full max-w-[1400px] mx-auto pt-10 pb-6 px-4 relative z-20">
<div class="comic-panel bg-white p-8 md:p-12 relative overflow-hidden">
<div class="absolute top-0 right-0 w-64 h-64 bg-comic-cyan rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
<div class="absolute bottom-0 left-0 w-64 h-64 bg-comic-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
<div class="absolute inset-0 speed-lines opacity-50 pointer-events-none"></div>
<div class="relative z-10 flex flex-col items-center gap-8">
<div class="text-center flex flex-col items-center relative">
<div class="speech-bubble px-8 py-4 mb-6 inline-block transform -rotate-1 shadow-comic bg-comic-cyan">
<p class="text-xl md:text-2xl font-display uppercase text-black">
                        Hey You! Paste that URL!
                    </p>
</div>
<h2 class="text-6xl md:text-8xl font-display uppercase text-black leading-[0.9] transform rotate-[-2deg] drop-shadow-[4px_4px_0px_rgba(255,0,60,1)]" style="-webkit-text-stroke: 2px black; color: white;">
                    RIP <span class="text-punk-accent">IMAGES</span>
</h2>
<div class="bg-black text-white px-4 py-1 mt-4 transform rotate-1 border-2 border-white shadow-comic">
<p class="font-bold font-comic text-lg md:text-xl uppercase tracking-widest">
                        Download Everything • Get Loot • No Mercy
                    </p>
</div>
</div>
<div class="w-full max-w-[800px] mt-6 p-4 border-4 border-black border-dashed bg-comic-dots rounded-xl relative">
<div class="absolute -top-3 -left-3 bg-punk-accent border-2 border-black text-white px-2 font-display text-lg transform -rotate-6 shadow-sm">STEP 1</div>
<div class="flex flex-col md:flex-row w-full items-stretch gap-4 relative z-10">
<div class="flex-1 relative group">
<input class="w-full h-16 bg-white border-4 border-black text-black placeholder:text-gray-400 focus:ring-0 focus:border-comic-cyan px-6 text-xl font-comic font-bold shadow-comic transition-all focus:shadow-comic-lg rounded-lg" placeholder="HTTPS://URL.HERE..." type="url" value="https://example.com/blog/travel-photography-tips"/>
</div>
<div class="relative md:w-auto w-full group">
<button class="w-full h-16 px-10 bg-comic-yellow hover:bg-yellow-300 text-black font-display text-3xl tracking-wider border-4 border-black flex items-center justify-center gap-2 transition-all shadow-comic hover:shadow-comic-lg hover:-translate-y-1 active:translate-y-0 active:shadow-none rounded-lg transform md:rotate-1">
<span>BOOM!</span>
<span class="material-symbols-outlined text-4xl">bolt</span>
</button>
</div>
</div>
</div>
</div>
</div>
</div>
<main class="flex-grow flex flex-col w-full px-4 md:px-10 py-8 mx-auto max-w-[1400px] gap-8 relative z-0">
<section class="comic-panel p-6 w-full flex flex-col md:flex-row items-center justify-between gap-6 bg-white transform rotate-[0.5deg]">
<div class="flex flex-col gap-1 w-full md:w-auto">
<h3 class="text-4xl font-display text-black flex items-center gap-3">
<span class="text-punk-accent" style="-webkit-text-stroke: 1px black;">THE STASH</span>
<span class="bg-black text-white text-lg px-3 py-1 font-mono rounded-full border-2 border-black -rotate-3 transform shadow-[2px_2px_0px_#ccc]">(24 Items)</span>
</h3>
<div class="flex gap-4 mt-1 pl-1">
<button class="text-sm font-bold uppercase tracking-wider text-black hover:text-punk-accent flex items-center gap-2 group decoration-2 hover:underline underline-offset-4">
<span class="w-5 h-5 border-2 border-black bg-white group-hover:bg-punk-accent transition-colors shadow-[2px_2px_0px_#000]"></span>
                    Select All
                </button>
<button class="text-sm font-bold uppercase tracking-wider text-black hover:text-punk-accent flex items-center gap-2 group decoration-2 hover:underline underline-offset-4">
<span class="w-5 h-5 border-2 border-black bg-white group-hover:border-punk-accent transition-colors relative shadow-[2px_2px_0px_#000]">
<span class="absolute inset-0 m-auto w-3 h-0.5 bg-black group-hover:bg-punk-accent rotate-45"></span>
<span class="absolute inset-0 m-auto w-3 h-0.5 bg-black group-hover:bg-punk-accent -rotate-45"></span>
</span>
                    Deselect
                </button>
</div>
</div>
<div class="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
<div class="relative group/dropdown min-w-[160px]">
<button class="relative w-full flex items-center justify-between px-4 py-3 bg-white border-4 border-black text-black font-display text-xl tracking-wide hover:bg-gray-50 shadow-comic rounded-lg">
<span>ORIGINAL</span>
<span class="material-symbols-outlined text-2xl">expand_more</span>
</button>
</div>
<div class="relative">
<button class="relative flex items-center justify-center gap-2 bg-punk-accent hover:bg-red-600 text-white px-8 py-3 border-4 border-black font-display text-2xl tracking-wide uppercase transition-all shadow-comic hover:shadow-comic-lg hover:-translate-y-1 active:translate-y-0 active:shadow-none rounded-lg">
<span class="material-symbols-outlined">download</span>
<span>Download ZIP</span>
</button>
</div>
</div>
</section>
<section class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-20">
<div class="group relative aspect-square bg-white p-2 border-4 border-black shadow-comic transform hover:-rotate-1 transition-transform duration-300">
<div class="w-full h-full relative overflow-hidden border-2 border-black">
<div class="absolute -top-2 -left-2 z-40 bg-comic-cyan text-black p-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-full">
<span class="material-symbols-outlined text-lg font-bold block">check</span>
</div>
<div class="absolute bottom-0 right-0 z-30 bg-comic-yellow border-t-2 border-l-2 border-black px-2 py-1">
<span class="text-xs font-bold font-mono text-black">1920 x 1080</span>
</div>
<img alt="Scenic mountain landscape" class="w-full h-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4pEJuz8r933YswNx1VQqJ4PTyNSKbkBJwNGL5FgsYNGbNui9uU_r0BM1tkB09UcxsaH0u0C4X_0ecYzQukI4Lspr2UeotxGP3VR922NvbeC985v1OggEb8DsFEme1xxTQrVDBsXAmkS26TKzcxck-UWX6qxYZMRqy0ZJhJHMo8T0eSWzUreQtFJVlRATDQnMXv_6kS65ONH8D1hw1pyhOKjWQJQPqh7nVh0bey8cU4t4HobBWlMcZO1y-C4WJUk6SpNQGSzbs71Nd"/>
<div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 pointer-events-none z-20"></div>
</div>
<div class="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
<span class="bg-white border-2 border-black px-2 py-0.5 font-display text-lg text-black shadow-[2px_2px_0px_#000]">NICE!</span>
</div>
</div>
<div class="group relative aspect-square bg-white p-2 border-4 border-black shadow-comic transform hover:rotate-1 transition-transform duration-300">
<div class="w-full h-full relative overflow-hidden border-2 border-black">
<div class="absolute -top-2 -left-2 z-40 bg-comic-cyan text-black p-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-full">
<span class="material-symbols-outlined text-lg font-bold block">check</span>
</div>
<div class="absolute bottom-0 right-0 z-30 bg-comic-yellow border-t-2 border-l-2 border-black px-2 py-1">
<span class="text-xs font-bold font-mono text-black">1080 x 1080</span>
</div>
<img alt="Sunrise over a grassy hill" class="w-full h-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrsVDjGM9uZ87pnGjXjdfzVw6VCpWAbrjeM-vR5PViIOYdcv4WbM-FkLfCuuh7heyLFUvRVaY3LLiD533E5apDN3xP9QKMQJOIRwRtemzE6Xq7mME2y_8ys1lxqefsgg_eNvFZ84wvKHJrUjg_QQx5W_VFteKB7tXDGlyh4BwmCowMDYv48vof0P7DcGTbSvJssdv-f2SXzdPmrKImzfVehyHUvxLR4JgvGVCIrKbDJl1DseGh_SlPNCmLBjktjvBIhRxz43grR3ES"/>
</div>
</div>
<div class="group relative aspect-square bg-white p-2 border-4 border-black shadow-comic transform hover:-rotate-1 transition-transform duration-300">
<div class="w-full h-full relative overflow-hidden border-2 border-black">
<div class="absolute -top-2 -left-2 z-40 bg-white group-hover:bg-comic-cyan text-transparent group-hover:text-black p-1 border-2 border-black rounded-full transition-colors">
<span class="material-symbols-outlined text-lg font-bold block">check</span>
</div>
<div class="absolute bottom-0 right-0 z-30 bg-white border-t-2 border-l-2 border-black px-2 py-1">
<span class="text-xs font-bold font-mono text-black">800 x 600</span>
</div>
<img alt="River flowing through canyon" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeeWyvG9zKymt2C5O1y1oie0J7dUh2038u2IRCfoABf4ZxbQx3370vsq9xBXGKXMJcGl7D87QBgfrTQUJ4w2igTPedNR4ITGr1q2eoYekVOextZ0ptFEKUMvaYNFrgP8d83n7cVKmat0NzN87TL9uVDFOHb34JYnimrFgMjpK6tShtLFg1dvq20Q_3hLseGw1069rNomEkyABzJb1khZ5dtYTcDveExnJmx36Qux0jQ0vDhpT0_GKbzhkwrd92MI1bmBEd6VElYy5W"/>
</div>
</div>
<div class="group relative aspect-square bg-white p-2 border-4 border-black shadow-comic transform hover:rotate-1 transition-transform duration-300">
<div class="w-full h-full relative overflow-hidden border-2 border-black">
<div class="absolute -top-2 -left-2 z-40 bg-comic-cyan text-black p-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-full">
<span class="material-symbols-outlined text-lg font-bold block">check</span>
</div>
<div class="absolute bottom-0 right-0 z-30 bg-comic-yellow border-t-2 border-l-2 border-black px-2 py-1">
<span class="text-xs font-bold font-mono text-black">4000 x 3000</span>
</div>
<img alt="Foggy forest" class="w-full h-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvi5JJiCWHtI6EcUSIkJ23-6U_5cvzYip_z945BHkVAXisP4Of7AH-oIJkCMY1IfdGspyfIGchZfgVtI-RHki629aZUlwhtsMaQHVlNXHhSuHRepJK6uOUGfphTKTnZW_Rl2TPeip9GxBqnRwWf0LoXAf6UgQL4nnG5o-ywngta0DOs7lFJEtYsIRJccfNRW06h5SXfAR-zGZKKHxN67h5XfibDPvGG69SONhAnzVTjZJMrCGucD1uooZmk9buhbA3NWfxKkPHDMPI"/>
<div class="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
<span class="bg-white border-2 border-black px-2 py-0.5 font-display text-lg text-black shadow-[2px_2px_0px_#000]">EPIC!</span>
</div>
</div>
</div>
<div class="group relative aspect-square bg-white p-2 border-4 border-black shadow-comic transform hover:-rotate-1 transition-transform duration-300">
<div class="w-full h-full relative overflow-hidden border-2 border-black">
<div class="absolute -top-2 -left-2 z-40 bg-white group-hover:bg-comic-cyan text-transparent group-hover:text-black p-1 border-2 border-black rounded-full transition-colors">
<span class="material-symbols-outlined text-lg font-bold block">check</span>
</div>
<div class="absolute bottom-0 right-0 z-30 bg-white border-t-2 border-l-2 border-black px-2 py-1">
<span class="text-xs font-bold font-mono text-black">1280 x 720</span>
</div>
<img alt="Mountain view" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz1dC1w7BxRliEBzQ_xUK5xsER8Iokfxr1wz-JFMSurSCu9Q7FpksYRJZ2e0E-QA7V3UJfbc-N0mUko213xpqw7uN6C6VoQKlvKYK-jP6Y-7UHr536XuibBVnI4pYavaaVlzWS0XBp8ufANL6QOwf-bwiAy-dtXBXHVmwmqwq0joGXYvQ7rYS0HrTYPzGol7MFLEnerBlhBaCjrQWMyPgrrtmYV9f7E41-cYwLB2Ag3rbuiIF4zMuVzeSZocwqdCzdXujsjljzqJOT"/>
</div>
</div>
<div class="group relative aspect-square bg-white p-2 border-4 border-black shadow-comic transform hover:rotate-1 transition-transform duration-300">
<div class="w-full h-full relative overflow-hidden border-2 border-black">
<div class="absolute -top-2 -left-2 z-40 bg-white group-hover:bg-comic-cyan text-transparent group-hover:text-black p-1 border-2 border-black rounded-full transition-colors">
<span class="material-symbols-outlined text-lg font-bold block">check</span>
</div>
<div class="absolute bottom-0 right-0 z-30 bg-white border-t-2 border-l-2 border-black px-2 py-1">
<span class="text-xs font-bold font-mono text-black">1920 x 1080</span>
</div>
<img alt="Sunlight in forest" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC26bZ6hFWSqodASBY0SG-MxcfcKU5APLDNCyzfS7aiGU0xVwjZFC-8tkf1lp4rOVG6gpzyCSwAOu-DWFosI-R977pfkgdscYH3kQlrpAked8Bm7ziJHU7HeMPy7fN-UhNTLLUJsp8C9MspVsbssOC3YBz0B30mE-v75VMuslaxjps36A2TuZfEG7BcykqoFmfB7S6x6V4iyNVPOILs3Kw2ZKYOtxJWy4ZzpWgKwEVDhXqBeeeIPXAovAHELd8qes846uFCK_TWITnl"/>
</div>
</div>
<div class="group relative aspect-square bg-white p-2 border-4 border-black shadow-comic transform hover:-rotate-1 transition-transform duration-300">
<div class="w-full h-full relative overflow-hidden border-2 border-black">
<div class="absolute -top-2 -left-2 z-40 bg-comic-cyan text-black p-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-full">
<span class="material-symbols-outlined text-lg font-bold block">check</span>
</div>
<div class="absolute bottom-0 right-0 z-30 bg-comic-yellow border-t-2 border-l-2 border-black px-2 py-1">
<span class="text-xs font-bold font-mono text-black">800 x 800</span>
</div>
<img alt="Dense green forest" class="w-full h-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlGft2LjuIc1uLLk_ho0Q-J027Nrj1T0lBGiuqbZcqm_oghUM_xfFKriU5dQQGb9mvBCqfkjH8cguMXWUQijXAQR5pGQl03mhMYUIXq3c0yCqDmpZbw_cysHsS-4MbIuv3l8l0QF2Kino0sKi6ClDf1a_ETP39W70_JIhH99vW-w6AoMm5kKSqUcaxKUfaDU9vvfsUfFgn-9xePxkE0eY0CBe-wXKY6BS4BsLLV0ahiWinwO_HsJ9bF82xAGUdHFuOgPqwumGt99uz"/>
</div>
</div>
<div class="group relative aspect-square bg-white p-2 border-4 border-black shadow-comic transform hover:rotate-1 transition-transform duration-300">
<div class="w-full h-full relative overflow-hidden border-2 border-black">
<div class="absolute -top-2 -left-2 z-40 bg-white group-hover:bg-comic-cyan text-transparent group-hover:text-black p-1 border-2 border-black rounded-full transition-colors">
<span class="material-symbols-outlined text-lg font-bold block">check</span>
</div>
<div class="absolute bottom-0 right-0 z-30 bg-white border-t-2 border-l-2 border-black px-2 py-1">
<span class="text-xs font-bold font-mono text-black">1920 x 1280</span>
</div>
<img alt="Waterfall" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtP8HMXCc6WXrQl2YjlcojwIXfGlOUjxDH23DFfAXzg3M5YQXRHBTHcnDuHrTQXWKr8ag8A29LGXVZICvY5gcy1c1XGgn2zc8xy-BFnDmExaW4WV8Mz4S-Mq4r5WNy3zJLIsF3oVM-kK9mUAoPCPOIN0sZdVamWXxwFrHHjwadZuVj-nyx1HK4uOMVaVB3EpSJswdVP_dJUwL9-MiroXpjecGylXXvS0NIlrDuxf9Xf4vgJZmQSn6yIF2kUCW1CYKGeZj9msUii_Ii"/>
</div>
</div>
<div class="group relative aspect-square bg-white p-2 border-4 border-black shadow-comic transform hover:-rotate-1 transition-transform duration-300">
<div class="w-full h-full relative overflow-hidden border-2 border-black">
<div class="absolute -top-2 -left-2 z-40 bg-white group-hover:bg-comic-cyan text-transparent group-hover:text-black p-1 border-2 border-black rounded-full transition-colors">
<span class="material-symbols-outlined text-lg font-bold block">check</span>
</div>
<div class="absolute bottom-0 right-0 z-30 bg-white border-t-2 border-l-2 border-black px-2 py-1">
<span class="text-xs font-bold font-mono text-black">640 x 480</span>
</div>
<img alt="Snowy peaks" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc2Yzt6U7wZJ5Q8W02CDt0pXur81LeD9KDyl1lPlc1DYPA7dLEd5SHCJVQQmWHiyHs2abbKfER18lZm9Cgtwic5zISbj3i2si7699Ljr8IFXenWN_6bZjuX252l1TKPixg8s30Yozblk-699u2dtdLTSWqkQsiU4gFm_J46FvNcNljDazGl7rXMmcZb7b7EUFq1CAlYeBBi50seJ8XeV4XQIR5NCXB5h6gC9oeWFYFKlobig6oKLpJsTrPoExaSWWXYYSa_XAV4NkM"/>
</div>
</div>
<div class="group relative aspect-square bg-white p-2 border-4 border-black shadow-comic transform hover:rotate-1 transition-transform duration-300">
<div class="w-full h-full relative overflow-hidden border-2 border-black">
<div class="absolute -top-2 -left-2 z-40 bg-comic-cyan text-black p-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-full">
<span class="material-symbols-outlined text-lg font-bold block">check</span>
</div>
<div class="absolute bottom-0 right-0 z-30 bg-comic-yellow border-t-2 border-l-2 border-black px-2 py-1">
<span class="text-xs font-bold font-mono text-black">1600 x 900</span>
</div>
<img alt="Colorful sunset" class="w-full h-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4QUWFSkdXe5AMhLaEofrUiOsb0nMLQIboaZpX4Tix8F_hELAOFhELUO1_R1d8_Z6aOlvRxVMxDrqrMRIr0ZeM1IIxM4WaD2NXcIdm2PqAtxViZxRMn-dN3JKjWeeS0MdYgVp2EaXMhE_55MZk17HWOsfHCsy81QrJUuGYl7NbPlGHHdVdgp3dUOf4cZJexUzcKKmrkvhkSipZOJR-Mn0b9FGb6mRXBC8_iHjiB8we3alwEHDOaX84ICnoFIY-51fER9rJGuymxW24"/>
<div class="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
<span class="bg-white border-2 border-black px-2 py-0.5 font-display text-lg text-black shadow-[2px_2px_0px_#000]">ZOOM!</span>
</div>
</div>
</div>
</section>
</main>
<footer class="w-full border-t-4 border-black py-8 bg-white relative">
<div class="absolute top-0 left-0 w-full h-2 bg-comic-dots"></div>
<div class="px-10 max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
<div class="flex flex-col gap-1">
<h4 class="font-display text-xl uppercase">Image Extractor</h4>
<p class="text-sm font-comic text-gray-600 font-bold">© 2024. All Rights Reserved, Punk!</p>
</div>
<div class="flex gap-4">
<a class="px-4 py-1 border-2 border-black bg-white text-sm font-bold uppercase tracking-wider text-black hover:bg-comic-yellow transition-all shadow-sm rounded-lg" href="#">Privacy</a>
<a class="px-4 py-1 border-2 border-black bg-white text-sm font-bold uppercase tracking-wider text-black hover:bg-comic-cyan transition-all shadow-sm rounded-lg" href="#">Terms</a>
</div>
</div>
</footer>
</body></html>