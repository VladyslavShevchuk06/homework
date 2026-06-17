# F1 Drivers Catalog

A full-stack **Next.js 16** application that catalogs all 22 Formula 1 drivers from the 2026
season. Visitors can browse the grid and view driver details; authenticated users get their
own **user-scoped favorites** that persist in the database and are never visible to other users.

## Tech Stack

- **Next.js 16** (App Router, React Server Components)
- **Drizzle ORM** + Drizzle Kit
- **Supabase** (PostgreSQL)
- **Better Auth** (email + password)
- **TanStack Query v5** (client data fetching, optimistic updates)
- **react-hook-form** (form state & validation)
- **Tailwind CSS / shadcn/ui** (styling & UI components)
- **TypeScript**

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (for the PostgreSQL database)

### Step 1 — Install dependencies

```bash
yarn install
```

### Step 2 — Environment setup

Copy the example env file and fill in your own values:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

- `DATABASE_URL` — your Supabase Postgres connection string
- `BETTER_AUTH_SECRET` — a random string, **at least 32 characters** (e.g. `openssl rand -base64 32`)
- `BETTER_AUTH_URL` — `http://localhost:3000`
- `NEXT_PUBLIC_APP_URL` — `http://localhost:3000`

### Step 3 — Database setup

Push the Drizzle schema directly to your Supabase database:

```bash
yarn db:push
```

This creates all tables (`items`, `favorites`, and the Better Auth tables). Alternatively,
generate SQL migration files and apply them:

```bash
yarn db:generate   # generate migration files from the schema
yarn db:migrate    # apply them to the database
```

### Step 4 — Seed the database

Populate the catalog with the 22 F1 drivers:

```bash
yarn seed
# or: npx tsx --env-file=.env.local src/db/seed.ts
```

### Step 5 — Run the app

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `yarn dev` — Start the development server on port 3000
- `yarn build` — Build for production
- `yarn start` — Start the production server
- `yarn type-check` — Run TypeScript type checking
- `yarn lint` — Run ESLint
- `yarn format` — Type-check + lint --fix + Prettier
- `yarn db:push` — Push the Drizzle schema to the database
- `yarn db:migrate` — Run migrations
- `yarn db:studio` — Open Drizzle Studio
- `yarn seed` — Seed the database with 22 F1 drivers

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (web)/             # Public routes
│   │   ├── items/         # List & detail pages
│   │   ├── favorites/     # User favorites (protected)
│   │   ├── login/         # Login form
│   │   └── register/      # Registration form
│   ├── (api)/             # API routes
│   │   └── api/           # Route handlers
│   ├── modules/           # Page-level modules
│   ├── features/          # UI features (buttons, toggles, etc.)
│   └── entities/          # Domain entities (API, models)
├── config/                # Configuration
│   ├── env/              # Environment variable validation
│   ├── fonts/            # Font configuration
│   └── styles/           # Global styles
├── db/                    # Database
│   ├── schema.ts         # Drizzle schema (items, favorites, auth tables)
│   ├── index.ts          # DB client
│   └── seed.ts           # Seed script
├── lib/                   # Server utilities
│   └── auth.ts           # Better Auth configuration
├── pkg/                   # Reusable packages
│   ├── theme/            # Theme utilities (cn)
│   ├── auth/             # Auth client
│   └── query/            # Query client setup
└── proxy.ts              # Route protection for /favorites
```

## Features

- ✅ Browse all 22 F1 drivers from a public list
- ✅ View detailed information for each driver
- ✅ Register and login with email + password
- ✅ Save favorite drivers (authenticated users only)
- ✅ View a personal favorites list
- ✅ Real-time UI updates with TanStack Query
- ✅ Optimistic updates when adding/removing favorites
- ✅ Full TypeScript support
- ✅ Responsive design with Tailwind CSS

## Definition of Done

- [x] List renders from Supabase via Drizzle
- [x] Click driver → `/items/[slug]` with full details
- [x] Unauthenticated users redirected from `/favorites` to `/login`
- [x] Authenticated users can add/remove from favorites
- [x] Favorites persist in the database
- [x] Different users cannot see each other's favorites
- [x] Registration & login working
- [x] Session persists across page reloads
- [x] UI updates without full page reload (TanStack Query)
- [x] Forms validate input and show errors
- [x] `.env.example` provided, secrets not committed

## Development Notes

- All environment variables are required and validated (`@t3-oss/env-nextjs`) before the app runs.
- `proxy.ts` handles `/favorites` route protection.
- Better Auth auto-generates the `user`, `session`, `account`, and `verification` tables.
- The seed script initializes the database with the 22 F1 drivers from the 2026 season grid.
- All database access uses Drizzle ORM (no raw SQL).
