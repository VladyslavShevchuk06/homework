# F1 Drivers Catalog

A full-stack **Next.js 16** application demonstrating modern App Router features, Drizzle ORM, Supabase, Better Auth, and TanStack Query v5 pagination/optimistic updates. It catalogs the 2026 Formula 1 grid: anyone can browse drivers, search, and filter by team, while authenticated users get their own private list of favorite drivers with live "popularity" counts.

## Tech Stack

- **Next.js 16** — App Router, React Server Components
- **Drizzle ORM** — type-safe schema, queries, and migrations
- **Supabase** — managed PostgreSQL
- **Better Auth** — email/password + OAuth (GitHub, Google)
- **TanStack Query v5** — server-state, pagination, optimistic updates
- **react-hook-form** — form state & validation
- **Tailwind CSS** — styling
- **shadcn/ui** — UI component patterns

## Getting Started (Step-by-Step for the Reviewer)

> **Prerequisites:** Node.js 18+, Yarn, and a Supabase (or any PostgreSQL) database. All commands use **Yarn** — please do not substitute `npm`.

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

| Variable | Required | What to set |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Connection string for **your own** Supabase/Postgres instance. |
| `BETTER_AUTH_SECRET` | ✅ | Any random string of **32+ characters** (e.g. `openssl rand -base64 32`). |
| `BETTER_AUTH_URL` | ✅ | Leave as `http://localhost:3000`. |
| `NEXT_PUBLIC_APP_URL` | ✅ | Leave as `http://localhost:3000`. |

> ### ⚠️ Note for the Reviewer — OAuth is OPTIONAL
>
> The four OAuth variables (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) are **completely optional**.
>
> **The app boots and standard Email/Password authentication works perfectly without them.** You only need to fill these in if you specifically want to exercise the "Sign in with GitHub / Google" flow. Leaving them empty has no effect on the rest of the application.

### Step 3 — Database Setup

Push the Drizzle schema to your database, then seed the 22 F1 drivers:

```bash
# 1. Create all tables (items, favorites, and the Better Auth tables)
yarn db:push

# 2. Seed the catalog with the 22 drivers of the 2026 F1 grid
yarn seed
```

> The seed script is `yarn seed` (defined in `package.json`). If you prefer SQL migration files over a direct push, you can instead run `yarn db:generate` followed by `yarn db:migrate`.

### Step 4 — Run the Application

```bash
yarn dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

## Key Features Implemented

- **URL-synced pagination & team filtering** — the `/items` page reads `page`, `search`, and `team` straight from the URL; every control (paging, search box, team dropdown) is shareable, survives refresh, and stays in sync with the browser Back button.
- **User-scoped favorites** — authenticated users add/remove favorites that persist in Postgres and are never visible to other users; `/favorites` is route-protected.
- **`$count` aggregation for popularity badges** — each driver shows a live "times favorited" count computed via a Drizzle `$count` correlated sub-query, surfaced on the list, detail, and favorites views.
- **Optimistic updates in lockstep** — toggling a favorite instantly flips the button *and* the popularity badge across all cached queries (items list, detail, favorites), rolling back together on error.
- **Better Auth (email/password + optional OAuth)** — session-based auth with GitHub & Google social sign-in available when configured.
- **App Router caching** — Server Components prefetch and hydrate TanStack Query state on the server, with client-side cache invalidation keeping the UI fresh without full reloads.
