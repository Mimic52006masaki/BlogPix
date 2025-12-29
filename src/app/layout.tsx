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
      <body className="min-h-screen flex flex-col overflow-x-hidden selection:bg-comic-yellow selection:text-black">
        {children}
      </body>
    </html>
  )
}