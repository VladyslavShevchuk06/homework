# Diff-aware run of the project rules

These are **not new law.** The canonical structural invariants live in `client-structure/spec` (that skill's `invariants.spec.md` and `per-action.spec.md`). This file is the **diff-aware run** of those same rules: grouped by what a change typically touches, each with a `Check:` grep hint you can point at the changed files. When a check trips, fix against the canonical rule.

Run only the groups whose trigger paths appear in the diff. Read the whole changed file, not just the touched lines — several rules are about an *absence* (a missing barrel, a missing `onSettled`).

## A. Touched `src/app/entities/api/**`

- Each `queryKey` starts with an `EEntityKey.*` member from `shared/interfaces/entities.interface.ts`.
  Check: `grep -RnE "queryKey" src/app/entities/api` — every key array begins with `EEntityKey.`.
- `'use client'` is on `*.mutation.ts` only; `*.api.ts` / `*.query.ts` stay server-composable.
  Check: `grep -Rl "use client" src/app/entities/api` lists only `*.mutation.ts` files.
- Optimistic mutation lifecycle: `onMutate` snapshots + cancels, `onError` restores, `onSettled` **always** `invalidateQueries`.
  Check: in the changed mutation, every `onMutate` that calls `setQueryData`/`setQueriesData` has a matching `onSettled` invalidate.
- List queries pass `placeholderData: keepPreviousData`.
  Check: `grep -Rn "placeholderData" src/app/entities/api` for any list query in the diff.
- TanStack Query primitives stay inside `entities/api/<api>/`.
  Check: `grep -RlE "queryOptions|useMutation|useQuery" src/app/{modules,widgets,features}` returns nothing.
- The barrel exports only consumer-facing hooks/option factories, not internal fetchers.
  Check: changed `<api>/index.ts` does not re-export `*Api` fetchers.

## B. Touched `src/db/schema.ts`

- A migration was generated for the schema change.
  Check: `yarn db:generate` then confirm a new `*.sql` under `drizzle/` (and its `meta/*_snapshot.json`).
- `src/db/seed.ts` still matches the schema shape.
  Check: read `seed.ts` — new non-nullable columns have seed values; removed columns are no longer referenced.
- Aggregate counts use `db.$count(...)`, never `.length` over a fetched array.
  Check: `grep -Rn "\.length" src/db src/app/entities/api` — none is being used as a row count; counts come from `db.$count` / `count()`.

## C. Touched a `(api)` route handler (`route.ts`)

- Data access is Drizzle only — never the supabase client.
  Check: `grep -R "@supabase/supabase-js" src` returns nothing.
- Uses `db` from `@/db`; user-scoped handlers verify the session themselves.
  Check: changed handler imports `db` from `@/db`; user-scoped routes call `auth.api.getSession({ headers })`.
- Env is read from `config/env/`, not `process.env`.
  Check: `grep -n "process.env" <changed route.ts>` returns nothing.

## D. Touched `src/proxy.ts`

- All page-route gating stays in this one file (no gating logic added elsewhere).
- A new private/guest path is reflected in BOTH the gating branches AND `config.matcher`.
  Check: a path added to the `if`/redirect logic also appears in `config.matcher` (and vice-versa).
- The only `process.env` allowed here is `process.env.NODE_ENV` (cookie flags).
  Check: `grep -n "process.env" src/proxy.ts` shows only `NODE_ENV`, if any.

## E. Touched `src/config/env/**`

- New var is declared in the Zod schema AND wired into `runtimeEnv`.
  Check: changed `env.server.ts` / `env.client.ts` lists the var in both the schema object and `runtimeEnv`.
- `NEXT_PUBLIC_*` vars live on `envClient`; secrets on `envServer`.
- OAuth provider secrets are `z.string().optional()` (unset provider disables, not breaks).
  Check: `grep -n "CLIENT_SECRET" src/config/env/env.server.ts` shows `.optional()`.

## F. Any code reading configuration

- Config is read through `envClient` / `envServer`, never raw `process.env`.
  Check: `grep -R "process.env" src --include=*.ts | grep -v "config/env" | grep -v "proxy.ts"` returns nothing.

## G. New slice/segment files

For genuinely new modules/widgets/features/entities/shared segments/`pkg` integrations, structural placement, barrels, naming suffixes and import direction are governed by `client-structure`. Defer to the `client-structure` skill rather than duplicating those rules here.

## Build gate

- `yarn format` (type-check → lint --fix → prettier) passes end-to-end. Use **yarn**, not npm.
