import { type NextPage } from 'next'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'
import { type Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/pkg/query'
import { itemsListServerQueryOptions } from '@/app/entities/api/items/index.server'
import { itemsListCacheTag } from '@/app/shared/utils/cache-tag.util'
import { ItemsListModule } from '@/app/modules/items-list'
import { type IItemsListParams } from '@/app/entities/models/item.model'
import { EVariant } from '@/app/shared/interfaces/experiment.interface'
import { AB_VARIANT_COOKIE } from '@/app/shared/constants/experiment.constant'

async function ItemsListShell({
  page,
  search,
  team,
  locale,
  variant,
}: Readonly<Required<IItemsListParams> & { variant: EVariant }>) {
  'use cache'
  cacheLife({ revalidate: 3600 })
  cacheTag(itemsListCacheTag())

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(itemsListServerQueryOptions({ page, search, team, locale }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemsListModule page={page} search={search} team={team} locale={locale} variant={variant} />
    </HydrationBoundary>
  )
}

async function ItemsListResolver({
  searchParams,
  locale,
}: Readonly<{ searchParams: Promise<Record<string, string | undefined>>; locale: Locale }>) {
  const [params, cookieStore] = await Promise.all([searchParams, cookies()])
  const page = Number(params.page) || 1
  const search = params.search ?? ''
  const team = params.team ?? ''
  // bucketing is resolved in the proxy and handed over as a cookie
  const variant =
    cookieStore.get(AB_VARIANT_COOKIE)?.value === EVariant.VARIANT_B ? EVariant.VARIANT_B : EVariant.CONTROL

  return <ItemsListShell page={page} search={search} team={team} locale={locale} variant={variant} />
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
