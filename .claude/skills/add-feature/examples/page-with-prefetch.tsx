// Connective snippet: a thin (web)/<route>/page.tsx that SSR-prefetches the new
// resource's query options and hands the dehydrated cache to the module via
// HydrationBoundary. The page stays an RSC; only the module carries 'use client'.
// Module/page placement + shapes: client-structure/examples/app + references/structure.md.

import { Suspense } from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/pkg/query'
import { <entity>ListQueryOptions } from '@/app/entities/api'
import { <Entity>ListModule } from '@/app/modules/<entity>-list'

interface I<Entity>PageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

async function <Entity>PageContent({ searchParams }: I<Entity>PageProps) {
  const { page: pageParam, search } = await searchParams
  const page = Number(pageParam) || 1

  const queryClient = getQueryClient()
  // prefetch the SAME queryOptions the module's useQuery will read — keys match,
  // so the client hydrates without a second network round-trip.
  await queryClient.prefetchQuery(<entity>ListQueryOptions({ page, search: search ?? '' }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <<Entity>ListModule />
      </Suspense>
    </HydrationBoundary>
  )
}

export default function <Entity>Page({ searchParams }: I<Entity>PageProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <<Entity>PageContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

// Worked reference: src/app/(web)/items/page.tsx.
