import 'server-only'
import { queryOptions } from '@tanstack/react-query'
import { getItemsList } from './items.service'
import { itemsListQueryKey } from './items.query'
import { IItemsListParams } from '@/app/entities/models'

// items list server query options
export function itemsListServerQueryOptions({ page = 1, search = '', team = '' }: IItemsListParams = {}) {
  return queryOptions({
    queryKey: itemsListQueryKey({ page, search, team }),
    queryFn: () => getItemsList({ page, search, team }),
  })
}
