## URL取得API
{ "images": [{ "id": "id1", "url": "...", "width": 200, "height": 200, "format": "jpg" }, ...] }

## ダウンロードAPI
{ "zipUrl": "https://..." }


---

## 05_TechStack.md
```markdown
# 05_TechStack.md

## フロントエンド
- Next.js + React
- TailwindCSS
- jszip (ZIP生成)
- next/image (最適化サムネイル表示)

## サーバーサイド
- Node.js (Vercel API Routes)
- axios (HTML取得)
- cheerio (HTML解析)
- sharp (画像変換)
- jszip (サーバー側ZIP化※必要に応じ)

## 仮定
- フルサーバー不要、VercelサーバーレスでMVP完結
