import { Suspense } from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/pkg/query'
import { itemDetailQueryOptions } from '@/entities/api'
import { ItemDetailModule } from '@/app/modules/item-detail'

interface IItemDetailPageProps {
  params: Promise<{ id: string }>
}

// cached per-id detail prefetch
async function ItemDetailContent({ id }: { id: string }) {
  'use cache'

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(itemDetailQueryOptions(id))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemDetailModule itemId={id} />
    </HydrationBoundary>
  )
}

// resolves the dynamic route param — kept inside <Suspense> so Cache Components
// does not flag the params access as blocking, uncached data
async function ItemDetailResolver({ params }: IItemDetailPageProps) {
  const { id } = await params

  return <ItemDetailContent id={id} />
}

// page — /items/[id]
export default function ItemDetailPage({ params }: IItemDetailPageProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ItemDetailResolver params={params} />
      </Suspense>
    </main>
  )
}
