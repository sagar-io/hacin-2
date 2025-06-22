import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hackin - Headout',
  description: 'Created with Headout',
  generator: 'Hackin',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
