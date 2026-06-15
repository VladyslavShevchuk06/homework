import { QueryClient } from '@tanstack/react-query'

// create query client singleton
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      },
    },
  })
}

let clientSingleton: QueryClient | undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  }

  // Browser: use singleton pattern to keep the same client
  if (!clientSingleton) clientSingleton = makeQueryClient()
  return clientSingleton
}
