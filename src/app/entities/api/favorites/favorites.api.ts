import { IFavoriteWithItem } from '@/app/entities/models'

// favorites list fetch
export async function favoritesListApi(): Promise<IFavoriteWithItem[]> {
  const response = await fetch('/api/favorites', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch favorites')
  }

  return response.json()
}
