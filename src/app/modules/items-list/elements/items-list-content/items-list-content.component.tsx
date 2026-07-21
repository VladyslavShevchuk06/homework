'use client'

import { type FC } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/pkg/locale'
import { useQuery } from '@tanstack/react-query'
import { itemsListQueryOptions } from '@/app/entities/api/items'
import { Button } from '@/app/shared/components/ui'
import { SearchForm } from '@/app/features/search-form'
import { type IItemsListParams } from '@/app/entities/models'
import { ItemCard } from '../item-card'

// component
export const ItemsListContent: FC<Readonly<Required<IItemsListParams>>> = (props) => {
  const { page, search, team, locale } = props
  const t = useTranslations('ItemsList')
  const router = useRouter()

  const { data, isPending, isError, isFetching } = useQuery(itemsListQueryOptions({ page, search, team, locale }))

  const items = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1
  const currentPage = data?.meta.currentPage ?? page

  const goToPage = (next: number) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (team && team !== 'all') params.set('team', team)
    params.set('page', String(next))
    router.push(`/items?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <SearchForm search={search} team={team} />

      {isPending ? (
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('loading')}</p>
        </div>
      ) : isError ? (
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg text-red-600 dark:text-red-400">{t('error')}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {search ? t('emptyWithSearch', { search }) : t('empty')}
          </p>
        </div>
      ) : (
        <>
          <div
            className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
              isFetching ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
              {t('previous')}
            </Button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t('pagination', { currentPage, totalPages })}
            </span>
            <Button variant="outline" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>
              {t('next')}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
