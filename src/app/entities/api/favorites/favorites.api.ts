import { type Locale } from 'next-intl'
import { IFavoriteWithItem } from '@/app/entities/models'

// favorites list fetch
export async function favoritesListApi(locale: Locale = 'en'): Promise<IFavoriteWithItem[]> {
  const params = new URLSearchParams({ locale })

  const response = await fetch(`/api/favorites?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch favorites')
  }

  return response.json()
}
