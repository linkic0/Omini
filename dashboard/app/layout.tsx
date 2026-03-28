import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Omini Dashboard',
  description: 'GTM 数据决策面板',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="bg-gray-950 text-white min-h-screen">{children}</body>
    </html>
  )
}
