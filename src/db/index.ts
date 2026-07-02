import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { envServer } from '@/config/env'

// envServer guarantees DATABASE_URL is present and a valid URL (validated on load)
const client = postgres(envServer.DATABASE_URL)

export const db = drizzle(client, { schema })
