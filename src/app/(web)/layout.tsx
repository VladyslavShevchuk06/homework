import type { Metadata } from 'next'
import { type FC, type ReactNode } from 'react'
import { fontPrimary } from '@/config/fonts'
import { QueryProvider } from '@/pkg/query'
import { cn, ThemeProvider } from '@/pkg/theme'
import { Nav } from '@/app/shared/components/nav'
import '@/config/styles/global.css'

// metadata
export const metadata: Metadata = {
  title: 'F1 Drives',
  description: 'Browse and save your favorite F1 drivers from the 2026 season',
}

// interface
interface IProps {
  children: ReactNode
}

// layout
const RootLayout: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  // return
  return (
    <html lang="en" className={fontPrimary.variable} suppressHydrationWarning>
      <body
        className={cn(
          'bg-white text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-100',
          fontPrimary.className,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <Nav />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
