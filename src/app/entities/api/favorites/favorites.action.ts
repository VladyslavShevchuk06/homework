'use server'

import { headers } from 'next/headers'
import { updateTag } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { itemDetailCacheTag, itemsListCacheTag } from '@/app/shared/interfaces'
import { addFavorite, removeFavorite } from './favorites.service'

const itemIdSchema = z.string().uuid()

export async function toggleFavorite(itemId: string, slug: string): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const parsed = itemIdSchema.safeParse(itemId)

  if (!parsed.success) {
    throw new Error('Invalid item id')
  }

  const wasFavorited = await removeFavorite(session.user.id, parsed.data)

  if (!wasFavorited) {
    await addFavorite(session.user.id, parsed.data)
  }

  updateTag(itemDetailCacheTag(slug))
  updateTag(itemsListCacheTag())
}
