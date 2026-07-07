import { type NextPage } from 'next'
import { type Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { RegisterModule } from '@/app/modules/register'

interface IProps {
  params: Promise<{ locale: Locale }>
}

const RegisterPage: NextPage<Readonly<IProps>> = async (props) => {
  const { locale } = await props.params
  setRequestLocale(locale)

  return <RegisterModule />
}

export default RegisterPage
