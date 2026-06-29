import { Suspense } from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/pkg/query'
import { itemDetailServerQueryOptions } from '@/app/entities/api/items/items.query.server'
import { ItemDetailModule } from '@/app/modules/item-detail'

interface IItemDetailPageProps {
  params: Promise<{ slug: string }>
}

// cached per-slug detail prefetch
async function ItemDetailContent({ slug }: { slug: string }) {
  'use cache'

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(itemDetailServerQueryOptions(slug))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemDetailModule slug={slug} />
    </HydrationBoundary>
  )
}

// resolves the dynamic route param — kept inside <Suspense> so Cache Components
// does not flag the params access as blocking, uncached data
async function ItemDetailResolver({ params }: IItemDetailPageProps) {
  const { slug } = await params

  return <ItemDetailContent slug={slug} />
}

// page — /items/[slug]
export default function ItemDetailPage({ params }: IItemDetailPageProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ItemDetailResolver params={params} />
      </Suspense>
    </main>
  )
}
