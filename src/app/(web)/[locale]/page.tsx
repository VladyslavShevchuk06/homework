import { type Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { redirect } from '@/pkg/locale'

interface IProps {
  params: Promise<{ locale: Locale }>
}

async function Home(props: Readonly<IProps>) {
  const { locale } = await props.params
  setRequestLocale(locale)
  redirect({ href: '/items', locale })
}

export default Home
