import type { Metadata } from 'next'
import { type ReactNode } from 'react'
import { fontPrimary } from '@/config/fonts'
import { QueryProvider } from '@/pkg/query'
import { cn, ThemeProvider } from '@/pkg/theme'
import '@/config/styles/global.css'

export const metadata: Metadata = {
  title: 'F1 Drives',
  description: 'Browse and save your favorite F1 drivers from the 2026 season',
}

interface IProps {
  children: ReactNode
}

function RootLayout(props: Readonly<IProps>) {
  const { children } = props

  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'bg-white text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-100',
          fontPrimary.variable,
          fontPrimary.className,
        )}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
