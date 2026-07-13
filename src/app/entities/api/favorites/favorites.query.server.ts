import 'server-only'
import { queryOptions } from '@tanstack/react-query'
import { getFavoritesList } from './favorites.service'
import { favoritesListQueryKey } from './favorites.query'

// favorites list server query options
export function favoritesListServerQueryOptions(userId: string) {
  return queryOptions({
    queryKey: favoritesListQueryKey(),
    queryFn: () => getFavoritesList(userId),
  })
}
