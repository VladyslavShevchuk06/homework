import { Suspense } from 'react'
import { ItemsListContent } from './elements/items-list-content'
import { ItemsListSkeleton } from './elements/items-list-skeleton'

// module
export function ItemsListModule() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">F1 2026 Drivers</h1>
        <p className="mt-2 text-slate-600">Browse the drivers of the 2026 F1 season</p>
      </div>

      <Suspense fallback={<ItemsListSkeleton />}>
        <ItemsListContent />
      </Suspense>
    </div>
  )
}
