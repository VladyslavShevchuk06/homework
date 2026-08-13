import { NextResponse, connection, type NextRequest } from 'next/server'
import { z } from 'zod'
import { getTeamsList } from '@/app/entities/api/teams/index.server'

const teamsQuerySchema = z.object({
  locale: z.enum(['en', 'uk']).catch('en'),
})

// GET /api/teams
export async function GET(request: NextRequest) {
  // opt into dynamic rendering before touching request data (cacheComponents)
  await connection()

  try {
    const { locale } = teamsQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams))

    const result = await getTeamsList(locale)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}
