import { Suspense } from 'react'
import { type NextPage } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getFavoritesList } from '@/app/entities/api/favorites/favorites.service'
import { auth } from '@/app/shared/lib/auth'
import { FavoritesModule } from '@/app/modules/favorites'

// content
async function FavoritesContent() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/login')
  }

  const favorites = await getFavoritesList(session.user.id)

  return <FavoritesModule favorites={favorites} />
}

// page
const FavoritesPage: NextPage = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <FavoritesContent />
      </Suspense>
    </main>
  )
}

export default FavoritesPage
