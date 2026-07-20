import { deleteFreshUsers, closeDb } from '../utils/db'
import { assertTestDb } from '../utils/guard'

async function globalSetup() {
  assertTestDb()
  await deleteFreshUsers()
  await closeDb()
}

export default globalSetup
