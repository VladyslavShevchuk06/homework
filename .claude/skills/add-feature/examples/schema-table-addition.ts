// Connective snippet: a new domain table appended to src/db/schema.ts.
// This is the DB-shape step of add-feature. For full schema/Drizzle conventions
// see client-structure/references/data-layer.md. Replace every <entity> / <owner>.

import { pgTable, text, timestamp, uuid, index, uniqueIndex } from 'drizzle-orm/pg-core'
// `user` (and any owning domain table) imported from this same schema file:
// import { user } from './schema'  // already in scope when appended in-file

// <entity> table — domain row with a uuid PK
export const <entity>s = pgTable(
  '<entity>s',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // a user-owned row references the Better Auth `user` table (text id, cascade)
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    // a child row references its parent domain table (uuid id, cascade)
    // <owner>Id: uuid('<owner>_id').notNull().references(() => <owner>s.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // index columns you order/filter by
    index('<entity>s_created_at_idx').on(table.createdAt),
    // uniqueIndex for "one row per (user, thing)" style constraints
    uniqueIndex('<entity>s_user_unique').on(table.userId),
  ],
)

// Worked reference (real tables in this repo): `items` = uuid PK + unique `slug`
// + `items_created_at_idx`; `favorites` = FKs to `user` and `items` +
// `user_item_unique` + per-FK indexes. Do NOT edit Better Auth tables
// (user/session/account/verification) — their JS keys are Better-Auth-owned.

// Next: `yarn db:generate` then `yarn db:migrate` (migrations/ is generated — never hand-edit).
