import { queryOptions } from '@tanstack/react-query'
import { favoritesListApi } from './favorites.api'
import { EEntityKey } from '@/app/shared/interfaces'

// GET /api/favorites - user's favorites
export function favoritesListQueryOptions() {
  return queryOptions({
    queryKey: [EEntityKey.FAVORITES_LIST],
    queryFn: () => favoritesListApi(),
  })
}
