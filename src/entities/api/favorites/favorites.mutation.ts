'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addFavoriteApi, removeFavoriteApi } from './favorites.api'
import { EFavoritesKey } from './favorites.query'
import { IToggleFavoriteBody, IFavoriteWithItem } from '@/entities/models'

// mutation for adding to favorites
export function useFavoriteToggleMutation() {
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: (body: IToggleFavoriteBody) => addFavoriteApi(body),
    onMutate: async (newFavorite) => {
      // cancel any ongoing queries
      await queryClient.cancelQueries({ queryKey: [EFavoritesKey.FAVORITES_LIST] })

      // snapshot previous data
      const previousFavorites = queryClient.getQueryData<IFavoriteWithItem[]>([EFavoritesKey.FAVORITES_LIST])

      // optimistically update cache (placeholder until actual data comes back)
      queryClient.setQueryData([EFavoritesKey.FAVORITES_LIST], (old: IFavoriteWithItem[] | undefined) => old || [])

      return { previousFavorites }
    },
    onError: (_err, _newFavorite, context) => {
      // rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData([EFavoritesKey.FAVORITES_LIST], context.previousFavorites)
      }
    },
    onSuccess: () => {
      // refetch to get server-side data
      queryClient.invalidateQueries({ queryKey: [EFavoritesKey.FAVORITES_LIST] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeFavoriteApi(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: [EFavoritesKey.FAVORITES_LIST] })

      const previousFavorites = queryClient.getQueryData<IFavoriteWithItem[]>([EFavoritesKey.FAVORITES_LIST])

      // optimistically remove from cache
      queryClient.setQueryData(
        [EFavoritesKey.FAVORITES_LIST],
        (old: IFavoriteWithItem[] | undefined) => old?.filter((fav) => fav.itemId !== itemId) || [],
      )

      return { previousFavorites }
    },
    onError: (_err, _itemId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData([EFavoritesKey.FAVORITES_LIST], context.previousFavorites)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EFavoritesKey.FAVORITES_LIST] })
    },
  })

  return { addMutation, removeMutation }
}
