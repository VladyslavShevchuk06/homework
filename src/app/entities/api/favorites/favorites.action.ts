'use server'

import { headers } from 'next/headers'
import { updateTag } from 'next/cache'
import { auth } from '@/app/shared/lib/auth'
import { itemDetailCacheTag, itemsListCacheTag } from '@/app/shared/interfaces'
import { addFavorite, removeFavorite } from './favorites.service'

export async function toggleFavorite(itemId: string, slug: string): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const wasFavorited = await removeFavorite(session.user.id, itemId)

  if (!wasFavorited) {
    await addFavorite(session.user.id, itemId)
  }

  updateTag(itemDetailCacheTag(slug))
  updateTag(itemsListCacheTag())
}
