'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useFavoriteToggleMutation, favoritesListQueryOptions } from '@/entities/api'
import { Button } from '@/components/ui'
import { authClient } from '@/pkg/auth'

interface IFavoriteToggleProps {
  itemId: string
  isFavorited?: boolean
}

export function FavoriteToggle({ itemId, isFavorited: initialFavorited }: IFavoriteToggleProps) {
  const [user, setUser] = useState<any>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  const { data: favorites = [] } = useQuery(favoritesListQueryOptions())
  const { addMutation, removeMutation } = useFavoriteToggleMutation()

  const isFavorited = favorites.some((fav) => fav.itemId === itemId)
  const isLoading = addMutation.isPending || removeMutation.isPending

  useEffect(() => {
    const checkSession = async () => {
      const session = await authClient.getSession()
      setUser(session.data?.user || null)
      setIsHydrated(true)
    }
    checkSession()
  }, [])

  if (!isHydrated) {
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
      {isLoading ? 'Updating...' : isFavorited ? '★ Remove from Favorites' : '☆ Add to Favorites'}
    </Button>
  )
}
