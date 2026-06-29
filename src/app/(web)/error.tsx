'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/app/shared/components/ui'

interface IErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: IErrorBoundaryProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
        <p className="max-w-md text-slate-600">
          An unexpected error occurred while loading this page. You can try again or head back to the drivers list.
        </p>
        {error.digest && <p className="text-sm text-slate-400">Reference: {error.digest}</p>}
        <div className="mt-2 flex items-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Link href="/items" className="text-blue-600 hover:text-blue-700">
            Back to drivers
          </Link>
        </div>
      </div>
    </main>
  )
}
