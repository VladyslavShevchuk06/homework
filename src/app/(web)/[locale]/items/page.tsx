import { type NextPage } from 'next'
import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { type Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/pkg/query'
import { itemsListServerQueryOptions } from '@/app/entities/api/items/index.server'
import { itemsListCacheTag } from '@/app/shared/utils'
import { ItemsListModule } from '@/app/modules/items-list'
import { type IItemsListParams } from '@/app/entities/models'

async function ItemsListShell({ page, search, team, locale }: Readonly<Required<IItemsListParams>>) {
  'use cache'
  cacheLife({ revalidate: 3600 })
  cacheTag(itemsListCacheTag())

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(itemsListServerQueryOptions({ page, search, team, locale }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemsListModule page={page} search={search} team={team} locale={locale} />
    </HydrationBoundary>
  )
}

async function ItemsListResolver({
  searchParams,
  locale,
}: Readonly<{ searchParams: Promise<Record<string, string | undefined>>; locale: Locale }>) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search ?? ''
  const team = params.team ?? ''

  return <ItemsListShell page={page} search={search} team={team} locale={locale} />
}

interface IProps {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<Record<string, string | undefined>>
}

// page
const ItemsPage: NextPage<Readonly<IProps>> = async (props) => {
  const { locale } = await props.params
  setRequestLocale(locale)

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={null}>
        <ItemsListResolver searchParams={props.searchParams} locale={locale} />
      </Suspense>
    </main>
  )
}

export default ItemsPage
