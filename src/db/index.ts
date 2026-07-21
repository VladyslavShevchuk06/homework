import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { envServer } from '@/config/env'

// postgres client
const client = postgres(envServer.DATABASE_URL, { prepare: false })

export const db = drizzle(client, { schema })
