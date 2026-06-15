# F1 Catalog — Next.js 16 Full-Stack App

A full-stack catalog application featuring all 22 F1 drivers from the 2026 season. Built with Next.js 16, Supabase, Drizzle ORM, Better Auth, TanStack Query, and Tailwind CSS + shadcn UI.

## Setup

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Supabase account (for PostgreSQL database)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase PostgreSQL connection string and Better Auth secret:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   BETTER_AUTH_SECRET=your-random-32-char-secret-here
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Create database schema and tables:**
   ```bash
   npm run db:push
   ```

4. **Seed the database with 22 F1 drivers:**
   ```bash
   npm run seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` — Start development server on port 3000
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run type-check` — Run TypeScript type checking
- `npm run lint` — Run ESLint checks
- `npm run format` — Format code (type-check + lint + prettier)
- `npm run db:push` — Push schema to Supabase database
- `npm run db:migrate` — Run migrations
- `npm run db:studio` — Open Drizzle Studio for DB inspection
- `npm run seed` — Seed database with 22 F1 drivers

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Drizzle ORM + Drizzle Kit
- **Auth:** Better Auth (email + password)
- **Data Fetching:** TanStack Query v5
- **Forms:** react-hook-form
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Language:** TypeScript

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
│   ├── env/              # Environment variables
│   ├── fonts/            # Font configuration
│   └── styles/           # Global styles
├── db/                    # Database
│   ├── schema.ts         # Drizzle schema (items, favorites)
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

- ✅ Browse all 22 F1 drivers from public list
- ✅ View detailed information for each driver
- ✅ Register and login with email + password
- ✅ Save favorite drivers (authenticated users only)
- ✅ View personal favorites list
- ✅ Real-time UI updates with TanStack Query
- ✅ Optimistic updates when adding/removing favorites
- ✅ Full TypeScript support
- ✅ Responsive design with Tailwind CSS

## Definition of Done

- [x] List renders from Supabase via Drizzle
- [x] Click driver → `/items/[id]` with full details
- [x] Unauthenticated users redirected from `/favorites` to `/login`
- [x] Authenticated users can add/remove from favorites
- [x] Favorites persist in database
- [x] Different users cannot see each other's favorites
- [x] Registration & login working
- [x] Session persists across page reloads
- [x] UI updates without full page reload (TanStack Query)
- [x] Forms validate input and show errors
- [x] `.env.example` provided, secrets not committed

## Development Notes

- All environment variables are required before running the app
- The proxy.ts file handles `/favorites` route protection
- Better Auth auto-generates user/session/account tables
- Seed script initializes database with 22 F1 drivers (2026 season grid)
- All database queries use Drizzle ORM (no raw SQL)
