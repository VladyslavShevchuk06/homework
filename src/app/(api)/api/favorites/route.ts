import { NextResponse } from 'next/server'
import { db } from '@/db'
import { favorites, items } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'

// GET /api/favorites - get user's favorites
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userFavorites = await db
      .select({
        id: favorites.id,
        itemId: favorites.itemId,
        slug: items.slug,
        title: items.title,
        description: items.description,
        imageUrl: items.imageUrl,
        createdAt: favorites.createdAt,
      })
      .from(favorites)
      .innerJoin(items, eq(favorites.itemId, items.id))
      .where(eq(favorites.userId, session.user.id))

    return NextResponse.json(userFavorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

// POST /api/favorites - add to favorites
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { itemId } = body as { itemId: string }

    if (!itemId) {
      return NextResponse.json({ error: 'itemId is required' }, { status: 400 })
    }

    // Check if item exists
    const item = await db.select().from(items).where(eq(items.id, itemId)).limit(1)

    if (item.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Check if already favorited
    const existing = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, session.user.id), eq(favorites.itemId, itemId)))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Already favorited' }, { status: 400 })
    }

    // Add favorite
    const result = await db
      .insert(favorites)
      .values({
        userId: session.user.id,
        itemId,
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 })
  }
}
