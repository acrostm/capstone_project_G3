// Note: Layout Component
import { Inter } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/tailwind.css'
import { type Metadata } from 'next'
import ToastProvider from '@/components/ToastProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: '%s - AI',
    default: 'Exercise Repetition and Posture Tracking',
  },
  description:
    'Exercise Repetition and Posture Tracking System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx('h-full bg-gray-50 antialiased', inter.variable)}
    >
      <head>
        <script async src="https://umami.jiachzha.com/script.js"
          data-website-id="9fcb0576-503c-43dd-90f4-0c55f40cad46"></script>
      </head>
      <body className="flex h-full flex-col">
        <ToastProvider><div className="flex min-h-full flex-col">{children}</div></ToastProvider>

      </body>
    </html>
  )
}
