import { NextResponse } from 'next/server'
import { db } from '@/db'
import { items } from '@/db/schema'
import { desc } from 'drizzle-orm'

// GET /api/items
export async function GET() {
  try {
    const allItems = await db.select().from(items).orderBy(desc(items.createdAt))

    return NextResponse.json(allItems)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
