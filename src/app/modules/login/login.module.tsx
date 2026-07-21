'use client'

import { type FC } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/pkg/locale'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { buildLoginSchema, TLoginInput } from '@/app/shared/validation'
import { authClient } from '@/pkg/auth'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/app/shared/components/ui'
import { EEntityKey, type TSocialProvider } from '@/app/shared/interfaces'
import { SocialAuth } from '@/app/features/social-auth'

// module
const LoginModule: FC<Readonly<{ enabledProviders: TSocialProvider[] }>> = (props) => {
  const { enabledProviders } = props
  const t = useTranslations('Auth')
  const tv = useTranslations('Validation')
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TLoginInput>({
    resolver: zodResolver(buildLoginSchema({ email: tv('email'), password: tv('password') })),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: TLoginInput) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            // refresh session-scoped state
            queryClient.invalidateQueries({ queryKey: [EEntityKey.QUERY_FAVORITES_LIST] })
            router.push('/items')
            router.refresh()
          },
          onError: (error) => {
            // form-level error
            setError('root', { message: error.error.message || t('signInFailed') })
          },
        },
      )
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : t('signInError'),
      })
    }
  }

  // return
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('signIn')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div
                role="alert"
                className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
              >
                {errors.root.message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                {...register('email')}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                {...register('password')}
                disabled={isSubmitting}
              />
              {errors.password && <p className="text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('signInLoading') : t('signIn')}
            </Button>
          </form>

          <SocialAuth enabledProviders={enabledProviders} className="mt-6" />

          <div className="mt-4 text-center text-sm">
            {t('noAccount')}{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('register')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginModule
