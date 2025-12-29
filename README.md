# BlogPix

Extract images from blog URLs and download as ZIP.

## Setup

1. Clone the repo
2. npm install
3. npm run dev
4. Open http://localhost:3000

## Features

- Input blog URL
- Fetch images
- Select images
- Download as ZIP with format conversion (PNG/JPG)

## API

### POST /api/fetch-images

Request: { "url": "https://example.com/blog" }

Response: { "images": [{ "id": "img-0", "url": "...", "width": 800, "height": 600, "format": "jpg" }, ...] }

### POST /api/download-zip

Request: { "images": [{ "id": "img-0", "url": "..." }], "format": "png" }

Response: ZIP file

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Axios
- Cheerio
- Sharp
- JSZip

## Deployment

Deploy to Vercel for serverless functions.