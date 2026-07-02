'use client'

import { useEffect, type FC } from 'react'
import { ErrorModule } from '@/app/modules/error'
import '@/config/styles/global.css'

// interface
interface IGlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

// error boundary
const GlobalError: FC<Readonly<IGlobalErrorProps>> = (props) => {
  const { error } = props

  useEffect(() => {
    console.error(error)
  }, [error])

  // return
  return (
    <html lang="en">
      <body className="bg-white text-slate-950 antialiased">
        <main className="container mx-auto px-4 py-8">
          <ErrorModule error={error} reset={() => (window.location.href = '/')} />
        </main>
      </body>
    </html>
  )
}

export default GlobalError
