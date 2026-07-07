import { type TSocialProvider } from '@/app/shared/interfaces'

export interface ISocialAuthProps {
  enabledProviders: TSocialProvider[]
  className?: string
}
