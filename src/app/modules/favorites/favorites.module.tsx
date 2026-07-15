'use client'

import { type FC } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@/pkg/locale'
import { favoritesListQueryOptions } from '@/app/entities/api/favorites'
import { Card, CardContent, CountBadge } from '@/app/shared/components/ui'

// module
export const FavoritesModule: FC = () => {
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
                      <CountBadge
                        count={favorite.favoritesCount}
                        label={`Favorited ${favorite.favoritesCount} time${favorite.favoritesCount === 1 ? '' : 's'}`}
                        icon={
                          <svg
                            className="h-3.5 w-3.5 text-rose-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M10 17.5 8.55 16.2C4.4 12.45 1.67 9.98 1.67 6.96 1.67 4.49 3.61 2.5 6.08 2.5c1.4 0 2.74.65 3.92 1.74C11.18 3.15 12.52 2.5 13.92 2.5c2.47 0 4.41 1.99 4.41 4.46 0 3.02-2.73 5.49-6.88 9.25L10 17.5Z" />
                          </svg>
                        }
                        className="mt-1 shrink-0"
                      />
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
