'use client'

import { FavoriteCount } from '@/app/shared/components/ui'
import { useFavoriteToggle } from './favorite-toggle.context'
import { IFavoriteCountLiveProps } from './favorite-toggle.interface'

// component
export function FavoriteCountLive(props: Readonly<IFavoriteCountLiveProps>) {
  const { className } = props
  const { count } = useFavoriteToggle()

  return <FavoriteCount count={count} className={className} />
}
