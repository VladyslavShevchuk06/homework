# Recipe — add an end-to-end feature (DB → API → UI)

The ordered procedure for adding **one** new domain feature/entity. Build **data-first**: each layer imports the one below it, so create them bottom-up. Placeholders match `client-structure`: `<entity>` (singular domain noun), `<api>`/`<route>`/`<module>` (kebab-case slice names), `I<Name>` interfaces, `E<Name>` enums.

This file owns the **sequence and the cross-boundary reasoning**. It does not own file placement or shape — for "where does this file go / what does it look like" defer to `client-structure` (`references/structure.md`, `references/data-layer.md`, `references/state-management.md`, `references/auth.md`).

Run `yarn` for every script (this project's package manager). Finish with `yarn format` before declaring done.

---

## Step 1 — Add the table to `src/db/schema.ts`

Append a `pgTable` for the new entity. Conventions used by the existing domain tables:

- **PK**: `uuid('id').primaryKey().defaultRandom()` for domain tables (Better Auth tables use `text` ids — leave those alone).
- **FKs**: `.references(() => <owner>.id, { onDelete: 'cascade' })`. A user-owned row references `user.id`; a child row references its parent's `id`. Match the FK column's type to the referenced PK (`text` user id vs `uuid` domain id).
- **Indexes**: add an `index(...)` on any column you order by or filter on; a `uniqueIndex(...)` for natural keys or "one row per (user, thing)" constraints.
- **Timestamps**: `timestamp('created_at', { withTimezone: true }).defaultNow().notNull()`.

Do **not** touch the Better Auth tables (`user`, `session`, `account`, `verification`) — their JS keys must stay aligned with Better Auth field names (see the comment at the top of the file). A new auth-related column belongs in Better Auth config, not a manual schema edit.

> Worked example: `items` (uuid PK, unique `slug`, `items_created_at_idx`) and `favorites` (FKs to `user` + `items`, `user_item_unique` plus per-FK indexes).

## Step 2 — Generate and apply the migration

Migrations live in `drizzle/` and are a **generated artifact** — never hand-edit them.

1. `yarn db:generate` — diffs `schema.ts` against the last snapshot and writes a new SQL migration + snapshot.
2. `yarn db:migrate` — applies pending migrations through Drizzle's migration table (use this when you want a tracked, reproducible history — e.g. shared/staging DBs).

**generate vs push vs migrate:**
- `db:generate` + `db:migrate` — the durable path; emits versioned SQL you commit. Use for anything that ships.
- `db:push` — pushes the schema straight to the DB with no migration file. Fast for throwaway local iteration on a schema you're still shaping; do not rely on it for shared environments.
- If you edited the schema wrongly, fix `schema.ts` and regenerate — do not patch the SQL by hand.

## Step 3 — Extend the seed (`src/db/seed.ts`)

Add demo rows for the new table so `yarn seed` produces a usable dataset.

- Respect every constraint you declared in step 1: if the table has a `uniqueIndex`, de-duplicate before insert (the existing seed appends `-2`, `-3`… to colliding slugs).
- If the seed clears tables before inserting, order deletes so FK `onDelete: 'cascade'` does the right thing (children clear with their parent).
- Run `yarn seed` and confirm the rows land.

## Step 4 — Entity model types (`src/app/entities/models/<entity>.model.ts`)

Declare the TypeScript shapes the api slice and UI will consume: `I<Entity>` (the row as the client sees it, including any derived field such as a `favoritesCount`), plus `I<Entity>ListParams` / `I<Entity>ListResponse` / request-body interfaces as needed. Re-export from the models barrel. Types only — no runtime code. Shape and placement: `client-structure/examples/app/entities/models/` and `references/structure.md`.

## Step 5 — Register the query key (`src/app/shared/interfaces/entities.interface.ts`)

Add a new member (or members) to the `EEntityKey` enum — this enum is the **single source of truth** for TanStack Query cache keys. A list and a detail view typically each get their own key (e.g. `<ENTITY>_LIST`, `<ENTITY>_DETAIL`). Never inline a raw string key elsewhere; the api slice (step 6) and any cross-cache invalidation reference these members.

## Step 6 — Entity api slice (`src/app/entities/api/<api>/`)

Three files plus a barrel — full shapes in `client-structure/examples/app/entities/api/__api__/` and `client-structure/references/state-management.md`:

- **`<api>.api.ts`** — raw `fetch` wrappers hitting `/api/<route>`. No `'use client'` (these run on the server too, for prefetch).
- **`<api>.query.ts`** — `queryOptions(...)` factories whose `queryKey` starts with the `EEntityKey.*` value from step 5. For paginated lists set `placeholderData: keepPreviousData` so the previous page stays visible while the next loads. No `'use client'`.
- **`<api>.mutation.ts`** — `'use client'`; `useMutation` hooks. For optimistic updates: `onMutate` cancels in-flight queries and snapshots the cache, `onError` restores the snapshot, `onSettled` invalidates the affected `EEntityKey` lists so the server truth re-syncs.

Because `<api>.api.ts` and `<api>.query.ts` stay server-composable, the page in step 8 can prefetch them.

## Step 7 — Route handler (`src/app/(api)/api/<route>/route.ts`)

Export the HTTP verbs the slice calls (`GET`, `POST`, `DELETE`, …). Rules:

- **Data access through Drizzle only** — `db.select(...)` / `db.insert(...)` / `db.delete(...)` against the schema tables. Never the supabase-js client.
- **Aggregates use `db.$count(...)`** — embed the correlated sub-select (as in `src/db/favorites-count.ts`) into the `select({...})` rather than counting a fetched array. Paginated totals use `db.select({ value: count() })` with the same filter.
- **User-scoped verbs gate with the session** — `const session = await auth.api.getSession({ headers: request.headers })`; return `401` when `!session?.user`, and scope the query to `session.user.id`. Read-only public lists need no session.
- Validate/normalise query params and request bodies; wrap in try/catch and return JSON error bodies with proper status codes.

Handler dependency direction and placement: `client-structure/references/structure.md` + `references/data-layer.md` + `references/auth.md`.

## Step 8 — Module + thin page

- **Module** (`src/app/modules/<module>/`): the `'use client'` entry component (`<module>.module.tsx`) that calls the query options / mutation hooks from step 6 and composes widgets/features. Shape: `client-structure/examples/app/modules/__module__/`.
- **Page** (`src/app/(web)/<route>/page.tsx`): keep it thin. Read `params`/`searchParams`, get the server query client, `await queryClient.prefetchQuery(<entity>ListQueryOptions(...))`, then render the module inside `<HydrationBoundary state={dehydrate(queryClient)}>`. The page stays an RSC; only the module carries `'use client'`. Shape: `client-structure/examples/app/(web)/`.

## Step 9 — Gating (`src/proxy.ts`)

If the new page is private (auth-only) or guest-only, add its path to the matcher and the redirect logic in `src/proxy.ts` — all page gating lives in this one file. The `(api)` route enforces its own auth in the handler (step 7), so adding the API path to the proxy matcher is optional and never a substitute for the in-handler `getSession` check. Detail: `client-structure/references/auth.md`.

---

## Order recap

`schema.ts` → `db:generate` + `db:migrate` → `seed.ts` → `<entity>.model.ts` → `EEntityKey` → `entities/api/<api>/` → `(api)/api/<route>/route.ts` → `modules/<module>/` + `(web)/<route>/page.tsx` → `proxy.ts`. Then `yarn format`.
