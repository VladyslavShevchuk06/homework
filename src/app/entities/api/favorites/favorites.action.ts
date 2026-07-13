'use server'

import { headers } from 'next/headers'
import { updateTag } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { itemDetailCacheTag, itemsListCacheTag, type IActionResult } from '@/app/shared/interfaces'
import { addFavorite, removeFavorite } from './favorites.service'

const itemIdSchema = z.string().uuid()

export async function toggleFavorite(itemId: string, slug: string): Promise<IActionResult> {
  
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return { ok: false, error: 'UNAUTHORIZED' }
  }

  const parsed = itemIdSchema.safeParse(itemId)

  if (!parsed.success) {
    return { ok: false, error: 'INVALID_ITEM_ID' }
  }

  const wasFavorited = await removeFavorite(session.user.id, parsed.data)

  if (!wasFavorited) {
    await addFavorite(session.user.id, parsed.data)
  }

  updateTag(itemDetailCacheTag(slug))
  updateTag(itemsListCacheTag())

  return { ok: true, data: undefined }
}
