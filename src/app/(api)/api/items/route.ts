import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { getItemsList } from '@/app/entities/api/items/items.service'

const itemsQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().max(100).catch(''),
  team: z.string().max(50).catch(''),
})

export async function GET(request: NextRequest) {
  try {
    const { page, search, team } = itemsQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams))

    const result = await getItemsList({ page, search, team })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
