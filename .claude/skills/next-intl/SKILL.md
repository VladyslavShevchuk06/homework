---
name: next-intl
description: Use when touching anything localized in this Next 16 App Router app — adding a translated server or client component, a `useTranslations`/`getTranslations` call, a new locale or message namespace, a locale-aware link/redirect/router push, a route under `src/app/(web)/[locale]/`, or changing the locale wiring in `src/pkg/locale/` or `src/proxy.ts`. Also use when debugging "the context from NextIntlClientProvider was not found", translations rendering as raw keys, `MISSING_MESSAGE` errors, a locale switcher that loses its selection or doubles the locale segment (`/uk/uk/items`), or a page that lost static rendering after a translation change. Skip for copy-only edits inside an existing `translations/*.json` value, and for non-localized paths (`/api/*`, `_next`, static files).
---

# next-intl on Next 16 App Router

Localization runs on `next-intl` 4.13 in a **stock Next.js 16 App Router** app on Node — the
official `createNextIntlPlugin()` wiring, catalogs bundled through a dynamic `import()`, and
`cacheComponents: true` turned on. Two locales: `en` (default, unprefixed) and `uk`.

All locale logic lives in the `src/pkg/locale/` slot. Everything else imports from that slot's
barrel, never from `next-intl/routing`, `next-intl/navigation`, or `next-intl/middleware` directly.

## Layout

```
src/pkg/locale/                # the i18n slot — the only place next-intl internals are imported
├── routing.ts                 # defineRouting() — locales ['en','uk'], defaultLocale 'en', localePrefix 'as-needed'
├── navigation.ts              # createNavigation(routing) — Link, redirect, usePathname, useRouter, getPathname
├── request.ts                 # getRequestConfig() — SERVER ONLY, referenced by next.config.ts, NOT in the barrel
├── locale.d.ts                # augments next-intl AppConfig (Locale, Messages) off translations/en.json
└── index.ts                   # client-safe barrel — exports routing + navigation only
translations/en.json           # the type source; 12 top-level namespaces
translations/uk.json           # same namespace set
next.config.ts                 # withNextIntl = createNextIntlPlugin('./src/pkg/locale/request.ts')
src/proxy.ts                   # createMiddleware(routing) + auth gating + experiment-variant injection
src/app/(web)/[locale]/        # the localized route tree; layout.tsx owns <html lang> and the provider
```

## Hard rules

1. **The slot is the only door.** `next-intl/routing`, `next-intl/navigation` and
   `next-intl/middleware` are imported in `src/pkg/locale/*` and `src/proxy.ts` and nowhere else.
   Application code imports `routing`, `Link`, `redirect`, `usePathname`, `useRouter`,
   `getPathname` from `@/pkg/locale`.
2. **`request.ts` stays out of the barrel.** `index.ts` is the client-safe surface;
   `request.ts` is reached only by `createNextIntlPlugin('./src/pkg/locale/request.ts')` in
   `next.config.ts`. Never re-export it and never import it from a component.
3. **Keep the plugin wiring in `next.config.ts`.** `createNextIntlPlugin(...)` is the correct
   and required setup here — it is what makes `getTranslations`/`useTranslations` resolve the
   request config. Do not replace it with a bundler alias.
4. **Every localized route lives under `src/app/(web)/[locale]/`.** The `[locale]` layout
   validates with `hasLocale(routing.locales, locale)` → `notFound()`, calls
   `setRequestLocale(locale)`, and renders `<html lang={locale}>`. A page adds only its own
   metadata and data fetching.
5. **`setRequestLocale` before rendering, `generateStaticParams` over `routing.locales`.**
   Both are what keep the tree statically renderable under `cacheComponents: true`. Removing
   either silently downgrades pages to dynamic rendering.
6. **The root provider passes the FULL `messages` object — deliberately.** With
   `cacheComponents: true`, handing `NextIntlClientProvider` the resolved messages is what lets
   client translations prerender statically. Do not "optimise" it to `messages={null}` or
   per-subtree picking; that pattern belongs to bundle-constrained runtimes (Workers), not here,
   and here it would break static prerendering of every client component. With 12 namespaces and
   2 locales the payload cost is not the binding constraint.
7. **Both catalogs carry the same namespace set.** `translations/en.json` is the type source
   (`locale.d.ts` types `Messages` off it), so a key added only to `uk.json` is invisible to the
   type system, and a key added only to `en.json` renders `MISSING_MESSAGE` on `/uk`. There is no
   English-fallback merge in this setup — add the key to **both** files.
8. **Navigate with the slot's `Link`/`useRouter`, not `next/link`.** The slot versions carry the
   locale prefix. Hand-building `locale === routing.defaultLocale ? '/x' : `/${locale}/x`` is the
   same logic duplicated — use `getPathname` or the slot `Link` instead.

## Imports

| Need | Import |
|---|---|
| Routing config (`locales`, `defaultLocale`) | `import { routing } from '@/pkg/locale'` |
| Locale-aware links & navigation | `import { Link, redirect, usePathname, useRouter, getPathname } from '@/pkg/locale'` |
| Translations in a client component | `import { useTranslations, useLocale, useFormatter } from 'next-intl'` |
| Translations in a server component | `import { getTranslations, getMessages, setRequestLocale } from 'next-intl/server'` |
| Locale validation / type | `import { hasLocale, type Locale } from 'next-intl'` |

