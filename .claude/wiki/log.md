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

## [2026-08-03] lint | drift against `e9d6b69`

The first ingest ran at `0409586`; two commits landed after it and both invalidated claims written
here. Reconciled the wiki and the skills in one pass, since the same two facts were stated in both.

- [[auth]] and [[architecture]]: the A/B variant no longer travels as an injected search param, and
  the `x-middleware-rewrite` upgrade trick is gone (commit `e9d6b69`). The proxy now writes the
  resolved variant to an `ab_variant` cookie on both the request and the response, and
  `(web)/[locale]/items/page.tsx` reads it via `Promise.all([searchParams, cookies()])`. Recorded the
  reason too: a search param makes the rewritten URL diverge from the requested one, which stops
  client-side navigations from applying the new payload.
- `.state.json` moved to `e9d6b69`.
- Outside the wiki, same pass: commit `2c8f17c` deleted the project-wide `EEntityKey`
  (`shared/interfaces/entities.interface.ts`) in favour of per-entity `E<Entity>Api` / `E<Entity>Key`,
  but six skill files still described that enum as existing "legacy" code — including a
  `> **Current state.**` note in `client-structure/references/state-management.md` asserting the
  refactor was still pending. Removed the existence claims in `CLAUDE.md`, `client-structure`,
  `add-feature` (SKILL + recipe + spec + example) and `review-changes` (SKILL + checklist); the rule
  itself is unchanged. `grep -rn "EEntityKey" src` returns nothing, and the only remaining mentions
  anywhere are this log entry.
- Lesson for the next run: the wiki and the skills state some of the same facts, so a code change
  that contradicts one usually contradicts the other. Check both, and check them in the same pass.

## [2026-08-13] update | teams normalization + unit test layer

Two shipped changes, one reverted before it landed. Reconciled the wiki against all three.

- **`teams` extracted from `items`.** The catalog's team filter was a hard-coded 11-name array in
  `search-form.component.tsx` matched with `ilike '%<name>%'` against localized text — and the
  hard-coded list already disagreed with the data (`'Red Bull'` vs the seeded
  `'Red Bull Racing'`; only the `ilike` hid it). Now a real `teams` table, a not-null
  `items.team_id` FK, filtering by `eq(teams.slug, …)`, and dropdown options served from
  `/api/teams`. `number` went `text` → `integer` in the same pass. Updated
  [[database-and-migrations]] (schema, migrations, seeding), [[data-flow]] (locale columns,
  slug filter, aggregates) and the `index.md` diagram.
- **Two facts worth recording, both found by a failing test rather than by reading:**
  - `db.$count(table, filter)` breaks the moment `filter` reaches into a joined table. `$count`
    also takes a subquery — that is the form the list uses now.
  - Drizzle's relational query (`db.query.*.findFirst`) rewrites table aliases inside `extras`,
    so the shared `favoritesCount` fragment emitted `where "items"."item_id" = "items"."id"` and
    threw. The detail page counts with a second `db.$count` instead.
- **Migrations `0003`/`0004` are hand-extended, and that is not a violation.** [[database-and-migrations]]
  said "generated, never hand-edited"; the rule is about *correcting* a migration, and drizzle-kit
  cannot express a data backfill at all. Added a section spelling out the backfill statements, why
  the change is split across two migrations (`generate` prompts for drop+add and fails outside a
  TTY), and the pre-flight check `select number from items where number !~ '^[0-9]+$'`.
- **Vitest added** over the three `(api)` route handlers — 17 tests, mocking `connection` and the
  service module so no DB or browser is involved. New `ci.yml` runs `lint` → `type-check` → `test`;
  before it, `yarn build` was the only implicit type gate in CI. Documented in [[testing]].
- **Password reset was built, then reverted.** Better Auth `sendResetPassword` + a Resend sender +
  two pages + 4 e2e tests, all green — reverted because without `RESEND_API_KEY` and a verified
  domain the feature *looks* fine in prod (UI says "check your inbox") while the mail only reaches
  a server log. Shipping a silently broken flow is worse than not shipping it. Nothing of it
  remains in the tree; `waitForHydration` went with it, and [[testing]] now records the technique
  so it is not rediscovered from scratch.
- e2e baseline re-confirmed at **18 passed, 0 flaky** (warm server) and annotated in [[testing]]:
  on a cold dev server *both* `favorites.spec.ts` tests flake, not only `:32`.
- Lesson for the next run: a "documented rule" and "a rule that applies to this case" are not the
  same thing. Two conventions here (no hand-edited SQL, `db.$count` for aggregates) each needed a
  stated exception rather than either silent deviation or mechanical compliance.
