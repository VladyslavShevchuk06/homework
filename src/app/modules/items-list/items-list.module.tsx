'use client'

import { useQuery } from '@tanstack/react-query'
import { itemsListQueryOptions } from '@/entities/api'
import { ItemCard } from './elements/item-card'

interface IItemsListModuleProps {
  // placeholder for future extension
}

export function ItemsListModule({}: IItemsListModuleProps) {
  const { data: items = [], isLoading, error } = useQuery(itemsListQueryOptions())

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-slate-600">Loading drivers...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-red-600">Failed to load drivers</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">F1 2026 Drivers</h1>
        <p className="mt-2 text-slate-600">Browse the 22 drivers of the 2026 F1 season</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
