import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const envClient = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_GROWTHBOOK_API_HOST: z.string().url().optional(),
    NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY: z.string().optional(),
    NEXT_PUBLIC_MIXPANEL_TOKEN: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GROWTHBOOK_API_HOST: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
    NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
    NEXT_PUBLIC_MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  },
})
