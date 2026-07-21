'use client'

import { type FC, createContext, useState, useSyncExternalStore } from 'react'
import { useLocale } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { favoritesListQueryOptions, useToggleFavoriteMutation } from '@/app/entities/api/favorites'
import { IFavoriteToggleContextValue, IFavoriteToggleProviderProps } from './favorite-toggle.interface'
import { authClient } from '@/pkg/auth'

const emptySubscribe = () => () => {}

export const FavoriteToggleContext = createContext<IFavoriteToggleContextValue | null>(null)

// provider
export const FavoriteToggleProvider: FC<Readonly<IFavoriteToggleProviderProps>> = (props) => {
  const { itemId, slug, initialCount, children } = props

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  const locale = useLocale()
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const user = session?.user

  const { data: favorites = [] } = useQuery({ ...favoritesListQueryOptions(locale), enabled: !!user })
  const favorited = favorites.some((favorite) => favorite.itemId === itemId)

  const mutation = useToggleFavoriteMutation()

  const [baseCount] = useState(() => initialCount)
  const [countDelta, setCountDelta] = useState(0)
  const count = Math.max(0, baseCount + countDelta)

  const toggle = () => {
    const step = favorited ? -1 : 1
    setCountDelta((delta) => delta + step)
    mutation.mutate({ itemId, slug, favorited }, { onError: () => setCountDelta((delta) => delta - step) })
  }

  const value: IFavoriteToggleContextValue = {
    canRender: mounted && !sessionPending && !!user,
    favorited,
    count,
    isMutating: mutation.isPending,
    toggle,
  }

  return <FavoriteToggleContext.Provider value={value}>{children}</FavoriteToggleContext.Provider>
}
