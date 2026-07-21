'use client'

import { type FC } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/app/shared/components/ui'
import { IErrorModuleProps } from './error.interface'

// module
const ErrorModule: FC<Readonly<IErrorModuleProps>> = (props) => {
  const t = useTranslations('Errors')
  const { title = t('title'), description = t('description'), reset, error } = props

  // return
  return (
    <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      <p className="max-w-md text-slate-600 dark:text-slate-400">{description}</p>
      {error?.digest && (
        <p className="text-sm text-slate-400 dark:text-slate-500">
          {t('reference')} {error.digest}
        </p>
      )}
      {reset && (
        <Button onClick={reset} className="mt-2">
          {t('tryAgain')}
        </Button>
      )}
    </div>
  )
}

export default ErrorModule
