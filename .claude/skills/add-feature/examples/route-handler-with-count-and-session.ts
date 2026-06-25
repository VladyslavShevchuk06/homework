// Connective snippet: an (api)/api/<route>/route.ts that combines the two idioms
// this skill cares about — db.$count(...) aggregates and a getSession() guard.
// For handler placement/dependency rules see the client-structure skill's
// references/data-layer.md and references/auth.md. Replace every <entity>.

import { NextResponse, type NextRequest } from 'next/server'
import { eq, desc, getTableColumns } from 'drizzle-orm'
import { db } from '@/db'
import { <entity>s, <child>s } from '@/db/schema'
import { auth } from '@/lib/auth'

// aggregate via correlated sub-select — never count a fetched array's .length.
// (mirrors src/db/favorites-count.ts: db.$count(favorites, eq(favorites.itemId, items.id)))
const <child>Count = db.$count(<child>s, eq(<child>s.<entity>Id, <entity>s.id))

// GET /api/<route> — public read; embeds the aggregate count per row
export async function GET(_request: NextRequest) {
  try {
    const data = await db
      .select({ ...getTableColumns(<entity>s), <child>Count })
      .from(<entity>s)
      .orderBy(desc(<entity>s.createdAt))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching <entity>s:', error)
    return NextResponse.json({ error: 'Failed to fetch <entity>s' }, { status: 500 })
  }
}

// POST /api/<route> — user-scoped write; gate on the Better Auth session
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const [created] = await db
      .insert(<entity>s)
      .values({ userId: session.user.id, title: body.title })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Error creating <entity>:', error)
    return NextResponse.json({ error: 'Failed to create <entity>' }, { status: 500 })
  }
}

// Worked reference: src/app/(api)/api/items/route.ts (db.$count + paginated totals)
// and src/app/(api)/api/favorites/[itemId]/route.ts (getSession-gated DELETE).
