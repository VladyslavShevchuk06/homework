import 'server-only'
import { and, desc, eq, ilike, or, getTableColumns } from 'drizzle-orm'
import { db } from '@/db'
import { items } from '@/db/schema'
import { favoritesCount } from '@/db/favorites-count'
import { IItem, IItemsListParams, IItemsListResponse } from '@/app/entities/models'

const PAGE_SIZE = 11

// get items list
export async function getItemsList({
  page = 1,
  search = '',
  team = '',
}: IItemsListParams = {}): Promise<IItemsListResponse> {
  const currentPage = Math.max(1, Number(page) || 1)
  const searchTerm = (search ?? '').trim()
  const teamTerm = (team ?? '').trim()

  const searchFilter = searchTerm
    ? or(ilike(items.title, `%${searchTerm}%`), ilike(items.description, `%${searchTerm}%`))
    : undefined
  const teamFilter = teamTerm && teamTerm !== 'all' ? ilike(items.description, `%Team: ${teamTerm}%`) : undefined
  const filter = and(searchFilter, teamFilter)

  const [data, totalCount] = await Promise.all([
    db
      .select({ ...getTableColumns(items), favoritesCount })
      .from(items)
      .where(filter)
      .orderBy(desc(items.createdAt))
      .limit(PAGE_SIZE)
      .offset((currentPage - 1) * PAGE_SIZE),
    db.$count(items, filter),
  ])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return {
    data: data as IItem[],
    meta: { totalCount, totalPages, currentPage },
  }
}

// get all slugs
export async function getAllItemSlugs(): Promise<string[]> {
  const rows = await db.select({ slug: items.slug }).from(items)
  return rows.map((row) => row.slug)
}

// get item detail
export async function getItemDetail(slug: string): Promise<IItem | null> {
  const result = await db
    .select({ ...getTableColumns(items), favoritesCount })
    .from(items)
    .where(eq(items.slug, slug))
    .limit(1)

  return (result[0] as IItem) ?? null
}
