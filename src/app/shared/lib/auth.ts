import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { envServer } from '@/config/env'

// auth
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    github: {
      clientId: envServer.GITHUB_CLIENT_ID ?? '',
      clientSecret: envServer.GITHUB_CLIENT_SECRET ?? '',
    },
    google: {
      clientId: envServer.GOOGLE_CLIENT_ID ?? '',
      clientSecret: envServer.GOOGLE_CLIENT_SECRET ?? '',
    },
  },
  secret: envServer.BETTER_AUTH_SECRET,
  baseURL: envServer.BETTER_AUTH_URL,
  basePath: '/api/auth',
})
