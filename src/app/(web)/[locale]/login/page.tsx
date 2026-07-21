import { type NextPage } from 'next'
import { type Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { enabledSocialProviders } from '@/lib/social-providers'
import { LoginModule } from '@/app/modules/login'

interface IProps {
  params: Promise<{ locale: Locale }>
}

// page
const LoginPage: NextPage<Readonly<IProps>> = async (props) => {
  const { locale } = await props.params
  setRequestLocale(locale)

  return <LoginModule enabledProviders={enabledSocialProviders} />
}

export default LoginPage
