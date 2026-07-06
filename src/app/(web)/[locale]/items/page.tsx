import { type NextPage } from 'next'
import { cacheLife, cacheTag } from 'next/cache'
import { type Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/pkg/query'
import { itemsListServerQueryOptions } from '@/app/entities/api/items/items.query.server'
import { itemsListCacheTag } from '@/app/shared/interfaces'
import { ItemsListModule } from '@/app/modules/items-list'

async function ItemsListShell() {
  'use cache'
  cacheLife({ revalidate: 3600 })
  cacheTag(itemsListCacheTag())

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(itemsListServerQueryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemsListModule />
    </HydrationBoundary>
  )
}

interface IProps {
  params: Promise<{ locale: Locale }>
}

const ItemsPage: NextPage<Readonly<IProps>> = async (props) => {
  const { locale } = await props.params
  setRequestLocale(locale)

  return (
    <main className='container mx-auto px-4 py-8'>
      <ItemsListShell />
    </main>
  )
}

export default ItemsPage
