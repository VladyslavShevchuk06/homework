'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { authClient } from '@/pkg/auth'
import { Button } from '@/app/shared/components/ui'
import { cn } from '@/pkg/theme'

// interface
interface INavProps {
  className?: string
}

interface INavLink {
  href: string
  label: string
}

// component
export function Nav({ className }: INavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { data: session, isPending } = authClient.useSession()

  const user = session?.user

  // primary links shown in the bar; Favorites is gated behind auth
  const links: INavLink[] = [
    { href: '/items', label: 'Drivers' },
    ...(user ? [{ href: '/favorites', label: 'Favorites' }] : []),
  ]

  // a link is active when the pathname matches it or sits beneath it
  // (e.g. /items/max-verstappen still highlights "Drivers")
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const handleLogout = async () => {
    await authClient.signOut()
    // drop the previous user's cached data and clear the router cache so the nav
    // and any user-scoped queries reset without a manual browser refresh
    queryClient.clear()
    router.push('/login')
    router.refresh()
  }

  // return
  return (
    <nav className={cn('border-b border-slate-200 bg-white', className)}>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/items" className="text-xl font-bold text-slate-900">
            F1 Catalog
          </Link>

          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive(link.href) ? 'font-semibold text-blue-600' : 'text-slate-600 hover:text-slate-900',
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-2">
              {!isPending &&
                (user ? (
                  <>
                    <span className="hidden text-sm text-slate-600 sm:inline">{user.email}</span>
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
                ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
