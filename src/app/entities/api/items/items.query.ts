import { queryOptions, keepPreviousData } from '@tanstack/react-query'
import { itemsListApi } from './items.api'
import { IItemsListParams } from '@/app/entities/models'
import { EEntityKey } from '@/app/shared/interfaces'

// items list query key
export function itemsListQueryKey({ page = 1, search = '', team = '', locale = 'en' }: IItemsListParams = {}) {
  return [EEntityKey.QUERY_ITEMS_LIST, page, search, team, locale] as const
}

// items list query options
export function itemsListQueryOptions({ page = 1, search = '', team = '', locale = 'en' }: IItemsListParams = {}) {
  return queryOptions({
    queryKey: itemsListQueryKey({ page, search, team, locale }),
    queryFn: () => itemsListApi({ page, search, team, locale }),
    placeholderData: keepPreviousData,
  })
}
