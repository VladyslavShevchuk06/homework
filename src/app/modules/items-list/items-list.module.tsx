'use client'

import { type FC } from 'react'
import { useTranslations } from 'next-intl'
import { ItemsListContent } from './elements/items-list-content'
import { type IItemsListParams } from '@/app/entities/models'

// module
const ItemsListModule: FC<Readonly<Required<IItemsListParams>>> = (props) => {
  const { page, search, team, locale } = props
  const t = useTranslations('ItemsList')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('title')}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{t('subtitle')}</p>
      </div>

      <ItemsListContent page={page} search={search} team={team} locale={locale} />
    </div>
  )
}

export default ItemsListModule
