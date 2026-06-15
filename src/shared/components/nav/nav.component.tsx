'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/pkg/auth'
import { Button } from '@/components/ui'
import { cn } from '@/pkg/theme'

interface INavProps {
  className?: string
}

export function Nav({ className }: INavProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const session = await authClient.getSession()
      setUser(session.data?.user || null)
      setLoading(false)
    }
    checkSession()
  }, [])

  const handleLogout = async () => {
    await authClient.signOut()
    setUser(null)
    router.push('/login')
  }

  return (
    <nav className={cn('border-b border-slate-200 bg-white', className)}>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/items" className="text-xl font-bold text-slate-900">
            F1 Catalog
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/items" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Drivers
            </Link>
            {user && (
              <Link href="/favorites" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Favorites
              </Link>
            )}

            <div className="flex items-center gap-2">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <span className="text-sm text-slate-600">{user.email}</span>
                      <Button variant="outline" size="sm" onClick={handleLogout}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="outline" size="sm">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button size="sm">Register</Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
