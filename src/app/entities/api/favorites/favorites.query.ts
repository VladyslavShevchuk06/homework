import { queryOptions } from '@tanstack/react-query'
import { type Locale } from 'next-intl'
import { favoritesListApi } from './favorites.api'
import { EEntityKey } from '@/app/shared/interfaces'

// favorites list query key
export function favoritesListQueryKey(locale: Locale = 'en') {
  return [EEntityKey.QUERY_FAVORITES_LIST, locale] as const
}

// favorites list query options
export function favoritesListQueryOptions(locale: Locale = 'en') {
  return queryOptions({
    queryKey: favoritesListQueryKey(locale),
    queryFn: () => favoritesListApi(locale),
  })
}
