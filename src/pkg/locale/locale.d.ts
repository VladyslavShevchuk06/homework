import type messages from '../../../translations/en.json'
import type { routing } from './routing'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
