'use client'

import { type FC } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/pkg/locale'
import { useExperimentExposure } from '@/pkg/growthbook'
import { mixpanelClient } from '@/pkg/mixpanel'
import { useAbVariant } from '@/app/shared/hooks/use-ab-variant.hook'
import { EExperimentKey, EVariant } from '@/app/shared/interfaces/experiment.interface'

// component — mounted only for eligible users, so the exposure is not diluted by
// visitors who could never see the link
export const BackToFavorites: FC = () => {
  const t = useTranslations('ItemDetail')
  const variant = useAbVariant(EExperimentKey.FAVORITES_BACK_LINK)

  // fires the deduped mixpanel exposure once growthbook resolves the assignment
  useExperimentExposure(EExperimentKey.FAVORITES_BACK_LINK)

  if (variant !== EVariant.VARIANT_B) {
    return null
  }

  return (
    <Link
      href="/favorites"
      onClick={() => mixpanelClient.track('Back link clicked', { Destination: 'favorites' })}
      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
    >
      {t('backToFavorites')}
    </Link>
  )
}
