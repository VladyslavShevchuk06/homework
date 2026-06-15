import type { Metadata } from 'next'
import { fontPrimary } from '@/config/fonts'
import { QueryProvider } from '@/pkg/query'
import { cn } from '@/pkg/theme'
import { Nav } from '@/shared/components/nav'
import '@/config/styles/global.css'

export const metadata: Metadata = {
  title: 'F1 Catalog',
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
          <Nav />
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
