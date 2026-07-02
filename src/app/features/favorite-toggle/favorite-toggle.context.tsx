'use client'

import { createContext, useContext, useOptimistic, useSyncExternalStore, useTransition } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { favoritesListQueryOptions, favoritesListQueryKey, toggleFavorite } from '@/app/entities/api'
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

  const queryClient = useQueryClient()
  const { data: favorites = [] } = useQuery({ ...favoritesListQueryOptions(), enabled: !!user })
  const isFavorited = favorites.some((favorite) => favorite.itemId === itemId)

  const [optimistic, applyOptimistic] = useOptimistic(
    { favorited: isFavorited, count: initialCount },
    (state, nextFavorited: boolean) => ({
      favorited: nextFavorited,
      count: Math.max(0, state.count + (nextFavorited ? 1 : -1)),
    }),
  )
  const [isMutating, startTransition] = useTransition()

  const toggle = () => {
    startTransition(async () => {
      applyOptimistic(!optimistic.favorited)
      await toggleFavorite(itemId, slug)
      await queryClient.invalidateQueries({ queryKey: favoritesListQueryKey() })
    })
  }

  const value: IFavoriteToggleContextValue = {
    canRender: mounted && !sessionPending && !!user,
    favorited: optimistic.favorited,
    count: optimistic.count,
    isMutating,
    toggle,
  }

  // return
  return <FavoriteToggleContext.Provider value={value}>{children}</FavoriteToggleContext.Provider>
}
