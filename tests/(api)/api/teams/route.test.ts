import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { getTeamsList } from '@/app/entities/api/teams/index.server'
import { type ITeam } from '@/app/entities/models/team.model'
import { GET } from '@/app/(api)/api/teams/route'

// connection() has no store outside a next render
vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>()

  return { ...actual, connection: vi.fn().mockResolvedValue(undefined) }
})

// replacing the module keeps 'server-only' and drizzle out of the test
vi.mock('@/app/entities/api/teams/index.server', () => ({ getTeamsList: vi.fn() }))

const ferrari: ITeam = { id: 'team-1', slug: 'ferrari', name: 'Ferrari' }

// request factory
function request(query: string) {
  return new NextRequest(`http://localhost:3000/api/teams${query}`)
}

describe('GET /api/teams', () => {
  beforeEach(() => {
    vi.mocked(getTeamsList).mockReset().mockResolvedValue([ferrari])
  })

  it('honours a supported locale', async () => {
    await GET(request('?locale=uk'))

    expect(getTeamsList).toHaveBeenCalledWith('uk')
  })

  it('falls back to the default locale for an unsupported one', async () => {
    await GET(request('?locale=fr'))

    expect(getTeamsList).toHaveBeenCalledWith('en')
  })

  it('falls back to the default locale when none is given', async () => {
    await GET(request(''))

    expect(getTeamsList).toHaveBeenCalledWith('en')
  })

  it('returns the service payload with 200', async () => {
    const response = await GET(request('?locale=en'))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual([ferrari])
  })

  it('returns 500 when the service throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(getTeamsList).mockRejectedValue(new Error('db down'))

    const response = await GET(request(''))

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({ error: 'Failed to fetch teams' })
  })
})
