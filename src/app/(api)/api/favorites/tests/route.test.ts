import { beforeEach, describe, expect, it, vi } from 'vitest'
import { auth } from '@/lib/auth'
import { getFavoritesList } from '@/app/entities/api/favorites/index.server'
import { GET } from '../route'

// connection() has no store outside a next render
vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>()

  return { ...actual, connection: vi.fn().mockResolvedValue(undefined) }
})

// replacing the module keeps 'server-only' and drizzle out of the test
vi.mock('@/app/entities/api/favorites/index.server', () => ({ getFavoritesList: vi.fn() }))

vi.mock('@/lib/auth', () => ({ auth: { api: { getSession: vi.fn() } } }))

const getSession = vi.mocked(auth.api.getSession)

// signs the request in as a fixed user
function signedIn() {
  getSession.mockResolvedValue({ user: { id: 'user-1' } } as never)
}

// request factory
function request(query: string) {
  return new Request(`http://localhost:3000/api/favorites${query}`)
}

describe('GET /api/favorites', () => {
  beforeEach(() => {
    getSession.mockReset().mockResolvedValue(null as never)
    vi.mocked(getFavoritesList).mockReset().mockResolvedValue([])
  })

  it('returns 401 without a session', async () => {
    const response = await GET(request(''))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' })
    expect(getFavoritesList).not.toHaveBeenCalled()
  })

  it('reads the list for the session user in the default locale', async () => {
    signedIn()

    const response = await GET(request(''))

    expect(response.status).toBe(200)
    expect(getFavoritesList).toHaveBeenCalledWith('user-1', 'en')
  })

  it('honours a supported locale', async () => {
    signedIn()

    await GET(request('?locale=uk'))

    expect(getFavoritesList).toHaveBeenCalledWith('user-1', 'uk')
  })

  it('falls back to the default locale for an unsupported one', async () => {
    signedIn()

    await GET(request('?locale=fr'))

    expect(getFavoritesList).toHaveBeenCalledWith('user-1', 'en')
  })

  it('returns 500 when the service throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    signedIn()
    vi.mocked(getFavoritesList).mockRejectedValue(new Error('db down'))

    const response = await GET(request(''))

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({ error: 'Failed to fetch favorites' })
  })
})
