'use client'

import { type FC } from 'react'
import { useTranslations } from 'next-intl'
import { useExperimentExposure } from '@/pkg/growthbook'
import { ItemsListContent } from './elements/items-list-content'
import { type IItemsListParams } from '@/app/entities/models'
import { EExperimentKey, type EVariant } from '@/app/shared/interfaces'

// module
const ItemsListModule: FC<Readonly<Required<IItemsListParams> & { variant: EVariant }>> = (props) => {
  const { page, search, team, locale, variant } = props
  const t = useTranslations('ItemsList')

  // fires the deduped mixpanel exposure once growthbook resolves the assignment
  useExperimentExposure(EExperimentKey.ITEMS_LIST_LAYOUT)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('title')}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{t('subtitle')}</p>
      </div>

      <ItemsListContent page={page} search={search} team={team} locale={locale} variant={variant} />
    </div>
  )
}

export default ItemsListModule
