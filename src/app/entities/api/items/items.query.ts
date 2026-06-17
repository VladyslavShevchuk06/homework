import { queryOptions, keepPreviousData } from '@tanstack/react-query'
import { itemsListApi, itemDetailApi } from './items.api'
import { IItemsListParams } from '@/app/entities/models'
import { EEntityKey } from '@/app/shared/interfaces'

// GET /api/items - paginated + searchable list
export function itemsListQueryOptions({ page = 1, search = '' }: IItemsListParams = {}) {
  return queryOptions({
    queryKey: [EEntityKey.ITEMS_LIST, page, search],
    queryFn: () => itemsListApi({ page, search }),
    // v5 standard: keep showing the previous page's data while the next one loads
    placeholderData: keepPreviousData,
  })
}

// GET /api/items/:slug - single item detail
export function itemDetailQueryOptions(slug: string) {
  return queryOptions({
    queryKey: [EEntityKey.ITEM_DETAIL, slug],
    queryFn: () => itemDetailApi(slug),
    enabled: !!slug,
  })
}
