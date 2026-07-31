# Wiki Log

Append-only chronicle. One entry per run.

## [2026-07-31] ingest | core scope (6 pages)

First ingest of `f1-catalog`, at commit `0409586` on branch `new-structure`. Explored `src/`,
`test/`, `drizzle/` and the root configs with Glob/Grep/Read; every claim traced to a real path.

- Created `index.md`: overview, stack table, top-level Mermaid diagram, page catalog.
- Created 5 pages: [[architecture]], [[data-flow]], [[auth]], [[database-and-migrations]], [[testing]].
- **Scope decision — core, not exhaustive.** No `client-shared` / `client-pkg` /
  `client-modules-widgets` pages: those would restate `.claude/skills/client-structure/`, which is the
  law and ships executable checkers. A second copy of structural rules drifts from the first — the
  source template this setup came from had exactly that happen (two of its pages went stale within
  seven weeks). The wiki documents what the skills cannot: request lifecycles, local mechanisms and
  test infrastructure.
- Findings worth recording while reading the code:
  - The entity api slice publishes **two barrels** (`index.ts` client-safe, `index.server.ts`
    server-only, service behind `import 'server-only'`). A server render skips the HTTP hop and calls
    the same service the route handler calls.
  - There are **two write mechanisms** for favorites — an optimistic TanStack mutation and a
    `'use server'` action that invalidates Next.js cache tags (`updateTag`). They invalidate two
    different caches, and both are needed for consistency.
  - `cacheComponents: true` explains several otherwise odd details: `await connection()` in handlers,
    `setRequestLocale` + full `messages` in the locale layout, `'use cache'` + `cacheTag` on items pages.
  - `src/db/` and `src/lib/` sit outside the layer tree; target homes are recorded in the
    `client-structure` skill, not yet moved.
- Recorded the e2e baseline in [[testing]]: **18 passed, 1 flaky**
  (`favorites.spec.ts:32 removes a driver from favorites`), so future runs are compared against a
  known state rather than an assumed all-green.
