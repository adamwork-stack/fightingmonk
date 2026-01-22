import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fighting Monk – Fighting Monk',
  description: 'Fighting Monk is a full-service commercial, film, and video content production company based in Austin and New York.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
