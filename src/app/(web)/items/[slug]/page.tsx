import { Suspense } from 'react'
import { type NextPage } from 'next'
import { notFound } from 'next/navigation'
import { cacheLife, cacheTag } from 'next/cache'
import { getItemDetail, getAllItemSlugs } from '@/app/entities/api/items/items.service'
import { itemDetailCacheTag } from '@/app/shared/interfaces'
import { ItemDetailModule } from '@/app/modules/item-detail'

// interface
interface IProps {
  params: Promise<{ slug: string }>
}

// static params
export async function generateStaticParams() {
  const slugs = await getAllItemSlugs()
  return slugs.map((slug) => ({ slug }))
}

// content
async function ItemDetailContent(props: { slug: string }) {
  'use cache'
  cacheLife({ revalidate: 3600 })
  cacheTag(itemDetailCacheTag(props.slug))

  const { slug } = props
  const item = await getItemDetail(slug)

  if (!item) {
    notFound()
  }

  return <ItemDetailModule item={item} />
}

// resolver
async function ItemDetailResolver(props: IProps) {
  const { params } = props
  const { slug } = await params

  return <ItemDetailContent slug={slug} />
}

// page
const ItemDetailPage: NextPage<Readonly<IProps>> = (props) => {
  const { params } = props

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ItemDetailResolver params={params} />
      </Suspense>
    </main>
  )
}

export default ItemDetailPage
