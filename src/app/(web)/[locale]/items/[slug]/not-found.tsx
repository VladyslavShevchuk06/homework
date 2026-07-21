import { getTranslations } from 'next-intl/server'
import { NotFoundModule } from '@/app/modules/not-found'

// not found
const DriverNotFound = async () => {
  const t = await getTranslations('NotFound')

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