`Locale` is next-intl's own augmented type (from `locale.d.ts`) — use it instead of a bare
`string` for a `params.locale` that has already been validated.

## Recipes

### Translate a server component

1. Add the key to **both** `translations/en.json` and `translations/uk.json`, under an existing
   top-level namespace or a new one.
2. `const t = await getTranslations('<Namespace>')` and render `t('key')`.
3. Nothing to register — the request config resolves through the plugin.

For metadata, use the explicit-locale form, because `generateMetadata` runs outside the render
where the request locale is set:

```ts
const { locale } = await props.params
const t = await getTranslations({ locale, namespace: 'Metadata' })
```

### Translate a client component

1. Add the keys to both catalogs.
2. `'use client'` + `const t = useTranslations('<Namespace>')`.
3. Nothing else — the `[locale]` layout's provider already carries every namespace (hard rule 6).
   Do **not** add another `NextIntlClientProvider`; a nested one would need its own messages and
   is how "the context was not found" / raw-key bugs get introduced.

### Add a localized route

1. Create `src/app/(web)/[locale]/<route>/page.tsx`. No barrel — route folders are a framework
   convention, and per `client-structure` a routing file declares nothing of its own: it reads
   `params`/`searchParams`, may prefetch, and renders one module.
2. Let the `[locale]` layout own `<html>`, `lang`, validation and the provider.
3. Link to it with `Link` from `@/pkg/locale`.
4. If the route must be gated, add the rule to `src/proxy.ts` — never scatter redirects into pages.

### Add a namespace

1. Add the namespace object to `translations/en.json` **first** — `locale.d.ts` types the whole
   message surface off it, so keys are only autocompleted and type-checked once they are there.
2. Mirror it in `translations/uk.json` with the same key set.
3. Consume it per the server or client recipe above.

### Add a locale

1. Create `translations/<locale>.json` with the complete namespace set from `en.json`.
2. Add the segment to `locales` in `src/pkg/locale/routing.ts`.
3. Add it to the locale switcher's options (`src/app/shared/components/ui/locale-switcher.component.tsx`)
   and to the `LocaleSwitcher` namespace in both catalogs if the label is translated.
4. `generateStaticParams` and `proxy.ts` read `routing.locales`, so they need no edit.
5. Verify per the checklist below, including a request to `/<segment>`.

## Self-verification

```bash
yarn format          # type-check → lint --fix → prettier
yarn build           # must succeed; watch for pages dropping to dynamic rendering
yarn test:e2e        # Playwright — needs yarn db:migrate:test && yarn seed:test first
```

MUST hold before calling the work done:

- [ ] `yarn format` passes — a missing key in `en.json` is a **type error**, so this is the real check.
- [ ] Every namespace/key touched exists in **both** `translations/en.json` and `uk.json` with the
      same shape.
- [ ] `/` (en, unprefixed) and `/uk/...` both render translated text, no raw keys, no
      `MISSING_MESSAGE` in the console.
- [ ] Switching locale keeps exactly one locale segment in the URL and the switcher shows the
      current locale.
- [ ] No new `NextIntlClientProvider` was introduced below the `[locale]` layout.
- [ ] `next-intl/routing|navigation|middleware` is still imported only inside `src/pkg/locale/`
      and `src/proxy.ts`:
      `grep -rn "next-intl/\(routing\|navigation\|middleware\)" src | grep -v "src/pkg/locale\|src/proxy.ts"` → empty.
- [ ] `request.ts` is still absent from `src/pkg/locale/index.ts`.

## Common mistakes

| Mistake | Reality |
|---|---|
| Setting the root provider to `messages={null}` and picking per subtree | That is a bundle-size pattern for constrained runtimes. Here it breaks static prerendering of client translations under `cacheComponents: true`. |
| Adding a nested `NextIntlClientProvider` "to be safe" | The layout already provides every namespace. A nested provider with partial messages is how raw keys and "context not found" appear. |
| Adding a key only to `en.json` | Renders `MISSING_MESSAGE` on `/uk` — there is no English fallback merge in this setup. |
| Adding a key only to `uk.json` | Invisible to the type system: `Messages` is typed off `en.json`, so `t('key')` fails type-check. |
| `import Link from 'next/link'` for an internal route | Drops the locale prefix. Use `Link` from `@/pkg/locale`. |
| Hand-building the prefix (`locale === routing.defaultLocale ? … : `/${locale}/…``) | Re-implements the slot. Use `getPathname` or the slot `Link`. |
| Importing `request.ts` from a component or re-exporting it from the barrel | It is server-only and belongs to the plugin wiring, not the app surface. |
| Dropping `setRequestLocale(locale)` or `generateStaticParams` | No error — pages just stop rendering statically. |
| Replacing the plugin with a bundler alias | The plugin is the supported wiring on real Next.js; the alias trick exists only where `next` is not a real package. |
| Putting a helper, constant or interface in `(web)/[locale]/page.tsx` | Routing files declare nothing of their own — move it into the module (`client-structure` hard rule 1). |
| Gating a route inside the page | All route gating lives in `src/proxy.ts`. |
