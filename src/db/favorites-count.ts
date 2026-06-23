import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { favorites, items } from '@/db/schema'

// correlated sub-select: how many favorites rows reference each item.
// embed in any query that has `items` in scope, e.g.
//   db.select({ ...getTableColumns(items), favoritesCount }).from(items)
export const favoritesCount = db.$count(favorites, eq(favorites.itemId, items.id))
