'use client'

import { useQuery } from '@tanstack/react-query'
import { useFavoriteToggleMutation, favoritesListQueryOptions } from '@/app/entities/api'
import { Button } from '@/app/shared/components/ui'
import { authClient } from '@/pkg/auth'
import { IFavoriteToggleProps } from './favorite-toggle.interface'

export function FavoriteToggle({ itemId }: IFavoriteToggleProps) {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  const { data: favorites = [] } = useQuery(favoritesListQueryOptions())
  const { addMutation, removeMutation } = useFavoriteToggleMutation()

  const isFavorited = favorites.some((fav) => fav.itemId === itemId)
  const isLoading = addMutation.isPending || removeMutation.isPending

  if (isPending) {
    return null
  }

  if (!user) {
    return null
  }

  const handleToggle = async () => {
    if (isFavorited) {
      await removeMutation.mutateAsync(itemId)
    } else {
      await addMutation.mutateAsync({ itemId })
    }
  }

  return (
    <Button
      onClick={handleToggle}
      variant={isFavorited ? 'default' : 'outline'}
      disabled={isLoading}
      className="w-full"
    >
      {/* isFavorited flips instantly via the optimistic mutation, so the label
          updates immediately — the button just dims (disabled) during the request */}
      {isFavorited ? '★ Remove from Favorites' : '☆ Add to Favorites'}
    </Button>
  )
}
