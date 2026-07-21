import { Suspense } from 'react'
import { type NextPage } from 'next'
import { headers } from 'next/headers'
import { type Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/pkg/query'
import { favoritesListServerQueryOptions } from '@/app/entities/api/favorites/index.server'
import { auth } from '@/lib/auth'
import { redirect } from '@/pkg/locale'
import { FavoritesModule } from '@/app/modules/favorites'

async function FavoritesContent({ locale }: Readonly<{ locale: Locale }>) {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (!user) {
    redirect({ href: '/login', locale })
    return null
  }

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(favoritesListServerQueryOptions(user.id, locale))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FavoritesModule locale={locale} />
    </HydrationBoundary>
  )
}

interface IProps {
  params: Promise<{ locale: Locale }>
}

// page
const FavoritesPage: NextPage<Readonly<IProps>> = async (props) => {
  const { locale } = await props.params
  setRequestLocale(locale)

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={null}>
        <FavoritesContent locale={locale} />
      </Suspense>
    </main>
  )
}

export default FavoritesPage
