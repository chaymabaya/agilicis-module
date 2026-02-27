import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Image from "next/image";

import './globals.css'

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AGILICIS - AI Disease Detection',
  description: 'AI/ML Module for Image-Based Disease Detection. An AI vision engine that analyzes smartphone photos to predict diseases with confidence scores and diagnostic reports.',
  generator: 'AGILICIS',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      
      {
        url: '/agilicissas_logo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/agilicissas_logo.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
