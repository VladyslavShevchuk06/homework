'use client'

import { type FC, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/pkg/locale'
import { Button } from './button'

const LABELS: Record<string, string> = {
  en: 'EN',
  uk: 'UK',
}

export const LocaleSwitcher: FC = () => {
  const t = useTranslations('LocaleSwitcher')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const nextLocale = locale === 'en' ? 'uk' : 'en'

  const onSwitch = () => {
    const query = Object.fromEntries(new URLSearchParams(window.location.search))
    startTransition(() => {
      router.replace({ pathname, query }, { locale: nextLocale })
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      aria-label={t('switchTo', { label: LABELS[nextLocale] })}
      title={t('switchTo', { label: LABELS[nextLocale] })}
      onClick={onSwitch}
    >
      {LABELS[locale]}
    </Button>
  )
}
