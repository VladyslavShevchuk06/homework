# Database and migrations

Postgres, reached only through **Drizzle ORM**. The instance is hosted on Supabase, but Supabase is
infrastructure here: `supabase-js` is **not** used for data access and must not be added for it.
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` exist in the env schema, but the
data path is Drizzle over `DATABASE_URL`.

## The client — `src/db/index.ts`

```ts
const client = postgres(envServer.DATABASE_URL, { prepare: false })
export const db = drizzle(client, { schema })
```

`prepare: false` is required when connecting through a connection pooler (Supabase's pooler does not
support prepared statements). `DATABASE_URL` comes from `envServer`, never raw `process.env`.

## Schema — `src/db/schema.ts`

Two groups of tables:

- **Better Auth's four**: `user`, `session`, `account`, `verification`. Their JS keys must stay
  aligned with Better Auth's own field names — they are passed wholesale into `drizzleAdapter`, so a
  rename breaks auth silently. Do not hand-edit them; auth-related columns belong in Better Auth
  config. See [[auth]].
- **Domain tables**: `items` (uuid PK `defaultRandom()`, unique `slug`, localized column pairs
  `titleEn`/`titleUk`, `teamEn`/`teamUk`, `countryEn`/`countryUk`, `descriptionEn`/`descriptionUk`,
  plus `index('items_created_at_idx')`) and `favorites` (FKs to `user.id` and `items.id` with
  `onDelete: 'cascade'`, a `uniqueIndex('user_item_unique')` enforcing one row per user+item, and an
  index per FK).

The localized column pairs are why reads are locale-aware rather than translation-joined — see
[[data-flow]].

## Migrations — generated, never hand-edited

`drizzle/` holds the SQL plus `meta/*_snapshot.json` and `meta/_journal.json`. Three migrations
exist today (`0000_clammy_princess_powerful.sql` … `0002_tan_fantastic_four.sql`).

| Command | Use |
|---|---|
| `yarn db:generate` | diff `schema.ts` against the last snapshot, emit SQL + snapshot |
| `yarn db:migrate` | apply pending migrations via `src/db/migrate.ts` (tracked, reproducible) |
| `yarn db:push` | push the schema straight to the DB with no migration file — local throwaway iteration only |
| `yarn db:studio` | inspect |

Fix a wrong migration by editing `schema.ts` and regenerating, never by patching the SQL.

## `drizzle.config.ts` — the one deliberate `process.env`

Drizzle Kit runs as a standalone CLI, not in the Next.js runtime, so it neither auto-loads
`.env.local` nor should it import `envServer` (that would force validation of auth-only vars the CLI
never needs). The config therefore loads dotenv explicitly and reads `process.env.DATABASE_URL`
directly. The file is commented to say so. `DRIZZLE_ENV_FILE` overrides which env file is loaded —
that is how the test database is targeted; see [[testing]].

App runtime code has no such exemption: `envServer` only.

## Aggregates

`src/db/favorites-count.ts` exports a `db.$count(...)` correlated sub-select, embedded into
projections so a list carries per-row counts in one query. For a filtered total, use
`db.select({ value: count() })` with the same `where`, not `data.length`.

## Seeding

`yarn seed` runs `src/db/seed.ts`: clears `items`, then inserts 22 F1 drivers, de-duplicating
colliding slugs. `src/app/shared/utils/slug.util.ts` generates the slugs (NFKD strips accents, so
"Sergio Pérez" → `sergio-perez`).

## Note

`src/db/` sits outside the `src/app/` layer tree. Its target home is `shared/systems/db/` (and
`favorites-count.ts` belongs in the owning entity's service, since it is a query, not
infrastructure) — recorded in `.claude/skills/client-structure/`. Moving it also touches
`drizzle.config.ts` and the `db:*` / `seed` scripts, so it has not been done yet.
