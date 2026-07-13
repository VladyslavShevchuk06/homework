'use client'

import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@/pkg/locale'
import { favoritesListQueryOptions } from '@/app/entities/api'
import { Card, CardContent, FavoriteCount } from '@/app/shared/components/ui'

// module
export function FavoritesModule() {
  
  const { data, isPending, isError } = useQuery(favoritesListQueryOptions())

  const favorites = data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">My Favorite Drivers</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {favorites.length === 0
            ? "You haven't added any favorites yet. Browse drivers to add them!"
            : `You have ${favorites.length} favorite driver${favorites.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {isPending ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">Loading favorites...</p>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-red-600 dark:text-red-400">Failed to load favorites</p>
            <Link
              href="/items"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Browse drivers →
            </Link>
          </CardContent>
        </Card>
      ) : favorites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-slate-600 dark:text-slate-400">No favorites yet</p>
            <Link
              href="/items"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Browse drivers →
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((favorite) => (
            <Link key={favorite.itemId} href={`/items/${favorite.slug}`}>
              <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:ring-2 hover:ring-blue-500">
                <CardContent className="p-0">
                  {favorite.imageUrl && (
                    <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={favorite.imageUrl}
                        alt={favorite.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{favorite.title}</h3>
                      <FavoriteCount count={favorite.favoritesCount} className="mt-1 shrink-0" />
                    </div>
                    {favorite.description && (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{favorite.description}</p>
                    )}
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
