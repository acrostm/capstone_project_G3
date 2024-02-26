// Note: Layout Component
import { Inter } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/tailwind.css'
import { type Metadata } from 'next'

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
    <body className="flex h-full flex-col">
    <div className="flex min-h-full flex-col">{children}</div>
    </body>
    </html>
  )
}
