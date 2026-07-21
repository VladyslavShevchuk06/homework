import type { Metadata } from 'next'
import { type ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { hasLocale, type Locale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { fontPrimary } from '@/config/fonts'
import { QueryProvider } from '@/pkg/query'
import { cn, ThemeProvider } from '@/pkg/theme'
import { routing } from '@/pkg/locale'
import { Nav } from '@/app/shared/components/nav'
import { Toaster } from '@/app/shared/components/ui'
import '@/config/styles/global.css'

// metadata
export async function generateMetadata(props: Readonly<{ params: Promise<{ locale: Locale }> }>): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

interface IProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

// layout
async function LocaleLayout(props: Readonly<IProps>) {
  const { children, params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          'bg-white text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-100',
          fontPrimary.variable,
          fontPrimary.className,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <NextIntlClientProvider>
              <Nav />
              {children}
              <Toaster />
            </NextIntlClientProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
