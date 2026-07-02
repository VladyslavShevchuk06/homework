import { NotFoundModule } from '@/app/modules/not-found'

// not found
export default function DriverNotFound() {
  return (
    <NotFoundModule
      title="Driver not found"
      description="We couldn't find the driver you're looking for. They may have retired or the link is incorrect."
      returnHref="/items"
      returnLabel="Back to drivers"
    />
  )
}
