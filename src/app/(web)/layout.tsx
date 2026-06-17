import type { Metadata } from 'next'
import { Suspense } from 'react'
import { fontPrimary } from '@/config/fonts'
import { QueryProvider } from '@/pkg/query'
import { cn } from '@/pkg/theme'
import { Nav } from '@/app/shared/components/nav'
import '@/config/styles/global.css'

export const metadata: Metadata = {
  title: 'F1 Drives',
  description: 'Browse and save your favorite F1 drivers from the 2026 season',
}

interface IRootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<IRootLayoutProps>) {
  return (
    <html lang="en" className={fontPrimary.variable}>
      <body className={cn('bg-white text-slate-950 antialiased', fontPrimary.className)}>
        <QueryProvider>
          {/* Nav reads the auth session (request-time, uncached) — keep it inside a
              Suspense boundary so Cache Components can prerender the rest of the page */}
          <Suspense fallback={<div className="border-b border-slate-200 bg-white" />}>
            <Nav />
          </Suspense>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
