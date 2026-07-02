'use client'

import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from './query.pkg'

// interface
interface IQueryProviderProps {
  children: ReactNode
}

// provider
export function QueryProvider({ children }: IQueryProviderProps) {
  const queryClient = getQueryClient()

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
