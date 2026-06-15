import { queryOptions } from '@tanstack/react-query'
import { itemsListApi, itemDetailApi } from './items.api'

// entity keys for cache management
export enum EItemsKey {
  ITEMS_LIST = 'items-list',
  ITEM_DETAIL = 'item-detail',
}

// GET /api/items - list all items
export function itemsListQueryOptions() {
  return queryOptions({
    queryKey: [EItemsKey.ITEMS_LIST],
    queryFn: () => itemsListApi(),
  })
}

// GET /api/items/:id - single item detail
export function itemDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: [EItemsKey.ITEM_DETAIL, id],
    queryFn: () => itemDetailApi(id),
    enabled: !!id,
  })
}
