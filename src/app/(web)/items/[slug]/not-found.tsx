import { type FC } from 'react'
import { NotFoundModule } from '@/app/modules/not-found'

// not found
const DriverNotFound: FC = () => {
  // return
  return (
    <NotFoundModule
      title="Driver not found"
      description="We couldn't find the driver you're looking for. They may have retired or the link is incorrect."
      returnHref="/items"
      returnLabel="Back to drivers"
    />
  )
}

export default DriverNotFound
