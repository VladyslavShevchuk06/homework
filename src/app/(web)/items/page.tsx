import { Suspense } from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/pkg/query'
import { itemsListQueryOptions } from '@/app/entities/api'
import { ItemsListModule } from '@/app/modules/items-list'

interface IItemsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

async function ItemsPageContent({ searchParams }: IItemsPageProps) {
  const { page: pageParam, search: searchParam } = await searchParams
  const page = Number(pageParam) || 1
  const search = searchParam ?? ''

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(itemsListQueryOptions({ page, search }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ItemsListModule />
      </Suspense>
    </HydrationBoundary>
  )
}

export default function ItemsPage({ searchParams }: IItemsPageProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ItemsPageContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
