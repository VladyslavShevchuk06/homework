import { NextResponse } from 'next/server'
import { getItemDetail } from '@/app/entities/api/items/items.service'

interface IItemDetailRouteParams {
  params: Promise<{ slug: string }>
}

// GET /api/items/:slug
export async function GET(_req: Request, { params }: IItemDetailRouteParams) {
  try {
    const { slug } = await params

    const item = await getItemDetail(slug)

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching item:', error)
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}
