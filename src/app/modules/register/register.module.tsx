'use client'

import { type FC } from 'react'
import { Link, useRouter } from '@/pkg/locale'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { registerSchema, TRegisterInput } from '@/app/shared/validation'
import { authClient } from '@/pkg/auth'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/app/shared/components/ui'
import { EEntityKey, type TSocialProvider } from '@/app/shared/interfaces'
import { SocialAuth } from '@/app/features/social-auth'

// module
const RegisterModule: FC<Readonly<{ enabledProviders: TSocialProvider[] }>> = (props) => {
  const { enabledProviders } = props
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: TRegisterInput) => {
    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
        },
        {
          onSuccess: () => {
            // refresh session-scoped state
            queryClient.invalidateQueries({ queryKey: [EEntityKey.QUERY_FAVORITES_LIST] })
            router.push('/items')
            router.refresh()
          },
          onError: (error) => {
            const message = error.error.message || 'Failed to sign up'
            // map email errors to field
            if (/email|exist/i.test(message)) {
              setError('email', { message })
            } else {
              setError('root', { message })
            }
          },
        },
      )
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'An error occurred during sign up',
      })
    }
  }

  // return
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
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
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="John Doe" {...register('name')} disabled={isSubmitting} />
              {errors.name && (
                <p data-testid="name-error" className="text-sm text-red-600 dark:text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p data-testid="email-error" className="text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p data-testid="password-error" className="text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p data-testid="confirmPassword-error" className="text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <SocialAuth enabledProviders={enabledProviders} className="mt-6" />

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterModule
