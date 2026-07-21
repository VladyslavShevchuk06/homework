import { Suspense } from 'react'
import { type NextPage } from 'next'
import { notFound } from 'next/navigation'
import { cacheLife, cacheTag } from 'next/cache'
import { type Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { getItemDetail, getAllItemSlugs } from '@/app/entities/api/items/index.server'
import { itemDetailCacheTag } from '@/app/shared/utils'
import { routing } from '@/pkg/locale'
import { ItemDetailModule } from '@/app/modules/item-detail'

interface IProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllItemSlugs()
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

async function ItemDetailContent(props: Readonly<{ slug: string; locale: Locale }>) {
  'use cache'
  cacheLife({ revalidate: 3600 })
  cacheTag(itemDetailCacheTag(props.slug))

  const { slug, locale } = props
  const item = await getItemDetail(slug)

  if (!item) {
    notFound()
  }

  return <ItemDetailModule item={item} locale={locale} />
}

async function ItemDetailResolver(props: Readonly<IProps>) {
  const { params } = props
  const { locale, slug } = await params
  setRequestLocale(locale)

  return <ItemDetailContent slug={slug} locale={locale} />
}

// page
const ItemDetailPage: NextPage<Readonly<IProps>> = (props) => {
  const { params } = props

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="flex justify-center p-4 text-slate-500 dark:text-slate-400">Loading...</div>}>
        <ItemDetailResolver params={params} />
      </Suspense>
    </main>
  )
}

export default ItemDetailPage
