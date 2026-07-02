import { type NextPage } from 'next'
import { cacheLife } from 'next/cache'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/pkg/query'
import { itemsListServerQueryOptions } from '@/app/entities/api/items/items.query.server'
import { ItemsListModule } from '@/app/modules/items-list'

// shell
async function ItemsListShell() {
  'use cache'
  cacheLife({ revalidate: 3600 })

  // cache
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(itemsListServerQueryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemsListModule />
    </HydrationBoundary>
  )
}

// page
const ItemsPage: NextPage = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <ItemsListShell />
    </main>
  )
}

export default ItemsPage
