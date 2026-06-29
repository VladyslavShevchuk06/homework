import 'server-only'
import { queryOptions } from '@tanstack/react-query'
import { getItemsList, getItemDetail } from './items.service'
import { itemsListQueryKey, itemDetailQueryKey } from './items.query'
import { IItemsListParams } from '@/app/entities/models'

export function itemsListServerQueryOptions({ page = 1, search = '', team = '' }: IItemsListParams = {}) {
  return queryOptions({
    queryKey: itemsListQueryKey({ page, search, team }),
    queryFn: () => getItemsList({ page, search, team }),
  })
}

export function itemDetailServerQueryOptions(slug: string) {
  return queryOptions({
    queryKey: itemDetailQueryKey(slug),
    queryFn: () => getItemDetail(slug),
  })
}
