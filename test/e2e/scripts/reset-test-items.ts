import { assertTestDb } from '../utils/guard'
import { sql, closeDb } from '../utils/db'

// clear items before migrate so NOT NULL columns apply cleanly (test DB only)
async function run() {
  assertTestDb()

  try {
    await sql`delete from items`
    console.log('🧹 Cleared test items')
  } finally {
    await closeDb()
  }
}

run().catch((error) => {
  console.error('❌ Reset failed:', error)
  process.exit(1)
})
