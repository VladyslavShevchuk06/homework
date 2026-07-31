# Data flow

Every read reaches Postgres through the same function, but by one of **two paths** depending on who
is asking. Both end at an `entities/api/<api>/<api>.service.ts`, the only place Drizzle queries are
written. See [[architecture]] for why the slice is split that way.

## Path A — server render (no HTTP hop)

`(web)/[locale]/<route>/page.tsx` → `getQueryClient()` (`src/pkg/query/`) →
`prefetchQuery(<api>ListServerQueryOptions(...))` → `<api>.service.ts` → Drizzle → Postgres, then
`<HydrationBoundary state={dehydrate(queryClient)}>` hands the filled cache to the module.

`src/app/(web)/[locale]/favorites/page.tsx` is the worked example: it reads the session, redirects
guests through the locale-aware `redirect` from `@/pkg/locale`, prefetches, and renders
`<FavoritesModule>` inside a `<Suspense>`. The page itself declares nothing else — that rule belongs
to `client-structure`.

`getQueryClient()` returns a **fresh** `QueryClient` per request on the server and a singleton in
the browser (`src/pkg/query/query.pkg.ts`). Without that split, one user's cache would leak into
another's render.

## Path B — client fetch (after hydration)

component → `<api>.query.ts` `queryOptions` → `<api>.api.ts` `fetch('/api/<route>?…')` →
`(api)/api/<route>/route.ts` → `<api>.service.ts` → Drizzle → Postgres.

The handler contract (verified in `api/items/route.ts` and `api/favorites/route.ts`):

1. `await connection()` first — required by `cacheComponents: true` to opt into dynamic rendering.
2. Validate input. `items` uses a Zod schema with `.catch(<default>)` per field, so a malformed
   `page` degrades to `1` instead of failing the request.
3. Enforce the session itself when the data is user-scoped: `auth.api.getSession({ headers })` →
   `401`. `/api/*` is excluded from `src/proxy.ts`'s matcher, so the gate genuinely never ran.
4. Delegate to `index.server` and return `NextResponse.json(...)`. No query building in the handler.

Both paths call the identical service function, so a server-rendered list and a client-refetched
list cannot disagree.

## Locale-aware reads

`items.service.ts` picks columns per locale rather than storing translations in a side table:
`localeColumns(locale)` chooses between `titleEn`/`titleUk`, `teamEn`/`teamUk`, and so on, and
`itemSelection(locale)` builds the projection. `locale` therefore belongs to the query key — it
changes the result — which is why keys look like
`[<key>, page, search, team, locale]`.

## Aggregates without N+1

`src/db/favorites-count.ts` exports a correlated sub-select built with `db.$count(...)`:

```ts
export const favoritesCount = db.$count(favorites, eq(favorites.itemId, items.id))
```

It is spread into the projection alongside the table columns, so a list of items carries each row's
favorite count in a single round trip. Never count by fetching rows and reading `.length`. Detail:
[[database-and-migrations]].

## Writes — two mechanisms, on purpose

**1. Optimistic client mutation** (`favorites.mutation.ts`). `onMutate` cancels in-flight queries,
snapshots the affected caches and applies the change; `onError` restores the snapshot; `onSettled`
always invalidates. Because one favorite affects the favorites list *and* the favorite count shown
in the items list and item detail, the update fans out with `setQueriesData` (plural) — list caches
are keyed by page/search/team/locale, so several entries can be live at once.

**2. Server action** (`favorites.action.ts`, `'use server'`). `toggleFavorite(itemId, slug)` reads
the session from `await headers()`, validates the id with Zod, toggles the row, then invalidates the
Next.js cache tags: `updateTag(itemDetailCacheTag(slug))` and `updateTag(itemsListCacheTag())`.
Those tags are attached by the `items` pages, which use the `'use cache'` directive with
`cacheTag(...)`/`cacheLife(...)`.

So the two mechanisms invalidate two different caches — TanStack's client cache and Next's
cache-components cache — and a favorite toggle needs both to stay consistent. That coupling is the
most likely source of the one known-flaky e2e test; see [[testing]].

## Auth requests

`/api/auth/*` bypasses all of the above: `toNextJsHandler(auth)` hands the whole subtree to Better
Auth. See [[auth]].
