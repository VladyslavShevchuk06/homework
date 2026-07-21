'use client'

import { type FC } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/app/shared/components/ui'
import { useFavoriteToggle } from './favorite-toggle.hook'

// component
export const FavoriteToggle: FC = () => {
  const t = useTranslations('Favorites')
  const { canRender, favorited, isMutating, toggle } = useFavoriteToggle()

  if (!canRender) {
    return null
  }

  return (
    <Button onClick={toggle} variant={favorited ? 'default' : 'outline'} disabled={isMutating} className="w-full">
      {favorited ? t('remove') : t('add')}
    </Button>
  )
}
