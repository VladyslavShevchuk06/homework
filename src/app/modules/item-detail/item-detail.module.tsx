'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { itemDetailQueryOptions } from '@/entities/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { FavoriteToggle } from '@/app/features/favorite-toggle'

interface IItemDetailModuleProps {
  itemId: string
}

export function ItemDetailModule({ itemId }: IItemDetailModuleProps) {
  const { data: item, isLoading, error } = useQuery(itemDetailQueryOptions(itemId))

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

  const [team, number, country] = item.description
    ? item.description.split(' | ').map((s) => s.split(': ')[1])
    : ['', '', '']

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
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
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

          <FavoriteToggle itemId={itemId} />
        </div>
      </div>
    </div>
  )
}
