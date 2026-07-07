import { type NextPage } from 'next'
import { type Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { LoginModule } from '@/app/modules/login'

interface IProps {
  params: Promise<{ locale: Locale }>
}

const LoginPage: NextPage<Readonly<IProps>> = async (props) => {
  const { locale } = await props.params
  setRequestLocale(locale)

  return <LoginModule />
}

export default LoginPage
