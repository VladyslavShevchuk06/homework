import { Suspense } from 'react'
import { type NextPage } from 'next'
import { headers } from 'next/headers'
import { type Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { getFavoritesList } from '@/app/entities/api/favorites/favorites.service'
import { auth } from '@/app/shared/lib/auth'
import { redirect } from '@/pkg/locale'
import { FavoritesModule } from '@/app/modules/favorites'

async function FavoritesContent({ locale }: { locale: Locale }) {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (!user) {
    redirect({ href: '/login', locale })
    return null
  }

  const favorites = await getFavoritesList(user.id)

  return <FavoritesModule favorites={favorites} />
}

interface IProps {
  params: Promise<{ locale: Locale }>
}

const FavoritesPage: NextPage<Readonly<IProps>> = async (props) => {
  const { locale } = await props.params
  setRequestLocale(locale)

  return (
    <main className='container mx-auto px-4 py-8'>
      <Suspense fallback={<div className='flex justify-center p-4 text-slate-500 dark:text-slate-400'>Loading...</div>}>
        <FavoritesContent locale={locale} />
      </Suspense>
    </main>
  )
}

export default FavoritesPage
