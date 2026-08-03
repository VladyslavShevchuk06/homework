# Architecture

`f1-catalog` is **one** Next.js 16 App Router deployment that contains both the client and the
server. There is no separate backend service: the "server" is the `(api)` route-group plus the
`'server-only'` services the handlers call.

## The two route groups

- **`src/app/(web)/[locale]/`** — the rendered surface. Every user-facing route is locale-scoped;
  `[locale]/layout.tsx` owns `<html lang>`, locale validation and the provider stack. See
  [[data-flow]] for what a page is allowed to do.
- **`src/app/(api)/api/`** — the HTTP surface. Three handlers today:
  `api/items/route.ts`, `api/favorites/route.ts`, and `api/auth/[...all]/route.ts` (the latter is
  one line — `toNextJsHandler(auth)` from Better Auth, see [[auth]]).

Neither group appears in the URL — route groups scope layout and code organisation, not paths.

## Layered layout (Feature-Sliced Design)

`src/app/` follows Layer → Slice → Segment: `modules` → `widgets` → `features` → `entities` →
`shared`, with `config/` and `pkg/` hoisted to `src/` as infrastructure. Imports flow downward
only, and no slice imports a sibling in its own layer.

**The structural rules are NOT documented here** — deliberately. They are owned by the
`.claude/skills/client-structure/` skill, which is the law and ships two executable checkers
(`scripts/check-layer-imports.mjs`, `scripts/check-barrels.mjs`). Duplicating them in the wiki
would create a second source of truth that drifts. This page describes only what is specific to
this codebase and cannot be derived from the pattern.

Current slices: modules `items-list`, `item-detail`, `favorites`, `login`, `register`, `error`,
`not-found`; features `favorite-toggle`, `search-form`, `social-auth`, `experiment`; entities
`items` and `favorites`; `pkg/` slots `auth`, `locale`, `query`, `theme`, `growthbook`, `mixpanel`.
There is no `widgets/` layer yet.

Two folders sit **outside** the layer tree and predate the current rules: `src/db/` and `src/lib/`.
Their target homes (`shared/systems/db/`, `shared/systems/auth/`) are recorded in the
`client-structure` skill; the move has not happened yet.

## The runtime split inside an entity api slice

This is the most load-bearing local convention. An `entities/api/<api>/` slice serves both
runtimes and publishes **two barrels**:

| File | Runtime | Role |
|---|---|---|
| `<api>.api.ts` | client | `fetch('/api/<route>')` wrappers |
| `<api>.query.ts` | client | `queryOptions` factories + the exported `…QueryKey()` helper |
| `<api>.mutation.ts` | client (`'use client'`) | optimistic `useMutation` hooks |
| `<api>.query.server.ts` | server (`'server-only'`) | `queryOptions` whose `queryFn` calls the service directly |
| `<api>.service.ts` | server (`'server-only'`) | the Drizzle queries — the only place SQL exists |
| `<api>.action.ts` | server (`'use server'`) | server action (only `favorites` has one) |
| `index.ts` | client-safe | what components import |
| `index.server.ts` | server-only | what handlers and RSC pages import |

`import 'server-only'` at the top of the service is the guard: pulling it into a client graph
becomes a build error rather than a leaked `DATABASE_URL`. A page that prefetches uses
`index.server` and skips the HTTP hop entirely — the same query function that the route handler
calls. The client, after hydration, goes through `<api>.api.ts` → the handler → the same service.

## Rendering model

`next.config.ts` sets **`cacheComponents: true`**, and that single flag explains several otherwise
puzzling details:

- Route handlers call `await connection()` before touching request data, to opt into dynamic
  rendering explicitly.
- `[locale]/layout.tsx` calls `setRequestLocale(locale)` and passes the **full** `messages` object
  to `NextIntlClientProvider`, so client translations prerender statically. Narrowing that payload
  would break static prerendering here — see the `next-intl` skill.
- `items` pages use the `'use cache'` directive with `cacheTag(...)`/`cacheLife(...)`, and the
  favorites server action invalidates those tags with `updateTag(...)`. Tag builders live in
  `src/app/shared/utils/cache-tag.util.ts`.

## Provider stack

`[locale]/layout.tsx` nests, outermost first: `ThemeProvider` (next-themes) → `QueryProvider`
(TanStack, `src/pkg/query/`) → `NextIntlClientProvider` → `ExperimentProvider`
(`features/experiment`, GrowthBook) → `Nav` + `children` + `Toaster`.

## Edge gate

`src/proxy.ts` (Next 16's name for `middleware.ts`) is the only gating file and does three jobs in
order: session-based redirects for `/favorites` (auth-only) and `/login`/`/register` (guest-only);
A/B bucketing that keeps a sticky `ab_id` cookie, resolves the variant through GrowthBook and hands
it to the page as an `ab_variant` cookie; then `next-intl` routing. Its
matcher excludes `api`, `_next`, `_vercel` and any path with a dot, so `/api/*` never reaches it —
which is why each handler enforces its own session check. Detail: [[auth]].
