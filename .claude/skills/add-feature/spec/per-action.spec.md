# Per-action verification

Self-contained checks for the one action this skill performs. Each item is a `MUST` / `MUST NOT` with a `Check:` hint (grep pattern or visual cue). These cover **cross-boundary wiring only** — global structural invariants (barrels, import direction, naming/suffixes, env, layer purity) are verified separately against `client-structure/spec/invariants.spec.md`.

## `+feature` — new end-to-end domain feature (DB → API → UI)

### DB layer

- MUST add the new table as a `pgTable` in `src/db/schema.ts`, with a `uuid(...).primaryKey().defaultRandom()` PK for domain rows.
  - Check: `grep -n "pgTable" src/db/schema.ts` lists the new table; PK line uses `defaultRandom()`.
- MUST declare FKs with cascade where the row is owned. MUST NOT edit the Better Auth tables (`user`, `session`, `account`, `verification`).
  - Check: `grep -n "references(() =>" src/db/schema.ts` shows `{ onDelete: 'cascade' }`; diff touches only the new table.
- MUST add an index for any column the route handler orders by or filters on; a `uniqueIndex` for natural/uniqueness keys.
  - Check: `grep -nE "index\(|uniqueIndex\(" src/db/schema.ts`.
- MUST generate a migration and NOT hand-edit it.
  - Check: `git status drizzle/` shows a new generated `.sql` + snapshot; no manual edits to existing migration files.
- MUST seed demo rows for the new table.
  - Check: `grep -n "<entity>" src/db/seed.ts` (the new table is inserted); `yarn seed` succeeds.

### Types + query key

- MUST add `src/app/entities/models/<entity>.model.ts` (types only) and re-export it from the models barrel.
  - Check: file exists; `grep -n "<Entity>" src/app/entities/models/index.ts`.
- MUST add a new `EEntityKey.*` member per view; MUST NOT inline a raw string cache key anywhere.
  - Check: `grep -n "<ENTITY>" src/app/shared/interfaces/entities.interface.ts`; `grep -rn "queryKey: \['" src/app/entities/api/<api>` returns nothing (keys come from `EEntityKey`).

### Api slice

- MUST create `src/app/entities/api/<api>/` with `<api>.api.ts`, `<api>.query.ts`, `<api>.mutation.ts`, `index.ts`.
  - Check: `ls src/app/entities/api/<api>/`.
- `<api>.query.ts` MUST key off `EEntityKey` and MUST use `placeholderData: keepPreviousData` for paginated lists. MUST NOT declare `'use client'`.
  - Check: `grep -n "EEntityKey" src/app/entities/api/<api>/<api>.query.ts`; `grep -n "keepPreviousData"` present; `grep -n "use client"` absent.
- `<api>.mutation.ts` MUST declare `'use client'` and MUST invalidate the affected `EEntityKey` list(s) in `onSettled`.
  - Check: head of file is `'use client'`; `grep -n "onSettled" + "invalidateQueries"`.

### Route handler

- MUST add `src/app/(api)/api/<route>/route.ts` accessing data only through Drizzle (`db.*`), never supabase-js.
  - Check: `grep -n "from '@/db'" src/app/(api)/api/<route>/route.ts`; `grep -rn "supabase" src/app/(api)/api/<route>` returns nothing.
- Aggregate counts MUST use `db.$count(...)`; MUST NOT count a fetched array's `.length`.
  - Check: `grep -n "\$count" src/app/(api)/api/<route>/route.ts`.
- Every user-scoped verb MUST call `auth.api.getSession({ headers: request.headers })` and return `401` when unauthenticated, scoping writes/reads to `session.user.id`.
  - Check: `grep -n "getSession" src/app/(api)/api/<route>/route.ts` and a `401` branch present.

### UI + gating

- MUST add the module under `src/app/modules/<module>/` and a thin RSC page under `src/app/(web)/<route>/page.tsx`.
  - Check: both paths exist; `grep -n "use client"` absent from the `page.tsx`.
- The page MUST `prefetchQuery` the same query options the module reads and wrap the module in `<HydrationBoundary>`.
  - Check: `grep -n "prefetchQuery" + "HydrationBoundary"` in the `page.tsx`; the prefetched options factory is the one used by the module's `useQuery`.
- If the page is private or guest-only, its path MUST appear in `src/proxy.ts` (matcher + redirect logic). API auth MUST remain in the handler regardless.
  - Check: `grep -n "<route>" src/proxy.ts` when private; the handler still has its own `getSession` guard.

### Final

- MUST run `yarn format` (type-check → lint --fix → prettier) clean before declaring done.
  - Check: `yarn format` exits 0.
