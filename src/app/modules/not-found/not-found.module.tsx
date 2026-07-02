import { type FC } from 'react'
import Link from 'next/link'
import { INotFoundModuleProps } from './not-found.interface'

// module
const NotFoundModule: FC<Readonly<INotFoundModuleProps>> = (props) => {
  const {
    title = '404 - Not Found',
    description = 'The page you are looking for does not exist or has been moved.',
    returnHref = '/',
    returnLabel = 'Go home',
  } = props

  // return
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="max-w-md text-slate-600">{description}</p>
        <div className="mt-2 flex items-center gap-3">
          <Link href={returnHref} className="text-blue-600 hover:text-blue-700">
            {returnLabel}
          </Link>
        </div>
      </div>
    </main>
  )
}

export default NotFoundModule
