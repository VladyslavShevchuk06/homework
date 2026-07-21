import { NextResponse } from 'next/server'
import { type Locale } from 'next-intl'
import { auth } from '@/lib/auth'
import { getFavoritesList } from '@/app/entities/api/favorites/index.server'

// GET /api/favorites
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requested = new URL(request.url).searchParams.get('locale')
    const locale: Locale = requested === 'uk' ? 'uk' : 'en'

    const userFavorites = await getFavoritesList(session.user.id, locale)

    return NextResponse.json(userFavorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}
