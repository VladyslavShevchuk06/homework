# Spec: global invariants

Declarative structural rules that hold for **every** Next.js client built with this skill. After any change, self-verify against this list. Each rule is a `MUST` / `MUST NOT` with a **Check** hint (a grep pattern or a visual cue) — no script to run, the model reads and confirms.

## Barrels

- **MUST** ship an `index.ts` at every slice and segment folder (the deepest folder containing implementation files).
  Check: each new `<slice>/` or `<segment>/` folder has `index.ts`.
- **MUST NOT** place a barrel at layer level (`modules/`, `widgets/`, `features/`, `entities/`, `shared/`, `pkg/`).
  Check: `ls src/app/modules/index.ts` (and siblings) → file does not exist.

## Import direction

- **MUST** import only downward: `(web)/(api) → modules → widgets → features → entities → shared`.
- **MUST NOT** import upward or sideways within a layer (module→module, feature→feature, widget→widget).
  Check: `grep -R "from '@/app/modules/'" src/app/modules/` returns only `<module>/elements/*` self-imports.

## `pkg/` self-containment

- **MUST NOT** let a `pkg/*` slot import from `app/*` or from another `pkg/*`.
  Check: `grep -R "from '@/app/" src/pkg/` and `grep -R "from '@/pkg/<other>" src/pkg/<name>/` return nothing.

## Server / client boundary

- **MUST** keep pages and layouts as RSC unless they call client-only APIs.
- **MUST** place `'use client'` at the **outermost** component that needs the client runtime; children inherit it.
- **MUST NOT** add `'use client'` to `*.api.ts` or `*.query.ts` (they stay server-composable for `prefetchQuery`). Only `*.mutation.ts` carries it.
  Check: `grep -RL "use client" src/app/entities/api/**/*.mutation.ts` is empty; `grep -Rl "use client" src/app/entities/api/**/*.{api,query}.ts` is empty.

## Environment access

- **MUST** read env only through `envClient` / `envServer` from `config/env/`.
- **MUST NOT** read `process.env` outside `config/env/` — sole exception: `src/proxy.ts` reading `process.env.NODE_ENV` for cookie flags.
  Check: `grep -R "process.env" src --include=*.ts | grep -v "config/env" | grep -v "proxy.ts"` returns nothing.
- **MUST** place `NEXT_PUBLIC_*` vars on `envClient`; secrets on `envServer`.

## File naming

- **MUST** carry the role suffix on every implementation file (`.module.tsx`, `.component.tsx`, `.service.ts`, `.store.ts`, `.hook.ts(x)`, `.api.ts`, `.query.ts`, `.mutation.ts`, `.model.ts`, `.interface.ts`, `.constant.ts`, `.util.ts`, `.pkg.ts`).
  Sole exception: `shared/validation/validation.ts` (plain `*.ts`).
- **MUST** use kebab-case folder names; the slice folder name equals the file prefix.
  Check: `modules/<name>/<name>.module.tsx` — folder and prefix match, no camelCase, no `_`.

## Layer purity

- **MUST** keep `shared/utils/*.util.ts` pure (no React, no I/O, no service calls).
- **MUST** keep `entities/models/*.model.ts` runtime-free (types/interfaces/enums only).
- **MUST NOT** put TanStack Query files (`*.api.ts` / `*.query.ts` / `*.mutation.ts`) anywhere except `entities/api/<api>/`.
  Check: `grep -Rl "queryOptions\|useMutation\|useQuery" src/app/{modules,widgets,features}` returns nothing.

## Data layer

- **MUST** fetch data only through Drizzle ORM inside `(api)` route handlers.
  Check: `grep -R "@supabase/supabase-js" src` returns nothing.
- **MUST** use `db.$count(...)` for aggregate counts of related rows rather than counting a fetched array.
  Check: counts come from `db.$count` / `count()`, not `.length` over fetched rows.
- **MUST** source the cache key for every query from an `EEntityKey` value in `shared/interfaces/`.
  Check: `grep -R "queryKey:" src/app/entities/api` shows each key starting with an `EEntityKey.*` member.

## Server state

- **MUST** pass `placeholderData: keepPreviousData` on paginated list queries.
- **MUST** invalidate every affected key in `onSettled` for any mutation that updates the cache optimistically.
  Check: each `onMutate` that calls `setQueryData`/`setQueriesData` has a matching `onSettled` `invalidateQueries`.

## Auth

- **MUST** read the session on the server via `auth.api.getSession({ headers })`; never trust a client store for gating.
- **MUST** declare OAuth provider secrets as `z.string().optional()` in `env.server.ts`.
  Check: `grep -R "CLIENT_SECRET" src/config/env/env.server.ts` shows `.optional()`.
- **MUST** keep all page-route gating in `src/proxy.ts` (one file); each `(api)` handler enforces its own session check.
