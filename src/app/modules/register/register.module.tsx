'use client'

import { useState } from 'react'
import { Link, useRouter } from '@/pkg/locale'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { registerSchema, TRegisterInput } from '@/app/shared/validation'
import { authClient } from '@/pkg/auth'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/app/shared/components/ui'
import { SocialAuth } from '@/app/features/social-auth'

// module
export function RegisterModule() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: TRegisterInput) => {
    setIsLoading(true)
    setServerError(null)

    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
        },
        {
          onSuccess: () => {
            // drop stale query state and clear the router cache so the nav +
            // user-scoped data reflect the new session without a reload
            queryClient.invalidateQueries()
            router.push('/items')
            router.refresh()
          },
          onError: (error) => {
            setServerError(error.error.message || 'Failed to sign up')
          },
        },
      )
    } catch (error: any) {
      setServerError(error?.message || 'An error occurred during sign up')
    } finally {
      setIsLoading(false)
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
            {serverError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="John Doe" {...register('name')} disabled={isLoading} />
              {errors.name && <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <SocialAuth className="mt-6" />

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
