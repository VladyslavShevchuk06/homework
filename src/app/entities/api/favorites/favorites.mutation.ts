'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addFavoriteApi, removeFavoriteApi } from './favorites.api'
import { IFavoriteWithItem, IToggleFavoriteBody } from '@/app/entities/models'
import { EEntityKey } from '@/app/shared/interfaces'

// Add/remove favorites with OPTIMISTIC updates. onMutate flips the cached
// favorites list immediately so the toggle button reflects the new state without
// the "loading → stale value → final value" flicker. onError rolls the snapshot
// back; onSettled invalidates so the server response replaces the optimistic stub.
export function useFavoriteToggleMutation() {
  const queryClient = useQueryClient()
  const favoritesKey = [EEntityKey.FAVORITES_LIST]

  // snapshot + cancel in-flight refetches so they can't clobber the optimistic write
  const beginOptimistic = async () => {
    await queryClient.cancelQueries({ queryKey: favoritesKey })
    return { previous: queryClient.getQueryData<IFavoriteWithItem[]>(favoritesKey) }
  }

  const rollback = (context?: { previous?: IFavoriteWithItem[] }) => {
    if (context?.previous) queryClient.setQueryData(favoritesKey, context.previous)
  }

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: favoritesKey })
    queryClient.invalidateQueries({ queryKey: [EEntityKey.ITEMS_LIST] })
  }

  const addMutation = useMutation({
    mutationFn: (body: IToggleFavoriteBody) => addFavoriteApi(body),
    onMutate: async ({ itemId }) => {
      const context = await beginOptimistic()
      queryClient.setQueryData<IFavoriteWithItem[]>(favoritesKey, (old = []) =>
        old.some((fav) => fav.itemId === itemId)
          ? old
          : [
              ...old,
              // optimistic stub — only itemId is read by the toggle; the real row
              // (with slug/title/image) arrives on the onSettled refetch
              {
                id: `optimistic-${itemId}`,
                itemId,
                slug: '',
                title: '',
                description: null,
                imageUrl: null,
                createdAt: new Date(),
              },
            ],
      )
      return context
    },
    onError: (_err, _body, context) => rollback(context),
    onSettled: invalidateLists,
  })

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeFavoriteApi(itemId),
    onMutate: async (itemId) => {
      const context = await beginOptimistic()
      queryClient.setQueryData<IFavoriteWithItem[]>(favoritesKey, (old = []) =>
        old.filter((fav) => fav.itemId !== itemId),
      )
      return context
    },
    onError: (_err, _itemId, context) => rollback(context),
    onSettled: invalidateLists,
  })

  return { addMutation, removeMutation }
}
