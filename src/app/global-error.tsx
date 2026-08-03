'use client'

import { useEffect, type FC } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { ErrorModule } from '@/app/modules/error'
import messages from '../../translations/en.json'
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
        {/* this boundary replaces the root layout, so the [locale] provider is not above it */}
        <NextIntlClientProvider locale="en" messages={messages}>
          <main className="container mx-auto px-4 py-8">
            <ErrorModule error={error} reset={() => (window.location.href = '/')} />
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default GlobalError
