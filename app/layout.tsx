import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '财务管理系统',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body className="min-h-screen bg-gray-50">
        <main className="max-w-5xl mx-auto py-8 px-4">{children}</main>
      </body>
    </html>
  )
}
