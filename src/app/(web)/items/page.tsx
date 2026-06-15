import { Suspense } from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/pkg/query'
import { itemsListQueryOptions } from '@/entities/api'
import { ItemsListModule } from '@/app/modules/items-list'

async function ItemsPageContent() {
  'use cache'

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(itemsListQueryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ItemsListModule />
      </Suspense>
    </HydrationBoundary>
  )
}

export default async function ItemsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <ItemsPageContent />
    </main>
  )
}
