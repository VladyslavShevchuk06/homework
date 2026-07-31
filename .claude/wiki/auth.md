# Auth

Better Auth over the same Drizzle/Postgres database, split into a server instance, a client adapter
and one gating file.

## Server instance — `src/lib/auth.ts`

`betterAuth({ ... })` with `drizzleAdapter(db, { provider: 'pg', schema })`. It passes the **whole**
schema module, so Better Auth's four tables (`user`, `session`, `account`, `verification` in
`src/db/schema.ts`) are the ones it manages directly — see [[database-and-migrations]].

Configured: email+password with `minPasswordLength: 8`, social providers, `basePath: '/api/auth'`,
and `secret` / `baseURL` / `trustedOrigins` from `envServer` (never raw `process.env`).

This file is app-specific and not liftable, which is why the `client-structure` skill records its
target home as `shared/systems/auth/` rather than a `pkg/` slot. The move has not happened yet.

## Client adapter — `src/pkg/auth/`

`createAuthClient` reading only `envClient`. Components use it for sign-in/out and session hooks.
Social sign-in is its own feature slice, `features/social-auth/`.

## OAuth providers are optional and self-disabling

`src/lib/social-providers.ts` builds the provider map by **conditional spread**: a provider is
included only when both its id and secret are present in `envServer`.

```ts
...(envServer.GITHUB_CLIENT_ID && envServer.GITHUB_CLIENT_SECRET
  ? { github: { clientId: …, clientSecret: … } }
  : {}),
```

It also exports `enabledSocialProviders` (the map's keys), so the UI renders only the buttons that
can actually work. Every OAuth credential is `z.string().optional()` in `config/env/env.server.ts`;
an unset provider is simply absent, not a build failure. `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
and `DATABASE_URL` are **not** optional.

The file starts with `import 'server-only'` — secrets cannot drift into a client graph.

## Sessions on the server

Server code reads the session from request headers, never from a client store:

```ts
const session = await auth.api.getSession({ headers: request.headers })
if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

Inside a server action or an RSC page the headers come from `await headers()` instead
(`favorites.action.ts`, `favorites/page.tsx`).

**Every user-scoped `(api)` handler performs this check itself.** This is not belt-and-braces: the
matcher in `src/proxy.ts` excludes `api`, so the gate provably did not run for an API request.

## Page gating — `src/proxy.ts`

One file owns every redirect. It strips the locale prefix first (`stripLocale`), then:

- `/favorites` with no session → redirect to `/login`
- `/login` or `/register` with a session → redirect to `/items`

Redirect targets are rebuilt with `localizedUrl(...)`, which re-adds the prefix only for non-default
locales (`localePrefix: 'as-needed'`). The `getSession` call is wrapped in try/catch and falls back
to `null`, so an auth outage degrades to "treated as guest" instead of a 500 on every page.

After gating, the same file does A/B bucketing (`AB_ID_COOKIE`, GrowthBook `isFeatureOn`) and
injects a variant search param, then delegates to `next-intl`'s middleware. The rewrite-upgrade
trick near the end exists because a prefixed-locale path resolves as a passthrough that would drop
the injected param.

`/api/auth/[...all]/route.ts` is one line — `export const { GET, POST } = toNextJsHandler(auth)` —
so every Better Auth endpoint (`sign-up/email`, `sign-in/email`, OAuth callbacks, …) is served
without per-endpoint code. [[testing]] drives sign-up/sign-in through exactly these URLs.

## Related

[[data-flow]] for where the session check sits in a request; [[architecture]] for the gate's place
in the request pipeline. Stack-level rules and the target folder move live in
`.claude/skills/client-structure/references/auth.md`.
