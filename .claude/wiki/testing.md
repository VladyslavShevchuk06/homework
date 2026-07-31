# Testing

The suite is **Playwright e2e only** — there are no unit tests. 18 tests across 4 specs, run against
a real dev server and a **separate test database**.

## Layout

```
test/e2e/
├── tests/          auth.spec.ts (5) · catalog.spec.ts (7) · favorites.spec.ts (2) · gating.spec.ts (4)
├── pages/          page objects: items-list, item-detail, favorites, login, register, nav
├── fixtures/       test.ts (the extended `test`), api.fixture.ts
├── setup/          global-setup.ts, auth.setup.ts
├── scripts/        check-test-db.ts, reset-test-items.ts
├── utils/          db.ts, guard.ts, users.ts, form.ts
└── .auth/user.json storage state produced by the setup project
```

`test/` is excluded from the app `tsconfig.json` and has its own — that is why `yarn type-check`
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
yarn seed:test         # check-test-db → src/db/seed.ts  (22 drivers)
yarn test:e2e          # playwright test
```

`playwright.config.ts` then does the rest: `globalSetup` asserts the test DB and deletes freshly
created users; the **`setup` project** runs `auth.setup.ts`, which signs a user up and in through the
real `/api/auth/*` endpoints (see [[auth]]) and saves storage state to `test/e2e/.auth/user.json`;
the **`chromium` project** depends on `setup` and reuses that storage state, so tests start
authenticated. `webServer` boots `yarn dev:e2e` locally (`yarn start:e2e` in CI) and reuses an
already-running server outside CI.

Local runs use `retries: 1`; CI uses 2 retries, 1 worker, and adds the `github` reporter.

## Known baseline (2026-07-31, commit `0409586`)

**18 passed, 1 flaky.** The flaky one is
`favorites.spec.ts:32 › Favorites › removes a driver from favorites`: it failed the first attempt
waiting for `getByText('No favorites yet')` and passed on retry.

That is consistent with the dual-invalidation coupling described in [[data-flow]] — removing the last
favorite has to settle both TanStack's client cache and the Next.js cache tag before the empty state
renders. Treat this specific test failing as *probably pre-existing*, not as proof that a change
broke something; compare against this baseline rather than against "all green".

## Reports

`playwright-report/` (html, never auto-opened, plus `results.json`); traces on first retry and
screenshots on failure.
