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
- **Domain tables**: `teams`, `items` and `favorites`.
  - `teams` — uuid PK `defaultRandom()`, unique `slug`, localized name pair `nameEn`/`nameUk`.
    The `slug` is the stable, locale-independent handle the catalog filters by (`?team=ferrari`).
  - `items` — uuid PK `defaultRandom()`, unique `slug`, localized column pairs
    `titleEn`/`titleUk`, `countryEn`/`countryUk`, `descriptionEn`/`descriptionUk`, a numeric
    `number` (`integer`, so it can be sorted and compared), plus `teamId` — a **not-null FK to
    `teams.id` with `onDelete: 'restrict'`**, so a team in use cannot be deleted out from under its
    drivers. Indexes: `items_created_at_idx`, `items_team_id_idx`.
  - `favorites` — FKs to `user.id` and `items.id` with `onDelete: 'cascade'`, a
    `uniqueIndex('user_item_unique')` enforcing one row per user+item, and an index per FK.

`schema.ts` also declares `itemsRelations` (`items.team` → `one(teams)`). It exists because
`getItemDetail` reads the driver and its team through `db.query.items.findFirst({ with: { team: true } })`;
the list query still uses an explicit `innerJoin`, because it needs the `favoritesCount` aggregate
and pagination. Adding the reverse `many(items)` side would be unused, so it is deliberately absent.

The localized column pairs are why reads are locale-aware rather than translation-joined — see
[[data-flow]].

## Migrations — generated, never hand-edited

`drizzle/` holds the SQL plus `meta/*_snapshot.json` and `meta/_journal.json`. Five migrations
exist today (`0000_clammy_princess_powerful.sql` … `0004_bored_slayback.sql`).

| Command | Use |
|---|---|
| `yarn db:generate` | diff `schema.ts` against the last snapshot, emit SQL + snapshot |
| `yarn db:migrate` | apply pending migrations via `src/db/migrate.ts` (tracked, reproducible) |
| `yarn db:push` | push the schema straight to the DB with no migration file — local throwaway iteration only |
| `yarn db:studio` | inspect |

Fix a wrong migration by editing `schema.ts` and regenerating, never by patching the SQL.

### The one thing generation cannot do: move data

That rule is about *correcting* a migration. It does not cover **data backfill**, which
`drizzle-kit` cannot express at all — it diffs schemas, so a column it did not previously know
about is created empty. When a change has to carry existing rows across, the generated SQL is the
starting point and the data statements are added by hand.

`0003_luxuriant_the_phantom.sql` and `0004_bored_slayback.sql` are the worked example — extracting
`teams` out of the old `items.team_en`/`team_uk` text columns:

- **`0003` (additive, hand-extended).** Generated: create `teams`, add nullable `items.team_id`,
  add the FK and index. Added by hand between them: an `INSERT INTO teams … SELECT DISTINCT ON
  ("team_en") … FROM items` that mints one team per distinct name (slug via
  `regexp_replace` + `trim`, matching `slugify`), then an `UPDATE items SET team_id = teams.id FROM
  teams WHERE teams.name_en = items.team_en`.
- **`0004` (destructive).** Set `team_id NOT NULL`, drop `team_en`/`team_uk`, retype `number`.
  The generated `ALTER COLUMN "number" SET DATA TYPE integer` was hand-extended with
  `USING "number"::integer` — Postgres refuses a text→integer cast without it.

Two constraints this shape exists to satisfy:

- **Split additive and destructive across two migrations.** `drizzle-kit generate` cannot emit a
  drop and an add for the same table non-interactively — it stops to ask whether you meant a
  rename, which fails outside a TTY. Two passes sidestep the prompt *and* give the backfill a
  migration to live in where both the old and new columns still exist.
- **Check the data before running the destructive half.** `USING "number"::integer` fails on any
  non-numeric row. Run `select number from items where number !~ '^[0-9]+$'` first; a non-empty
  result means the migration will abort (inside its transaction, so nothing is lost — but the
  deploy stops).

One deployment consequence worth stating plainly: from the moment `0004` runs, code that still
selects `items.team_en` errors. Migrate and deploy together, or accept a short window of 500s on
the catalog routes.

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

`yarn seed` runs `src/db/seed.ts`: clears `items` **then** `teams` (that order is forced by the
`onDelete: 'restrict'` FK), inserts the 11 constructors, builds a `name → id` map from the returned
ids, and inserts 22 F1 drivers against it, de-duplicating colliding slugs. A driver naming a team
that is not in the constructors list throws rather than inserting a dangling row.
`src/app/shared/utils/slug.util.ts` generates both driver and team slugs (NFKD strips accents, so
"Sergio Pérez" → `sergio-perez`).

Never run this against production: it deletes every item, and `favorites` cascade with them.

## Note

`src/db/` sits outside the `src/app/` layer tree. Its target home is `shared/systems/db/` (and
`favorites-count.ts` belongs in the owning entity's service, since it is a query, not
infrastructure) — recorded in `.claude/skills/client-structure/`. Moving it also touches
`drizzle.config.ts` and the `db:*` / `seed` scripts, so it has not been done yet.
