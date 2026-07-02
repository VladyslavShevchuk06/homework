import { QueryClient } from '@tanstack/react-query'

// query client factory
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
      },
    },
  })
}

let clientSingleton: QueryClient | undefined

// get query client
export function getQueryClient() {
  // server: a fresh client per request
  if (typeof window === 'undefined') {
    return makeQueryClient()
  }

  // browser: reuse one singleton across renders
  if (!clientSingleton) clientSingleton = makeQueryClient()
  return clientSingleton
}
