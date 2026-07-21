'use client'

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

const SUPPRESSED_MESSAGE = 'Encountered a script tag while rendering React component'

if (typeof window !== 'undefined') {
  const originalError = console.error
  console.error = (...args: unknown[]) => {
    if (args.some((arg) => typeof arg === 'string' && arg.includes(SUPPRESSED_MESSAGE))) {
      return
    }
    originalError(...(args as Parameters<typeof console.error>))
  }
}

// provider
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
