'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { itemDetailQueryOptions } from '@/app/entities/api'
import { Card, CardContent, CardHeader, CardTitle, FavoriteCount } from '@/app/shared/components/ui'
import { FavoriteToggle } from '@/app/features/favorite-toggle'
import { parseDriverMeta } from '@/app/shared/utils'
import { IItemDetailModuleProps } from './item-detail.interface'

export function ItemDetailModule({ slug }: IItemDetailModuleProps) {
  const { data: item, isLoading, error } = useQuery(itemDetailQueryOptions(slug))

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-slate-600">Loading driver...</p>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="space-y-4">
        <div>
          <Link href="/items" className="text-blue-600 hover:text-blue-700">
            ← Back to drivers
          </Link>
        </div>
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg text-red-600">Driver not found</p>
        </div>
      </div>
    )
  }

  const { team, number, country } = parseDriverMeta(item.description)

  return (
    <div className="space-y-6">
      <Link href="/items" className="text-blue-600 hover:text-blue-700">
        ← Back to drivers
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {item.imageUrl && (
                <div className="relative h-96 w-full bg-slate-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle>{item.title}</CardTitle>
                <FavoriteCount count={item.favoritesCount} className="mt-1 shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {team && (
                <div>
                  <h3 className="text-sm font-medium text-slate-600">Team</h3>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{team}</p>
                </div>
              )}
              {number && (
                <div>
                  <h3 className="text-sm font-medium text-slate-600">Number</h3>
                  <p className="mt-1 text-lg font-semibold text-slate-900">#{number}</p>
                </div>
              )}
              {country && (
                <div>
                  <h3 className="text-sm font-medium text-slate-600">Nationality</h3>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{country}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <FavoriteToggle itemId={item.id} />
        </div>
      </div>
    </div>
  )
}
