'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { favoritesListQueryOptions } from '@/entities/api'
import { Card, CardContent } from '@/components/ui'

interface IFavoritesModuleProps {
  // placeholder for future extension
}

export function FavoritesModule({}: IFavoritesModuleProps) {
  const { data: favorites = [], isLoading, error } = useQuery(favoritesListQueryOptions())

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-slate-600">Loading favorites...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-red-600">Failed to load favorites</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Favorite Drivers</h1>
        <p className="mt-2 text-slate-600">
          {favorites.length === 0
            ? "You haven't added any favorites yet. Browse drivers to add them!"
            : `You have ${favorites.length} favorite driver${favorites.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-slate-600">No favorites yet</p>
            <Link href="/items" className="text-blue-600 hover:text-blue-700">
              Browse drivers →
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((favorite) => (
            <Link key={favorite.itemId} href={`/items/${favorite.itemId}`}>
              <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:ring-2 hover:ring-blue-500">
                <CardContent className="p-0">
                  {favorite.imageUrl && (
                    <div className="relative h-48 w-full bg-slate-100">
                      <img src={favorite.imageUrl} alt={favorite.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-900">{favorite.title}</h3>
                    {favorite.description && <p className="mt-2 text-sm text-slate-600">{favorite.description}</p>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
