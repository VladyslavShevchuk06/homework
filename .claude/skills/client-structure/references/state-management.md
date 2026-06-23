# Server state (TanStack Query v5)

Server state lives entirely in the `entities/api/<api>/` slice: `<api>.api.ts` (raw fetchers), `<api>.query.ts` (`queryOptions` factories), `<api>.mutation.ts` (`'use client'` hooks). The patterns below describe how those files are actually written in this project.

## Query keys

Every cache key is sourced from a single `EEntityKey` enum in `shared/interfaces/entities.interface.ts` — the single source of truth for query keys across all entity slices:

```ts
export enum EEntityKey {
  ITEMS_LIST = 'items-list',
  ITEM_DETAIL = 'item-detail',
  FAVORITES_LIST = 'favorites-list',
}
```

Query keys are arrays whose first element is an `EEntityKey` value, followed by the parameters that vary the result (`[EEntityKey.ITEMS_LIST, page, search, team]`). Mutations read and invalidate against the same enum values, so list and detail caches stay addressable from one place.

## Pagination

List queries keep the previous page on screen while the next one loads, using the v5 standard:

```ts
return queryOptions({
  queryKey: [EEntityKey.ITEMS_LIST, page, search, team],
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

## Boundaries

`<api>.api.ts` and `<api>.query.ts` carry no `'use client'` — they must stay server-composable so a page can `prefetchQuery` during SSR. Only `<api>.mutation.ts` is a client module. Fetchers throw `new Error(message)` on a non-`ok` response; mutations surface those errors in `onError`.
