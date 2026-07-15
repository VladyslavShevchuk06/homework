'use client'

import { type FC } from 'react'
import { useTheme } from 'next-themes'
import { Toaster as SonnerToaster, toast } from 'sonner'

// component
export const Toaster: FC = () => {
  const { resolvedTheme } = useTheme()

  return (
    <SonnerToaster theme={resolvedTheme === 'dark' ? 'dark' : 'light'} position="top-center" richColors closeButton />
  )
}

export { toast }
