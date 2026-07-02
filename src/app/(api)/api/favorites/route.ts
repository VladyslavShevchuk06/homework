import { NextResponse } from 'next/server'
import { auth } from '@/app/shared/lib/auth'
import { getFavoritesList } from '@/app/entities/api/favorites/favorites.service'

// GET /api/favorites
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userFavorites = await getFavoritesList(session.user.id)

    return NextResponse.json(userFavorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}
