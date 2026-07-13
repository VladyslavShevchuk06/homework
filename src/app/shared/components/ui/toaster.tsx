'use client'

import { useTheme } from 'next-themes'
import { Toaster as SonnerToaster, toast } from 'sonner'

// component
export function Toaster() {
  const { resolvedTheme } = useTheme()

  return (
    <SonnerToaster theme={resolvedTheme === 'dark' ? 'dark' : 'light'} position="top-center" richColors closeButton />
  )
}

export { toast }
