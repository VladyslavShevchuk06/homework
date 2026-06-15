import { NextResponse } from 'next/server'
import { db } from '@/db'
import { items } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface IItemDetailRouteParams {
  params: Promise<{ id: string }>
}

// GET /api/items/:id
export async function GET(_req: Request, { params }: IItemDetailRouteParams) {
  try {
    const { id } = await params

    const item = await db.select().from(items).where(eq(items.id, id)).limit(1)

    if (item.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item[0])
  } catch (error) {
    console.error('Error fetching item:', error)
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}
