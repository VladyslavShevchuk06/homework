import { type Locale } from 'next-intl'
import { EFavoriteApi, IFavoriteWithItem } from '@/app/entities/models/favorite.model'

// favorites list fetch
export async function favoritesListApi(locale: Locale = 'en'): Promise<IFavoriteWithItem[]> {
  const params = new URLSearchParams({ locale })

  const response = await fetch(`${EFavoriteApi.LIST}?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch favorites')
  }

  return response.json()
}
