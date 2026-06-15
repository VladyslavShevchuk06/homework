import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FavoritesModule } from '@/app/modules/favorites'
import { auth } from '@/lib/auth'

// resolves the session from request headers — kept inside <Suspense> so Cache
// Components does not flag the cookie/header access as blocking, uncached data
async function FavoritesContent() {
  // session must be read from the incoming request headers, otherwise the
  // session cookie is invisible and every visitor is treated as logged out
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/login')
  }

  return <FavoritesModule />
}

// page — /favorites (auth-gated, per-user; not cacheable)
export default function FavoritesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <FavoritesContent />
      </Suspense>
    </main>
  )
}
