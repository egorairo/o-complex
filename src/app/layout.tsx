import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'

const inter = Inter({subsets: ['latin', 'cyrillic']})

export const metadata: Metadata = {
  title: 'Тестовое задание React Developer (Next.js)',
  description:
    'Тестовое задание для позиции React Developer с использованием Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
