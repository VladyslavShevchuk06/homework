import 'server-only'
import { queryOptions } from '@tanstack/react-query'
import { type Locale } from 'next-intl'
import { getFavoritesList } from './favorites.service'
import { favoritesListQueryKey } from './favorites.query'

// favorites list server query options
export function favoritesListServerQueryOptions(userId: string, locale: Locale = 'en') {
  return queryOptions({
    queryKey: favoritesListQueryKey(locale),
    queryFn: () => getFavoritesList(userId, locale),
  })
}
