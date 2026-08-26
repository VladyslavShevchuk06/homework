# Testing

Two layers, split by what they can prove:

- **Vitest** (`yarn test`) — 17 tests over the three `(api)` route handlers. Pure request/response
  contract: no browser, no database.
- **Playwright** (`yarn test:e2e`) — 18 tests across 4 specs, run against a real dev server and a
  **separate test database**. Everything that needs real SQL or a real browser lives here.

## Vitest — the route-handler contract

```
tests/(api)/api/items/route.test.ts
tests/(api)/api/teams/route.test.ts
tests/(api)/api/favorites/route.test.ts
```

Config is `vitest.config.mts` (`.mts`, not `.ts` — the package is CommonJS, and a `.ts` config using
ESM syntax makes Vite warn). `environment: 'node'`, `include: ['tests/**/*.test.ts']` plus
`exclude: [...configDefaults.exclude, 'tests/e2e/**']` so the Playwright specs sharing the root are
never collected, and the `@` alias resolved manually via `fileURLToPath` rather than a
tsconfig-paths plugin.

Two mocks make a handler callable outside Next:

- **`connection` from `next/server`** — it has no store outside a render. The mock spreads the real
  module through `importOriginal`, so `NextRequest`/`NextResponse` stay genuine and the tests assert
  real status codes and real serialization.
- **The service module** (`entities/api/<x>/index.server`) — replacing it wholesale means
  `server-only` and Drizzle never load. `/api/favorites` additionally mocks `@/lib/auth` to drive
  `getSession`.

What that buys: the Zod `.catch()` fallbacks (`?page=abc` → `1`, `?locale=fr` → `'en'`, a
101-character `search` → `''`), the `401` with no session, the `500` on a throwing service, and the
exact arguments the handler passes down. What it deliberately does **not** cover: the SQL itself and
the schema — those are Playwright's job.

Suites live in the top-level `tests/` folder, mirroring the subject's path under `src/app` and
importing it through `@/`, per the `client-structure` invariant (`find src -name '*.test.*'` must be
empty, and no `index.ts` anywhere under `tests/`). They are still inside the app `tsconfig.json`, so
`yarn type-check` covers them — unlike the e2e suite, which is excluded.

## Playwright — layout

```
tests/e2e/
├── tests/          auth.spec.ts (5) · catalog.spec.ts (7) · favorites.spec.ts (2) · gating.spec.ts (4)
├── pages/          page objects: items-list, item-detail, favorites, login, register, nav
├── fixtures/       test.ts (the extended `test`), api.fixture.ts
├── setup/          global-setup.ts, auth.setup.ts
├── scripts/        check-test-db.ts, reset-test-items.ts
├── utils/          db.ts, guard.ts, users.ts, form.ts
└── .auth/user.json storage state produced by the setup project
```

`tests/e2e` is excluded from the app `tsconfig.json` and has its own — that is why `yarn type-check`
does not cover the suite.

## Isolation from the dev environment

Three separate mechanisms, each solving a different collision:

- **Database**: `playwright.config.ts` loads `.env.test.local` then `.env.test`, so `DATABASE_URL`
  points at the test DB. `utils/guard.ts` exports `assertTestDb()`, which `check-test-db.ts` runs
  **before** every destructive script — the guard is what stops `seed`/`reset` from ever hitting the
  development database.
- **Build directory**: `dev:e2e` sets `NEXT_DIST_DIR=.next-e2e` so the e2e server never shares a
  Turbopack cache with `yarn dev`. A stale build dir is a real failure mode here — `auth.setup.ts`
  explicitly asserts that sign-in returned `application/json` and reports "route handler not
  registered (stale build dir?)" instead of dumping 30 KB of RSC payload.
- **Port**: the e2e server runs on `:3100` (`baseURL` from `NEXT_PUBLIC_APP_URL`, default
  `http://localhost:3100`).

## How a run proceeds

```bash
yarn db:migrate:test   # check-test-db → reset-test-items → src/db/migrate.ts
yarn seed:test         # check-test-db → src/db/seed.ts  (11 teams, then 22 drivers)
yarn test:e2e          # playwright test
```

`playwright.config.ts` then does the rest: `globalSetup` asserts the test DB and deletes freshly
created users; the **`setup` project** runs `auth.setup.ts`, which signs a user up and in through the
real `/api/auth/*` endpoints (see [[auth]]) and saves storage state to `tests/e2e/.auth/user.json`;
the **`chromium` project** depends on `setup` and reuses that storage state, so tests start
authenticated. `webServer` boots `yarn dev:e2e` locally (`yarn start:e2e` in CI) and reuses an
already-running server outside CI.

Local runs use `retries: 1`; CI uses 2 retries, 1 worker, and adds the `github` reporter.

## CI — two workflows, split by cost

- **`.github/workflows/ci.yml`** — `yarn lint` → `yarn type-check` → `yarn test`. No database, no
  secrets, no browser, so it runs on every push and PR in under a minute. This is the gate that
  used to be missing: before it, `yarn build` was the only implicit type check in CI.
- **`.github/workflows/e2e.yml`** — the expensive one: writes `.env.test.local` from secrets,
  migrates and seeds the test DB, builds, runs Playwright, uploads the report.

## Known baseline (2026-07-31, commit `0409586`)

**18 passed, 1 flaky.** The flaky one is
`favorites.spec.ts:32 › Favorites › removes a driver from favorites`: it failed the first attempt
waiting for `getByText('No favorites yet')` and passed on retry.

That is consistent with the dual-invalidation coupling described in [[data-flow]] — removing the last
favorite has to settle both TanStack's client cache and the Next.js cache tag before the empty state
renders. Treat this specific test failing as *probably pre-existing*, not as proof that a change
broke something; compare against this baseline rather than against "all green".

**Re-confirmed 2026-08-13** (after the `teams` normalization): still **18 passed**, 0 flaky on a
warm server. One thing learned that the baseline did not say — on a *cold* dev server both
`favorites.spec.ts` tests flake, not just `:32`. Six workers hit routes Turbopack has not compiled
yet, and the favorite toggle is mount-gated (`useSyncExternalStore`), so the extra compile latency
widens the window before its button exists. Warm the server, or read a first-run favorites failure
as environmental until it reproduces on a second run.

Related trap when writing new form specs: `fillAllStable` fills and asserts, but hydration can
still reset the input *after* the assert passes and before the click, submitting an empty field.
The reliable gate is the nav theme toggle — it renders an `aria-hidden` placeholder until it
mounts, so waiting for its button means React has hydrated.

## Reports

`playwright-report/` (html, never auto-opened, plus `results.json`); traces on first retry and
screenshots on failure.
