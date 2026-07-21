'use client'

import { type FC } from 'react'
import { CountBadge } from '@/app/shared/components/ui'
import { useFavoriteToggle } from './favorite-toggle.hook'
import { IFavoriteCountLiveProps } from './favorite-toggle.interface'

// component
export const FavoriteCountLive: FC<Readonly<IFavoriteCountLiveProps>> = (props) => {
  const { className } = props
  const { count } = useFavoriteToggle()

  return (
    <CountBadge
      count={count}
      label={`Favorited ${count} time${count === 1 ? '' : 's'}`}
      icon={
        <svg className="h-3.5 w-3.5 text-rose-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 17.5 8.55 16.2C4.4 12.45 1.67 9.98 1.67 6.96 1.67 4.49 3.61 2.5 6.08 2.5c1.4 0 2.74.65 3.92 1.74C11.18 3.15 12.52 2.5 13.92 2.5c2.47 0 4.41 1.99 4.41 4.46 0 3.02-2.73 5.49-6.88 9.25L10 17.5Z" />
        </svg>
      }
      className={className}
    />
  )
}
