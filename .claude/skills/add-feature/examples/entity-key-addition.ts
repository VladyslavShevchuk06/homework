// Connective snippet: registering the new resource's cache keys in the single
// EEntityKey enum (src/app/shared/interfaces/entities.interface.ts). Add the
// new members alongside the existing ones — never inline a raw string key.

// Single source of truth for TanStack Query cache keys across all entity slices.
export enum EEntityKey {
  // ...existing members (worked reference): ITEMS_LIST, ITEM_DETAIL, FAVORITES_LIST...

  // one key per view of the new resource
  <ENTITY>_LIST = '<entity>-list',
  <ENTITY>_DETAIL = '<entity>-detail',
}

// Referenced from:
//   - <api>.query.ts  → queryKey: [EEntityKey.<ENTITY>_LIST, ...params]
//   - <api>.mutation.ts → invalidateQueries({ queryKey: [EEntityKey.<ENTITY>_LIST] })
// Query/mutation file shapes live in client-structure/examples + references/state-management.md.
