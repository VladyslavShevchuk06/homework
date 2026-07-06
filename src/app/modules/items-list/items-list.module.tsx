import { Suspense } from 'react'
import { ItemsListContent } from './elements/items-list-content'

// module
export function ItemsListModule() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">F1 2026 Drivers</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Browse the drivers of the 2026 F1 season</p>
      </div>

      <Suspense fallback={<div className="flex justify-center p-4 text-slate-500 dark:text-slate-400">Loading...</div>}>
        <ItemsListContent />
      </Suspense>
    </div>
  )
}
