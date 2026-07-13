import 'server-only'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { favorites, items } from '@/db/schema'
import { favoritesCount } from '@/db/favorites-count'
import { IFavoriteWithItem } from '@/app/entities/models'

// get favorites list
export async function getFavoritesList(userId: string): Promise<IFavoriteWithItem[]> {
  
  const rows = await db
    .select({
      id: favorites.id,
      itemId: favorites.itemId,
      slug: items.slug,
      title: items.title,
      description: items.description,
      imageUrl: items.imageUrl,
      createdAt: favorites.createdAt,
      favoritesCount,
    })
    .from(favorites)
    .innerJoin(items, eq(favorites.itemId, items.id))
    .where(eq(favorites.userId, userId))

  return rows as IFavoriteWithItem[]
}

// add favorite
export async function addFavorite(userId: string, itemId: string): Promise<void> {
  await db.insert(favorites).values({ userId, itemId }).onConflictDoNothing()
}

// remove favorite
export async function removeFavorite(userId: string, itemId: string): Promise<boolean> {
  const removed = await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.itemId, itemId)))
    .returning({ id: favorites.id })

  return removed.length > 0
}
