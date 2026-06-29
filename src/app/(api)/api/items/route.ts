import { NextResponse, type NextRequest } from 'next/server'
import { getItemsList } from '@/app/entities/api/items/items.service'

// GET /api/items?page=1&search=&team=
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    const result = await getItemsList({
      page: Number(params.get('page')) || 1,
      search: params.get('search') ?? '',
      team: params.get('team') ?? '',
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
