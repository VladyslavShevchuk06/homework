import { type NextPage } from 'next'
import { type Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { redirect } from '@/pkg/locale'

interface IProps {
  params: Promise<{ locale: Locale }>
}

// page
const Home: NextPage<Readonly<IProps>> = async (props) => {
  const { locale } = await props.params
  setRequestLocale(locale)
  return redirect({ href: '/items', locale })
}

export default Home
