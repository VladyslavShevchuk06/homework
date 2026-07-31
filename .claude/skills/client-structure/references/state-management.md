# Server state (TanStack Query v5)

Server state lives entirely in the `entities/api/<api>/` slice: `<api>.api.ts` (raw fetchers), `<api>.query.ts` (`queryOptions` factories), `<api>.mutation.ts` (`'use client'` hooks). The patterns below describe how those files are actually written in this project.

## Query keys

**Each entity owns its own keys.** The enum lives in that entity's model —
`entities/models/<entity>.model.ts` — beside the `E<Entity>Api` endpoint enum for the same entity:

```ts
// endpoints
export enum EItemsApi {
  LIST = '/api/items',
  BY_SLUG = '/api/items/:slug',
}

// TanStack query keys — this entity owns its own, there is no project-wide enum
export enum EItemsKey {
  LIST = 'items-list',
  DETAIL = 'item-detail',
}
```

There is deliberately **no single project-wide key enum**. One enum for every entity is a hub: it
forces every slice that needs one key to depend on the module that declares all of them, so an
unrelated entity's change invalidates the import graph of every consumer, and the enum grows into
the place nobody can safely delete from. Keys are owned where the entity is owned.

Query keys stay arrays whose first element is the enum value, followed by the parameters that vary
the result (`[EItemsKey.LIST, page, search, team, locale]`). Wrap that in a small exported factory
next to the query (`itemsListQueryKey(params)`) so a mutation invalidating the same cache cannot
drift from the query that fills it.

> **Current state.** The codebase still routes every key through one `EEntityKey` in
> `shared/interfaces/` — decentralising it is a pending refactor. New code adds `E<Entity>Key` to
> the entity model; do not extend `EEntityKey` with new members.

## Pagination

List queries keep the previous page on screen while the next one loads, using the v5 standard:

```ts
return queryOptions({
  queryKey: [EItemsKey.LIST, page, search, team],
  queryFn: () => itemsListApi({ page, search, team }),
  // v5 standard: keep showing the previous page's data while the next one loads
  placeholderData: keepPreviousData,
})
```

`keepPreviousData` is imported from `@tanstack/react-query` and passed as the value of `placeholderData` (not the deprecated boolean flag). Detail queries gate fetching with `enabled: !!slug`.

## The optimistic mutation pattern

Mutations own optimistic updates. The canonical shape (see `entities/api/favorites/favorites.mutation.ts`) is:

1. **`onMutate`** — cancel in-flight queries for every affected key, snapshot their current data, apply the optimistic change, and return the snapshot as context:

   ```ts
   onMutate: async ({ itemId }) => {
     const context = await beginOptimistic() // cancelQueries + snapshot
     // setQueryData on the list being mutated
     applyCountDelta(itemId, 1)              // setQueriesData across related caches
     return context
   }
   ```

2. **`onError`** — restore from the snapshot held in context (`restore(context.previous)`), reverting every cache touched in `onMutate`.

3. **`onSettled`** — **always** invalidate the affected query keys (`invalidateQueries` for the list, items, and detail keys), so the optimistic state is reconciled against the server regardless of success or failure.

The snapshot covers **all** keys the mutation touches (favorites list + items list + item detail), captured with `getQueriesData` and restored with `setQueryData` per entry.

## Cross-cache synchronization

A single change often affects more than one cached shape — adding a favorite changes the favorites list **and** the favorite count shown in the items list and the item detail. Keep them consistent with `setQueriesData`, applying the same delta to every matching cache entry:

```ts
queryClient.setQueriesData<IItemsListResponse>({ queryKey: itemsKey }, (old) =>
  old
    ? { ...old, data: old.data.map((item) =>
        item.id === itemId ? { ...item, favoritesCount: item.favoritesCount + delta } : item) }
    : old,
)
```

`setQueriesData` (plural) updates every cache entry under a key prefix at once — necessary because list caches are keyed by page/search/team and there may be several live at any time. The subsequent `onSettled` invalidation is what ultimately reconciles these optimistic deltas with the database.

## The other write path — a server action with cache tags

TanStack is not the only mutation mechanism. A slice may also carry `<api>.action.ts` (`'use server'`),
which reads the session from `await headers()`, validates its input, writes, and then invalidates
**Next.js** cache tags with `updateTag(...)` — not the TanStack cache. The tags come from builders in
`shared/utils/cache-tag.util.ts` and are attached by pages using the `'use cache'` directive with
`cacheTag(...)` / `cacheLife(...)`.

Consequence: a mutation that affects a cached RSC surface needs **both** invalidations — the
TanStack `onSettled` invalidate for the client cache, and `updateTag` for the cache-components
cache. Doing only one leaves the two views disagreeing until something else refreshes. When adding a
mutation, check whether any page caches the affected surface by tag, and invalidate that tag too.

## Boundaries

`<api>.api.ts` and `<api>.query.ts` carry no `'use client'` — they must stay server-composable so a page can `prefetchQuery` during SSR. Only `<api>.mutation.ts` is a client module. Fetchers throw `new Error(message)` on a non-`ok` response; mutations surface those errors in `onError`.
