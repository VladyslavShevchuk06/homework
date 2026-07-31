import { queryOptions } from '@tanstack/react-query'
import { type Locale } from 'next-intl'
import { favoritesListApi } from './favorites.api'
import { EFavoriteKey } from '@/app/entities/models/favorite.model'

// favorites list query key
export function favoritesListQueryKey(locale: Locale = 'en') {
  return [EFavoriteKey.LIST, locale] as const
}

// favorites list query options
export function favoritesListQueryOptions(locale: Locale = 'en') {
  return queryOptions({
    queryKey: favoritesListQueryKey(locale),
    queryFn: () => favoritesListApi(locale),
  })
}
