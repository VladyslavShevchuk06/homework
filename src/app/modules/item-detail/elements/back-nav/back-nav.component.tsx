'use client'

import { type FC } from 'react'
import Link from 'next/link'
import { type Locale, useTranslations } from 'next-intl'
import { routing } from '@/pkg/locale'
import { mixpanelClient } from '@/pkg/mixpanel'
import { useFavoriteToggle } from '@/app/features/favorite-toggle'
import { BackToFavorites } from '../back-to-favorites'

// component
export const BackNav: FC<Readonly<{ locale: Locale }>> = (props) => {
  const { locale } = props
  const t = useTranslations('ItemDetail')
  const { canRender, favorited } = useFavoriteToggle()

  const backHref = locale === routing.defaultLocale ? '/items' : `/${locale}/items`

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link
        href={backHref}
        onClick={() => mixpanelClient.track('Back link clicked', { Destination: 'items' })}
        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {t('back')}
      </Link>

      {canRender && favorited && <BackToFavorites />}
    </div>
  )
}
