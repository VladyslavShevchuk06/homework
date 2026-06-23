'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addFavoriteApi, removeFavoriteApi } from './favorites.api'
import { IFavoriteWithItem, IItem, IItemsListResponse, IToggleFavoriteBody } from '@/app/entities/models'
import { EEntityKey } from '@/app/shared/interfaces'

type Snapshot = Array<[readonly unknown[], unknown]>

export function useFavoriteToggleMutation() {
  const queryClient = useQueryClient()

  const favoritesKey = [EEntityKey.FAVORITES_LIST]
  const itemsKey = [EEntityKey.ITEMS_LIST]
  const detailKey = [EEntityKey.ITEM_DETAIL]

  const readCount = (itemId: string): number => {
    for (const [, detail] of queryClient.getQueriesData<IItem>({ queryKey: detailKey })) {
      if (detail?.id === itemId) return detail.favoritesCount
    }
    for (const [, list] of queryClient.getQueriesData<IItemsListResponse>({ queryKey: itemsKey })) {
      const hit = list?.data.find((item) => item.id === itemId)
      if (hit) return hit.favoritesCount
    }
    return 0
  }

  const applyCountDelta = (itemId: string, delta: number) => {
    queryClient.setQueriesData<IItemsListResponse>({ queryKey: itemsKey }, (old) =>
      old
        ? {
            ...old,
            data: old.data.map((item) =>
              item.id === itemId ? { ...item, favoritesCount: Math.max(0, item.favoritesCount + delta) } : item,
            ),
          }
        : old,
    )

    queryClient.setQueriesData<IItem>({ queryKey: detailKey }, (old) =>
      old && old.id === itemId ? { ...old, favoritesCount: Math.max(0, old.favoritesCount + delta) } : old,
    )
  }

  const snapshot = (): Snapshot => [
    ...queryClient.getQueriesData({ queryKey: favoritesKey }),
    ...queryClient.getQueriesData({ queryKey: itemsKey }),
    ...queryClient.getQueriesData({ queryKey: detailKey }),
  ]

  const restore = (previous: Snapshot) => {
    previous.forEach(([key, data]) => queryClient.setQueryData(key, data))
  }

  const beginOptimistic = async () => {
    await Promise.all([
      queryClient.cancelQueries({ queryKey: favoritesKey }),
      queryClient.cancelQueries({ queryKey: itemsKey }),
      queryClient.cancelQueries({ queryKey: detailKey }),
    ])
    return { previous: snapshot() }
  }

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: favoritesKey })
    queryClient.invalidateQueries({ queryKey: itemsKey })
    queryClient.invalidateQueries({ queryKey: detailKey })
  }

  const addMutation = useMutation({
    mutationFn: (body: IToggleFavoriteBody) => addFavoriteApi(body),
    onMutate: async ({ itemId }) => {
      const context = await beginOptimistic()
      const current = queryClient.getQueryData<IFavoriteWithItem[]>(favoritesKey) ?? []

      if (current.some((fav) => fav.itemId === itemId)) return context

      queryClient.setQueryData<IFavoriteWithItem[]>(favoritesKey, [
        ...current,
        {
          id: `optimistic-${itemId}`,
          itemId,
          slug: '',
          title: '',
          description: null,
          imageUrl: null,
          createdAt: new Date(),
          favoritesCount: readCount(itemId) + 1,
        },
      ])
      applyCountDelta(itemId, 1)

      return context
    },
    onError: (_err, _body, context) => context && restore(context.previous),
    onSettled: invalidateLists,
  })

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeFavoriteApi(itemId),
    onMutate: async (itemId) => {
      const context = await beginOptimistic()
      const current = queryClient.getQueryData<IFavoriteWithItem[]>(favoritesKey) ?? []

      if (!current.some((fav) => fav.itemId === itemId)) return context

      queryClient.setQueryData<IFavoriteWithItem[]>(
        favoritesKey,
        current.filter((fav) => fav.itemId !== itemId),
      )
      applyCountDelta(itemId, -1)

      return context
    },
    onError: (_err, _itemId, context) => context && restore(context.previous),
    onSettled: invalidateLists,
  })

  return { addMutation, removeMutation }
}
