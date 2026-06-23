import { NextResponse } from 'next/server'
import { db } from '@/db'
import { items } from '@/db/schema'
import { favoritesCount } from '@/db/favorites-count'
import { eq, getTableColumns } from 'drizzle-orm'

interface IItemDetailRouteParams {
  params: Promise<{ slug: string }>
}

// GET /api/items/:slug
export async function GET(_req: Request, { params }: IItemDetailRouteParams) {
  try {
    const { slug } = await params

    const item = await db
      .select({ ...getTableColumns(items), favoritesCount })
      .from(items)
      .where(eq(items.slug, slug))
      .limit(1)

    if (item.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item[0])
  } catch (error) {
    console.error('Error fetching item:', error)
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}
