import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { getItemsList } from '@/app/entities/api/items/index.server'
import { type IItemsListResponse } from '@/app/entities/models/item.model'
import { GET } from '../route'

// connection() has no store outside a next render
vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>()

  return { ...actual, connection: vi.fn().mockResolvedValue(undefined) }
})

// replacing the module keeps 'server-only' and drizzle out of the test
vi.mock('@/app/entities/api/items/index.server', () => ({ getItemsList: vi.fn() }))

const emptyResult: IItemsListResponse = {
  data: [],
  meta: { totalCount: 0, totalPages: 1, currentPage: 1 },
}

// request factory
function request(query: string) {
  return new NextRequest(`http://localhost:3000/api/items${query}`)
}

describe('GET /api/items', () => {
  beforeEach(() => {
    vi.mocked(getItemsList).mockReset().mockResolvedValue(emptyResult)
  })

  it('falls back to page 1 for a non-numeric page', async () => {
    await GET(request('?page=abc'))

    expect(getItemsList).toHaveBeenCalledWith({ page: 1, search: '', team: '', locale: 'en' })
  })

  it('falls back to page 1 for a negative page', async () => {
    await GET(request('?page=-3'))

    expect(getItemsList).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }))
  })

  it('falls back to the default locale for an unsupported one', async () => {
    await GET(request('?locale=fr'))

    expect(getItemsList).toHaveBeenCalledWith(expect.objectContaining({ locale: 'en' }))
  })

  it('drops a search term longer than 100 characters', async () => {
    await GET(request(`?search=${'a'.repeat(101)}`))

    expect(getItemsList).toHaveBeenCalledWith(expect.objectContaining({ search: '' }))
  })

  it('passes valid params through untouched', async () => {
    await GET(request('?page=2&search=ham&team=ferrari&locale=uk'))

    expect(getItemsList).toHaveBeenCalledWith({ page: 2, search: 'ham', team: 'ferrari', locale: 'uk' })
  })

  it('returns the service payload with 200', async () => {
    const response = await GET(request('?page=1'))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(emptyResult)
  })

  it('returns 500 when the service throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(getItemsList).mockRejectedValue(new Error('db down'))

    const response = await GET(request(''))

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({ error: 'Failed to fetch items' })
  })
})
