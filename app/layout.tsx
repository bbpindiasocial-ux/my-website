import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'

import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Keerthi Nirmal - Cultivated With Care',
  description:
    'Premium quality rice cultivated with care. Keerthi Nirmal brings you the finest natural grains from the heart of Kerala.',
}

export const viewport: Viewport = {
  themeColor: '#e8e2d0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
