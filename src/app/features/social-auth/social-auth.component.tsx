'use client'

import { type ReactNode, useState } from 'react'
import { useLocale } from 'next-intl'
import { Button } from '@/app/shared/components/ui'
import { type TSocialProvider } from '@/app/shared/interfaces'
import { authClient } from '@/pkg/auth'
import { getPathname } from '@/pkg/locale'
import { cn } from '@/pkg/theme'
import { ISocialAuthProps } from './social-auth.interface'

interface IProviderMeta {
  key: TSocialProvider
  label: string
  icon: ReactNode
}

const PROVIDERS: IProviderMeta[] = [
  {
    key: 'github',
    label: 'GitHub',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
      </svg>
    ),
  },
  {
    key: 'google',
    label: 'Google',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09A12 12 0 0 0 12 24Z"
        />
        <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.27a12 12 0 0 0 0 10.76l4-3.09Z" />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
        />
      </svg>
    ),
  },
]

export function SocialAuth({ enabledProviders, className }: ISocialAuthProps) {
  const locale = useLocale()
  const [loadingProvider, setLoadingProvider] = useState<TSocialProvider | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const providers = PROVIDERS.filter((provider) => enabledProviders.includes(provider.key))

  if (providers.length === 0) {
    return null
  }

  const isLoading = loadingProvider !== null

  const handleSignIn = async (provider: TSocialProvider) => {
    setLoadingProvider(provider)
    setServerError(null)

    await authClient.signIn.social(
      { provider, callbackURL: getPathname({ href: '/items', locale }) },
      {
        onError: ({ error }) => {
          setServerError(error.message || 'Failed to sign in')
          setLoadingProvider(null)
        },
      },
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Or continue with</span>
        </div>
      </div>

      {serverError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {serverError}
        </div>
      )}

      <div className="grid gap-2">
        {providers.map((provider) => (
          <Button
            key={provider.key}
            type="button"
            variant="outline"
            className="w-full gap-2"
            disabled={isLoading}
            onClick={() => handleSignIn(provider.key)}
          >
            {provider.icon}
            {loadingProvider === provider.key ? 'Redirecting...' : `Sign in with ${provider.label}`}
          </Button>
        ))}
      </div>
    </div>
  )
}
