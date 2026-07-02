'use client'

import { type FC } from 'react'
import { Button } from '@/app/shared/components/ui'
import { IErrorModuleProps } from './error.interface'

// module
const ErrorModule: FC<Readonly<IErrorModuleProps>> = (props) => {
  const {
    title = 'Something went wrong',
    description = 'An unexpected error occurred. Please try again.',
    reset,
    error,
  } = props

  // return
  return (
    <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="max-w-md text-slate-600">{description}</p>
      {error?.digest && <p className="text-sm text-slate-400">Reference: {error.digest}</p>}
      {reset && (
        <Button onClick={reset} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  )
}

export default ErrorModule
