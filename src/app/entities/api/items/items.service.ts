import 'server-only'
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { type Locale } from 'next-intl'
import { db } from '@/db'
import { favorites, items, teams } from '@/db/schema'
import { favoritesCount } from '@/db/favorites-count'
import { IItem, IItemsListParams, IItemsListResponse } from '@/app/entities/models/item.model'

const PAGE_SIZE = 11

// locale column pickers
function localeColumns(locale: Locale) {
  const isUk = locale === 'uk'

  return {
    title: isUk ? items.titleUk : items.titleEn,
    team: isUk ? teams.nameUk : teams.nameEn,
    country: isUk ? items.countryUk : items.countryEn,
    description: isUk ? items.descriptionUk : items.descriptionEn,
  }
}

// locale-aware item projection
function itemSelection(locale: Locale) {
  const columns = localeColumns(locale)

  return {
    id: items.id,
    slug: items.slug,
    title: columns.title,
    team: columns.team,
    teamSlug: teams.slug,
    number: items.number,
    country: columns.country,
    description: columns.description,
    imageUrl: items.imageUrl,
    createdAt: items.createdAt,
    favoritesCount,
  }
}

// get items list
export async function getItemsList({
  page = 1,
  search = '',
  team = '',
  locale = 'en',
}: IItemsListParams = {}): Promise<IItemsListResponse> {
  const currentPage = Math.max(1, Number(page) || 1)
  const searchTerm = (search ?? '').trim()
  const teamTerm = (team ?? '').trim()
  const columns = localeColumns(locale)

  const searchFilter = searchTerm
    ? or(
        ilike(columns.title, `%${searchTerm}%`),
        ilike(sql`coalesce(${columns.description}, '')`, `%${searchTerm}%`),
        ilike(columns.team, `%${searchTerm}%`),
      )
    : undefined
  const teamFilter = teamTerm && teamTerm !== 'all' ? eq(teams.slug, teamTerm) : undefined
  const filter = and(searchFilter, teamFilter)

  // the filter reaches into teams, so the count needs the join too — $count over a subquery
  const filtered = db
    .select({ id: items.id })
    .from(items)
    .innerJoin(teams, eq(items.teamId, teams.id))
    .where(filter)
    .as('filtered')

  const [data, totalCount] = await Promise.all([
    db
      .select(itemSelection(locale))
      .from(items)
      .innerJoin(teams, eq(items.teamId, teams.id))
      .where(filter)
      .orderBy(desc(items.createdAt))
      .limit(PAGE_SIZE)
      .offset((currentPage - 1) * PAGE_SIZE),
    db.$count(filtered),
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
export async function getItemDetail(slug: string, locale: Locale = 'en'): Promise<IItem | null> {
  const row = await db.query.items.findFirst({
    where: eq(items.slug, slug),
    with: { team: true },
  })

  if (!row) {
    return null
  }

  // counted separately — a relational query rewrites table aliases, which breaks
  // the correlated favoritesCount sub-select
  const count = await db.$count(favorites, eq(favorites.itemId, row.id))

  const isUk = locale === 'uk'

  return {
    id: row.id,
    slug: row.slug,
    title: isUk ? row.titleUk : row.titleEn,
    team: isUk ? row.team.nameUk : row.team.nameEn,
    teamSlug: row.team.slug,
    number: row.number,
    country: isUk ? row.countryUk : row.countryEn,
    description: isUk ? row.descriptionUk : row.descriptionEn,
    imageUrl: row.imageUrl,
    createdAt: row.createdAt,
    favoritesCount: count,
  }
}
