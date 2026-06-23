# Data layer (Drizzle + Postgres)

The only persistence path is **Drizzle ORM over a Postgres connection**. The `db` client and the table schema live under `src/db/` (`@/db`, `@/db/schema`). There is no `supabase-js` client and none should be added for data access.

## Persistence contract

- All data fetching and mutation runs **server-side**, inside `(api)` route handlers (`src/app/(api)/api/<route>/route.ts`). The client never talks to the database directly — it calls these handlers through the `entities/api/<api>/<api>.api.ts` fetchers.
- Handlers import `db` from `@/db` and tables from `@/db/schema`, build the query with Drizzle's query builder, and return `NextResponse.json(...)`.
- `supabase-js` is **prohibited for data fetching**. Supabase (if present at all) is infrastructure for the Postgres instance only; the application reads and writes through Drizzle, not the Supabase client SDK.

## Aggregations with `db.$count`

Counting related rows is done with a Drizzle correlated sub-select via `db.$count(...)`, never by fetching rows into the app and measuring array length. The shared expression lives in `src/db/favorites-count.ts`:

```ts
// correlated sub-select: how many favorites rows reference each item
export const favoritesCount = db.$count(favorites, eq(favorites.itemId, items.id))
```

Embed it in any query that has the parent table in scope, alongside the table columns:

```ts
db.select({ ...getTableColumns(items), favoritesCount })
  .from(items)
  .where(filter)
```

This keeps the count in a single round trip and avoids the N+1 pattern of loading a list and then querying a count per row. For a total-rows count over a filtered set, use Drizzle's `count()` aggregate in a separate `select({ value: count() })` rather than `data.length`.

## Filters

Compose `where` clauses from Drizzle helpers (`and`, `or`, `ilike`, `eq`, `desc`). `and()` drops `undefined` parts, so an optional filter is expressed as `condition ? expr : undefined` and combined freely — the same builder handles the search-only, filter-only, combined, and no-filter cases without branching.

## Schema and seeding

- The schema (tables, indexes, relations, Better Auth tables) lives in `src/db/schema.ts`.
- Schema changes flow through Drizzle Kit: `yarn db:generate` → `yarn db:push` / `yarn db:migrate`; inspect with `yarn db:studio`.
- `yarn seed` runs `src/db/seed.ts` to populate the database.
