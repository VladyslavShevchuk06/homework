'use client'

import { Button } from '@/app/shared/components/ui'
import { useFavoriteToggle } from './favorite-toggle.context'

// component
export function FavoriteToggle() {
  const { canRender, favorited, isMutating, toggle } = useFavoriteToggle()

  if (!canRender) {
    return null
  }

  return (
    <Button onClick={toggle} variant={favorited ? 'default' : 'outline'} disabled={isMutating} className="w-full">
      {favorited ? '★ Remove from Favorites' : '☆ Add to Favorites'}
    </Button>
  )
}
