'use client'

import { type FC } from 'react'
import { useTranslations } from 'next-intl'
import { NotFoundModule } from '@/app/modules/not-found'

// not found
const DriverNotFound: FC = () => {
  const t = useTranslations('NotFound')

  // return
  return (
    <NotFoundModule
      title={t('driverTitle')}
      description={t('driverDescription')}
      returnHref="/items"
      returnLabel={t('backToDrivers')}
    />
  )
}

export default DriverNotFound
