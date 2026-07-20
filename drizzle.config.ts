// drizzle-kit runs as a standalone CLI (not the Next.js runtime) and does NOT
// auto-load .env.local, so load it explicitly before reading process.env below.
// Must come before `defineConfig` so DATABASE_URL is populated when it's read.
import { config } from 'dotenv'
config({ path: process.env.DRIZZLE_ENV_FILE ?? '.env.local' })

import { defineConfig } from 'drizzle-kit'

// NOTE: the one intentional `process.env` read outside `envServer`. drizzle.config
// runs in the drizzle-kit CLI, not the Next.js runtime, so the `@t3-oss/env-nextjs`
// validator is not used here: importing `envServer` would force validation of
// auth-only vars the CLI never needs. App runtime code must use `envServer`.
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
})