import { NextResponse } from 'next/server'
import { db } from '@/db'
import { favorites } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'

interface IFavoriteDetailRouteParams {
  params: Promise<{ itemId: string }>
}

// DELETE /api/favorites/:itemId - remove from favorites
export async function DELETE(request: Request, { params }: IFavoriteDetailRouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId } = await params

    const result = await db
      .delete(favorites)
      .where(and(eq(favorites.userId, session.user.id), eq(favorites.itemId, itemId)))
      .returning()

    if (result.length === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
  }
}
