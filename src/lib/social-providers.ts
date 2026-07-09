import 'server-only'
import { envServer } from '@/config/env'
import { type TSocialProvider } from '@/app/shared/interfaces'

export const socialProviderConfig = {
  ...(envServer.GITHUB_CLIENT_ID && envServer.GITHUB_CLIENT_SECRET
    ? { github: { clientId: envServer.GITHUB_CLIENT_ID, clientSecret: envServer.GITHUB_CLIENT_SECRET } }
    : {}),
  ...(envServer.GOOGLE_CLIENT_ID && envServer.GOOGLE_CLIENT_SECRET
    ? { google: { clientId: envServer.GOOGLE_CLIENT_ID, clientSecret: envServer.GOOGLE_CLIENT_SECRET } }
    : {}),
}

export const enabledSocialProviders = Object.keys(socialProviderConfig) as TSocialProvider[]
