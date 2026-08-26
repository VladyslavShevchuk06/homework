import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL ?? ''

export const sql = postgres(connectionString, { prepare: false })

export async function deleteFreshUsers() {
  await sql`delete from "user" where email like 'e2e-w%@example.com'`
}

export async function closeDb() {
  await sql.end()
}
