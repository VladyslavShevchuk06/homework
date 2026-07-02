'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { favoritesListQueryKey } from './favorites.query'
import { toggleFavorite } from './favorites.action'
import { EEntityKey } from '@/app/shared/interfaces'
import { IFavoriteWithItem } from '@/app/entities/models'

// interface
interface IToggleFavoriteVariables {
  itemId: string
  slug: string
  favorited: boolean
}

// optimistic favorite row
function optimisticFavorite(itemId: string, slug: string): IFavoriteWithItem {
  return {
    id: `optimistic-${itemId}`,
    itemId,
    slug,
    title: '',
    description: null,
    imageUrl: null,
    createdAt: new Date(),
    favoritesCount: 0,
  }
}

// favorites toggle hook
export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient()
  const queryKey = favoritesListQueryKey()

  return useMutation({
    mutationFn: ({ itemId, slug }: IToggleFavoriteVariables) => toggleFavorite(itemId, slug),
    onMutate: async ({ itemId, slug, favorited }) => {
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData<IFavoriteWithItem[]>(queryKey)

      queryClient.setQueryData<IFavoriteWithItem[]>(queryKey, (list = []) =>
        favorited ? list.filter((favorite) => favorite.itemId !== itemId) : [...list, optimisticFavorite(itemId, slug)],
      )

      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: [EEntityKey.ITEMS_LIST] })
    },
  })
}
