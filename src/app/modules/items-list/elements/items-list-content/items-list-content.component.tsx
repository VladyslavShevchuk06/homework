'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { itemsListQueryOptions } from '@/app/entities/api'
import { Button } from '@/app/shared/components/ui'
import { SearchForm } from '@/app/features/search-form'
import { ItemCard } from '../item-card'

// component
export function ItemsListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search') ?? ''
  const team = searchParams.get('team') ?? ''

  const { data, isPending, isError, isFetching } = useQuery(itemsListQueryOptions({ page, search, team }))

  const items = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1
  const currentPage = data?.meta.currentPage ?? page

  const goToPage = (next: number) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (team && team !== 'all') params.set('team', team)
    params.set('page', String(next))
    router.push(`/items?${params.toString()}`)
  }

  // return
  return (
    <div className="space-y-6">
      <SearchForm />

      {isPending ? (
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg text-slate-600 dark:text-slate-400">Loading drivers...</p>
        </div>
      ) : isError ? (
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg text-red-600 dark:text-red-400">Failed to load drivers</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {search ? `No drivers match "${search}"` : 'No drivers found'}
          </p>
        </div>
      ) : (
        <>
          <div
            className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
              isFetching ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
              ← Previous
            </Button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="outline" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>
              Next →
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
