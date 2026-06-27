import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Valfin — Operations',
  description: 'Valfin Tech outbound operations dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
