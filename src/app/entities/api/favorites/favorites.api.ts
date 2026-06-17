import { IFavoriteWithItem, IToggleFavoriteBody } from '@/app/entities/models'

// GET /api/favorites - get user's favorites
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

// POST /api/favorites - add to favorites
export async function addFavoriteApi(body: IToggleFavoriteBody) {
  const response = await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to add favorite')
  }

  return response.json()
}

// DELETE /api/favorites/:itemId - remove from favorites
export async function removeFavoriteApi(itemId: string) {
  const response = await fetch(`/api/favorites/${itemId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Failed to remove favorite')
  }

  return response.json()
}
