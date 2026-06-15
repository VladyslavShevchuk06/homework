import { IItem } from '@/entities/models'

// GET /api/items
export async function itemsListApi(): Promise<IItem[]> {
  const response = await fetch('/api/items', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch items')
  }

  return response.json()
}

// GET /api/items/:id
export async function itemDetailApi(id: string): Promise<IItem> {
  const response = await fetch(`/api/items/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch item')
  }

  return response.json()
}
