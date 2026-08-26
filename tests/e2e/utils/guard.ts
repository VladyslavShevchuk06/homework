export function assertTestDb() {
  const url = process.env.DATABASE_URL ?? ''
  const expected = process.env.E2E_EXPECTED_DB_REF ?? 'swmjawpiungvjkhghxrz'

  if (!url.includes(expected)) {
    throw new Error(
      `E2E aborted: DATABASE_URL is not the dedicated test project (expected to contain "${expected}"). Refusing to run destructive scripts against a non-test database.`,
    )
  }
}
