'use client'

import { type FC } from 'react'
import { ErrorModule } from '@/app/modules/error'

interface IProps {
  error: Error & { digest?: string }
  reset: () => void
}

// error boundary
const LocaleError: FC<Readonly<IProps>> = (props) => {
  const { error, reset } = props

  return (
    <main className="container mx-auto px-4 py-8">
      <ErrorModule error={error} reset={reset} />
    </main>
  )
}

export default LocaleError
