import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { type ReactNode } from 'react'
import { routing } from '@/pkg/locale'
import { HtmlLang } from '@/app/shared/components/ui'
import { Nav } from '@/app/shared/components/nav'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

interface IProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

async function LocaleLayout(props: Readonly<IProps>) {
  const { children, params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <NextIntlClientProvider>
      <HtmlLang locale={locale} />
      <Nav />
      {children}
    </NextIntlClientProvider>
  )
}

export default LocaleLayout
