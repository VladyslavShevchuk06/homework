import { createAuthClient } from 'better-auth/react'
import { envConfig } from '@/config/env'

export const authClient = createAuthClient({
  baseURL: envConfig.NEXT_PUBLIC_APP_URL,
})
