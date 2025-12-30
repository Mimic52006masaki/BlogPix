import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BlogPix',
  description: 'Extract images from blog URLs and download as ZIP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" crossOrigin="" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&amp;family=Roboto+Mono:wght@400;700&amp;display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-white text-black min-h-screen flex flex-col overflow-x-hidden selection:bg-punk-accent selection:text-white">
        <div className="grunge-overlay"></div>
        {children}
      </body>
    </html>
  )
}