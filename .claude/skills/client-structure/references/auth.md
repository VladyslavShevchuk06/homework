# Auth (Better Auth)

Authentication is handled by **Better Auth** over the same Drizzle/Postgres database. There are two halves — a server instance and a client adapter — plus one route-gating file.

## Server instance

The server singleton is created with `betterAuth(...)` and the Drizzle adapter, and lives in `src/lib/auth.ts`:

```ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  socialProviders: { github: { ... }, google: { ... } },
  secret: envServer.BETTER_AUTH_SECRET,
  baseURL: envServer.BETTER_AUTH_URL,
  basePath: '/api/auth',
})
```

`src/lib/` is the home for framework-level singletons that are wired to this project (the Better Auth server instance) and are **not** liftable as a standalone `pkg/` integration. The Better Auth tables are part of `src/db/schema.ts` and are passed straight into `drizzleAdapter`.

## Client adapter

The client lives in the `pkg/auth/` slot (`src/pkg/auth/auth.pkg.ts`), self-contained and reading only from `envClient`:

```ts
export const authClient = createAuthClient({ baseURL: envClient.NEXT_PUBLIC_APP_URL })
```

Components use `authClient` for sign-in/out and session hooks. Social sign-in is a feature slice (`features/social-auth/`) that calls `authClient.signIn.social({ provider, callbackURL })`.

## OAuth env vars are optional

Every OAuth credential is declared `z.string().optional()` on the server schema in `config/env/env.server.ts`:

```ts
GITHUB_CLIENT_ID: z.string().optional(),
GITHUB_CLIENT_SECRET: z.string().optional(),
GOOGLE_CLIENT_ID: z.string().optional(),
GOOGLE_CLIENT_SECRET: z.string().optional(),
```

A provider with unset credentials is simply disabled — the build does not fail. The server config falls back to empty strings (`envServer.GITHUB_CLIENT_ID ?? ''`) so an absent provider stays inert rather than throwing. Required auth vars (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DATABASE_URL`) are **not** optional.

## Sessions on the server

Server code reads the session from request headers — never from a client store:

```ts
const session = await auth.api.getSession({ headers: request.headers })
if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

Every `(api)` handler that touches user-scoped data performs this check itself; it does not rely on the route gate to have run.

## Route protection (`src/proxy.ts`)

Next.js 16 replaces `src/middleware.ts` with **`src/proxy.ts`** — the same edge-gating role, exporting a `proxy` function plus a `config` matcher:

```ts
export async function proxy(request: NextRequest) { ... }
export const config = { matcher: ['/favorites', '/api/favorites/:path*', '/login', '/register'] }
```

All page-route gating lives in this one file: it calls `auth.api.getSession(...)` and redirects (auth-only pages send guests to `/login`; guest-only pages send authenticated users away). API auth is **not** delegated here — each handler enforces its own session check, so `/api/*` paths fall through `proxy.ts` to the handler. Keep every gate rule in `proxy.ts`; do not scatter redirects across pages.
