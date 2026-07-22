# F1 Drivers Catalog

A full-stack **Next.js 16** application demonstrating modern App Router features, Drizzle ORM, Supabase, Better Auth, and TanStack Query v5 pagination/optimistic updates. It catalogs the 2026 Formula 1 grid: anyone can browse drivers, search, and filter by team, while authenticated users get their own private list of favorite drivers with live "popularity" counts.

🔗 **Live demo:** [https://f1-drivers-lilac.vercel.app/items](https://f1-drivers-lilac.vercel.app/items)

## Tech Stack

- **Next.js 16** — App Router, React Server Components, `cacheComponents`
- **React 19**
- **Drizzle ORM** — type-safe schema, queries, and migrations (`postgres` driver)
- **Supabase** — managed PostgreSQL (transaction pooler)
- **Better Auth** — email/password + optional OAuth (GitHub, Google)
- **TanStack Query v5** — server-state, pagination, optimistic updates
- **next-intl** — bilingual i18n (English / Ukrainian)
- **react-hook-form + Zod** — form state & validation
- **Tailwind CSS + shadcn/ui** — styling & UI primitives
- **next-themes** — light/dark theme, **sonner** — toasts
- **Playwright** — end-to-end tests

## Getting Started (Step-by-Step for the Reviewer)

> **Prerequisites:** Node.js **20.9+** (CI runs on Node 22), Yarn, and a Supabase (or any PostgreSQL) database. All commands use **Yarn** — please do not substitute `npm`.

### Step 1 — Install Dependencies

```bash
yarn install
```

### Step 2 — Environment Variables

Copy the example file to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill in the required variables:

| Variable              | Required | What to set                                                               |
| --------------------- | :------: | ------------------------------------------------------------------------- |
| `DATABASE_URL`        |    ✅    | Connection string for **your own** Supabase/Postgres instance.            |
| `BETTER_AUTH_SECRET`  |    ✅    | Any random string of **32+ characters** (e.g. `openssl rand -base64 32`). |
| `BETTER_AUTH_URL`     |    ✅    | Leave as `http://localhost:3000`.                                         |
| `NEXT_PUBLIC_APP_URL` |    ✅    | Leave as `http://localhost:3000`.                                         |

> ### ⚠️ Note for the Reviewer — OAuth is OPTIONAL
>
> The four OAuth variables (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) are **completely optional**.
>
> **The app boots and standard Email/Password authentication works perfectly without them.** You only need to fill these in if you specifically want to exercise the "Sign in with GitHub / Google" flow. Leaving them empty has no effect on the rest of the application.

### Step 3 — Database Setup

Create the schema, then seed the 22 F1 drivers:

```bash
# 1. Create all tables (items, favorites, and the Better Auth tables)
yarn db:push

# 2. Seed the catalog with the 22 drivers of the 2026 F1 grid
yarn seed
```

> `yarn db:push` applies the schema directly. If you prefer SQL migration files, run `yarn db:generate` followed by `yarn db:migrate` instead (migrations live in `drizzle/`).

### Step 4 — Run the Application

```bash
yarn dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

## Available Scripts

All scripts are run with `yarn <script>`.

### Run

| Script  | Command      | Purpose                                       |
| ------- | ------------ | --------------------------------------------- |
| `dev`   | `next dev`   | Local dev server on **:3000**.                |
| `build` | `next build` | Production build.                             |
| `start` | `next start` | Serve the production build (run after build). |

### Quality

| Script       | Command                            | Purpose                                               |
| ------------ | ---------------------------------- | ----------------------------------------------------- |
| `type-check` | `tsc --noEmit`                     | TypeScript type check.                                |
| `lint`       | `eslint .`                         | Lint the whole repo.                                  |
| `format`     | type-check → lint --fix → prettier | Full pre-commit gate; run before declaring work done. |

### Database

| Script        | Command                | Purpose                                       |
| ------------- | ---------------------- | --------------------------------------------- |
| `db:generate` | `drizzle-kit generate` | Generate SQL migration files from the schema. |
| `db:push`     | `drizzle-kit push`     | Push the schema directly to the database.     |
| `db:migrate`  | `drizzle-kit migrate`  | Apply migration files.                        |
| `db:studio`   | `drizzle-kit studio`   | Open Drizzle Studio (DB browser).             |
| `seed`        | `tsx src/db/seed.ts`   | Seed the 22 drivers (reads `.env.local`).     |

### Testing

| Script            | Command                       | Purpose                                              |
| ----------------- | ----------------------------- | ---------------------------------------------------- |
| `test:e2e`        | `playwright test`             | Run the E2E suite (Chromium).                        |
| `test:e2e:ui`     | `playwright test --ui`        | Run the suite in the interactive Playwright UI.      |
| `test:e2e:report` | `playwright show-report`      | Open the last HTML report.                           |
| `dev:e2e`         | `next dev -p 3100`            | Dev server against the test env on **:3100**.        |
| `start:e2e`       | `next start -p 3100`          | Production server against the test env on **:3100**. |
| `db:migrate:test` | guard → `drizzle-kit migrate` | Migrate the **test** DB (`.env.test.local`).         |
| `seed:test`       | guard → seed                  | Seed the **test** DB (`.env.test.local`).            |

## Testing (End-to-End)

E2E tests run with **Playwright** against a **dedicated test database** — never your dev DB — so seeding and cleanup can wipe data freely. The test app runs on **port 3100**; a guard script (`test/e2e/scripts/check-test-db.ts`) refuses to touch a database that isn't explicitly marked as a test DB.

### One-time setup

1. Create a **separate, empty PostgreSQL database** for tests (a second Supabase project or local Postgres).
2. Create `.env.test.local` (not committed) with the same keys as `.env.local`, but pointing at the test DB and port 3100:

   ```bash
   DATABASE_URL="<your test database connection string>"
   BETTER_AUTH_SECRET="<any 32+ char string>"
   BETTER_AUTH_URL="http://localhost:3100"
   NEXT_PUBLIC_APP_URL="http://localhost:3100"
   ```

3. Prepare the test DB:

   ```bash
   yarn db:migrate:test   # apply migrations to the test DB
   yarn seed:test         # seed the 22 drivers into the test DB
   ```

### Run the tests

```bash
yarn test:e2e          # headless, Chromium
yarn test:e2e:ui       # interactive UI mode
yarn test:e2e:report   # open the HTML report from the last run
```

Playwright **starts the app server automatically** (`yarn dev:e2e` locally, `yarn start:e2e` on CI) — you do not need a separate `yarn dev` running. Specs live in `test/e2e/tests/` (`auth`, `catalog`, `favorites`, `gating`) and use Page Object Models under `test/e2e/pages/`.

CI runs the same flow on every push to `main` and every PR via `.github/workflows/e2e.yml` (Node 22): `db:migrate:test` → `seed:test` → `build` → `test:e2e`.

## Internationalization

The app is bilingual (**English** and **Ukrainian**) via `next-intl`. Locale is a route segment — `/(en|uk)/…` under `src/app/(web)/[locale]/` — and a locale switcher lets users toggle languages. Catalog content (driver titles, teams, countries, descriptions) is stored bilingually in the database.

## Project Structure

The code follows a **Feature-Sliced Design** layout. Imports flow **downward only**: `(web)/(api) → modules → widgets → features → entities → shared`.

```
src/
  app/
    (web)/[locale]/   # pages: home, items/, login/, register/
    (api)/api/        # route handlers (auth/[...all], ...) — the only place data is fetched
    modules/          # one business screen each (items-list, item-detail, favorites, ...)
    features/         # narrow capabilities (search-form, social-auth, favorite-toggle)
    entities/         # api/ (per-resource query/mutation slices) + models/
    shared/           # components/ (incl. ui/), utils/, interfaces/, validation/
  config/             # env/ (envClient / envServer), fonts, global styles
  db/                 # index.ts (client), schema.ts, seed.ts, favorites-count.ts
  lib/                # auth.ts, social-providers.ts
  pkg/                # external-system glue: auth/, query/, theme/, locale/
  proxy.ts            # Next.js 16 route / auth / locale gating (single file)
```

The full architectural spec (layers, slices, segments, naming, data layer, auth, TanStack Query patterns) lives in the project skill at [.claude/skills/client-structure/](.claude/skills/client-structure/).

## Key Features Implemented

- **URL-synced pagination & team filtering** — the `/items` page reads `page`, `search`, and `team` straight from the URL; every control (paging, search box, team dropdown) is shareable, survives refresh, and stays in sync with the browser Back button.
- **User-scoped favorites** — authenticated users add/remove favorites that persist in Postgres and are never visible to other users; `/favorites` is route-protected.
- **`$count` aggregation for popularity badges** — each driver shows a live "times favorited" count computed via a Drizzle `$count` correlated sub-query, surfaced on the list, detail, and favorites views.
- **Optimistic updates in lockstep** — toggling a favorite instantly flips the button _and_ the popularity badge across all cached queries (items list, detail, favorites), rolling back together on error.
- **Better Auth (email/password + optional OAuth)** — session-based auth with GitHub & Google social sign-in available when configured.
- **App Router caching** — Server Components prefetch and hydrate TanStack Query state on the server, with client-side cache invalidation keeping the UI fresh without full reloads.
