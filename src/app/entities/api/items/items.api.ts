import { IItem, IItemsListParams, IItemsListResponse } from '@/app/entities/models'

// GET /api/items?page=&search=&team=
export async function itemsListApi({
  page = 1,
  search = '',
  team = '',
}: IItemsListParams = {}): Promise<IItemsListResponse> {
  const params = new URLSearchParams({ page: String(page) })
  if (search) params.set('search', search)
  if (team && team !== 'all') params.set('team', team)

  const response = await fetch(`/api/items?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch items')
  }

  return response.json()
}

// GET /api/items/:slug
export async function itemDetailApi(slug: string): Promise<IItem> {
  const response = await fetch(`/api/items/${slug}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch item')
  }

  return response.json()
}
