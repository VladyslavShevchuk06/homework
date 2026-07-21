import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { favorites, items } from '@/db/schema'

// favorites count sub-select
export const favoritesCount = db.$count(favorites, eq(favorites.itemId, items.id))
