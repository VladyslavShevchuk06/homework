'use client'

import { type FC } from 'react'
import { ErrorModule } from '@/app/modules/error'

// interface
interface IProps {
  error: Error & { digest?: string }
  reset: () => void
}

// error boundary
const ItemDetailError: FC<Readonly<IProps>> = (props) => {
  const { error, reset } = props

  return <ErrorModule error={error} reset={reset} title="Failed to load driver details" />
}

export default ItemDetailError
