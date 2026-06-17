import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/db'
import { items } from '@/db/schema'
import { desc, ilike, or, count } from 'drizzle-orm'

const PAGE_SIZE = 11

// GET /api/items?page=1&search=
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const page = Math.max(1, Number(params.get('page')) || 1)
    const search = (params.get('search') ?? '').trim()

    // filter by title OR description when a search term is present
    const filter = search ? or(ilike(items.title, `%${search}%`), ilike(items.description, `%${search}%`)) : undefined

    const [data, totals] = await Promise.all([
      db
        .select()
        .from(items)
        .where(filter)
        .orderBy(desc(items.createdAt))
        .limit(PAGE_SIZE)
        .offset((page - 1) * PAGE_SIZE),
      db.select({ value: count() }).from(items).where(filter),
    ])

    const totalCount = totals[0]?.value ?? 0
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

    return NextResponse.json({
      data,
      meta: { totalCount, totalPages, currentPage: page },
    })
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
