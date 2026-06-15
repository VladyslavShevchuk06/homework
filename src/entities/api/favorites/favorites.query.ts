import { queryOptions } from '@tanstack/react-query'
import { favoritesListApi } from './favorites.api'

// entity keys for cache management
export enum EFavoritesKey {
  FAVORITES_LIST = 'favorites-list',
}

// GET /api/favorites - user's favorites
export function favoritesListQueryOptions() {
  return queryOptions({
    queryKey: [EFavoritesKey.FAVORITES_LIST],
    queryFn: () => favoritesListApi(),
  })
}
