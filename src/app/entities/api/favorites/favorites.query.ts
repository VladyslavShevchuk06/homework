import { queryOptions } from '@tanstack/react-query'
import { favoritesListApi } from './favorites.api'
import { EEntityKey } from '@/app/shared/interfaces'

// favorites list query key
export function favoritesListQueryKey() {
  return [EEntityKey.QUERY_FAVORITES_LIST] as const
}

// favorites list query options
export function favoritesListQueryOptions() {
  return queryOptions({
    queryKey: favoritesListQueryKey(),
    queryFn: () => favoritesListApi(),
  })
}
