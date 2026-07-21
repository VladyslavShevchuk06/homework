import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

// programmatic migrator — prepare:false so it works over the Supabase transaction pooler
async function run() {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }

  const client = postgres(url, { prepare: false, max: 1 })

  try {
    await migrate(drizzle(client), { migrationsFolder: 'drizzle' })
    console.log('✅ Migrations applied')
  } finally {
    await client.end()
  }
}

run().catch((error) => {
  console.error('❌ Migration failed:', error)
  process.exit(1)
})
