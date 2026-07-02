'use client'

import { createContext, useContext, useState, useSyncExternalStore } from 'react'
import { useQuery } from '@tanstack/react-query'
import { favoritesListQueryOptions, useToggleFavoriteMutation } from '@/app/entities/api'
import { IFavoriteToggleContextValue, IFavoriteToggleProviderProps } from './favorite-toggle.interface'
import { authClient } from '@/pkg/auth'

const emptySubscribe = () => () => {}

// context
const FavoriteToggleContext = createContext<IFavoriteToggleContextValue | null>(null)

// context hook
export function useFavoriteToggle() {
  const context = useContext(FavoriteToggleContext)

  if (!context) {
    throw new Error('useFavoriteToggle must be used within FavoriteToggleProvider')
  }

  return context
}

// provider
export function FavoriteToggleProvider(props: Readonly<IFavoriteToggleProviderProps>) {
  const { itemId, slug, initialCount, children } = props

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  const { data: session, isPending: sessionPending } = authClient.useSession()
  const user = session?.user

  const { data: favorites = [] } = useQuery({ ...favoritesListQueryOptions(), enabled: !!user })
  const favorited = favorites.some((favorite) => favorite.itemId === itemId)

  const mutation = useToggleFavoriteMutation()

  // freeze the base so the server-action refresh of initialCount can't double-count
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

  // return
  return <FavoriteToggleContext.Provider value={value}>{children}</FavoriteToggleContext.Provider>
}
