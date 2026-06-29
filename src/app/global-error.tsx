'use client'

import { useEffect } from 'react'
import '@/config/styles/global.css'

interface IGlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: IGlobalErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-white text-slate-950 antialiased">
        <main className="container mx-auto px-4 py-8">
          <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
            <p className="max-w-md text-slate-600">
              A critical error occurred and the page could not be displayed. Please try again.
            </p>
            {error.digest && <p className="text-sm text-slate-400">Reference: {error.digest}</p>}
            <button
              onClick={reset}
              className="mt-2 inline-flex items-center justify-center rounded bg-slate-900 px-4 py-2 text-base font-medium text-white transition-colors hover:bg-slate-800"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
