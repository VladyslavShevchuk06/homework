import { type TSocialProvider } from '@/app/shared/interfaces/auth.interface'

export interface ISocialAuthProps {
  enabledProviders: TSocialProvider[]
  className?: string
}
