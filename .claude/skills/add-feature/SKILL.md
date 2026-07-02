---
name: add-feature
description: Use when adding a new end-to-end domain feature/entity that spans DB → API → UI in this Next.js 16 + Drizzle + Better Auth + TanStack Query app — i.e. a new table + migration + seed, a new entities/api slice with a query key, a route handler, plus a module and page. Use when the request is "add a <thing> feature", "wire a new resource from database to screen", or "add CRUD for a new entity". Skip for changes inside an existing slice, adding a lone module/widget/feature with no new data (use client-structure), or pure UI tweaks.
---

# add-feature

The ordered, cross-boundary recipe for adding **one new domain feature/entity** that runs the full stack: a Drizzle table → migration → seed → `entities/models` types → `entities/api` slice (api + query + mutation) → an `EEntityKey` query key → an `(api)` route handler → a `modules/` component → a thin `(web)` page → `proxy.ts` gating. This skill **orchestrates the sequence and the connective tissue that no single layer owns** (DB workflow, query-key registration, hydration wiring). It is a workflow skill, not a structure skill.

## Relationship to `client-structure` (read this first)

This skill does **not** re-document where files live, their shapes, layer rules, or naming. All of that is owned by the sibling skill `.claude/skills/client-structure/`. This skill only adds the **end-to-end ordering** plus the few steps `client-structure` describes per-layer but never sequences (schema → `db:generate` → seed → query-key enum → hydration).

For each step below, the **file shape and placement come from `client-structure`** — this skill points there rather than copying:

| You need… | Open in `client-structure` |
|---|---|
| Where a model / api / query / mutation / module / route / page file goes + its shape | `examples/` and `references/structure.md` |
| Drizzle / `db.$count` / persistence rules | `references/data-layer.md` |
| Query keys / `keepPreviousData` / optimistic mutation flow | `references/state-management.md` |
| Better Auth session checks / `proxy.ts` gating | `references/auth.md` |
| Global structural invariants (barrels, import direction, naming, env) | `spec/invariants.spec.md` |

> Anatomy deviation (justified): a workflow skill has no canonical tree, no per-layer placement rules, and no global invariants of its own — those belong to `client-structure`. So this skill ships **no `references/structure.md`** and **no `spec/invariants.spec.md`**; it carries one ordered `references/recipe.md`, only the net-new connective `examples/`, and one `spec/per-action.spec.md` (`+feature`). Global structural verification is delegated to `client-structure/spec/invariants.spec.md`.

## The recipe (ordered skeleton)

Build bottom-up (data first) so each layer can import the one below it as it is created. Full reasoning, commands, and cross-boundary notes are in `references/recipe.md`.

1. **DB shape** — add the table to `src/db/schema.ts` (uuid PK `.defaultRandom()`, FKs `.references(… { onDelete: 'cascade' })` to `user`/owning tables, indexes for filtered/ordered columns). Better Auth tables are off-limits.
2. **Migration** — `yarn db:generate` to emit SQL into `drizzle/`, then `yarn db:migrate` (or `yarn db:push` for throwaway local iteration). See recipe for generate vs push vs migrate.
3. **Seed** — extend `src/db/seed.ts` so the new table has demo rows (respect unique constraints / slug de-duping).
4. **Types** — add `src/app/entities/models/<entity>.model.ts` (`I<Entity>`, params/response interfaces); re-export from the models barrel.
5. **Query key** — add a new value to `EEntityKey` in `src/app/shared/interfaces/entities.interface.ts` (single source of cache keys).
6. **Api slice** — add `src/app/entities/api/<api>/` (`<api>.api.ts` raw fetchers, `<api>.query.ts` `queryOptions` keyed off `EEntityKey` with `keepPreviousData` for lists, `<api>.mutation.ts` `'use client'` optimistic + `onSettled` invalidate). Shapes live in `client-structure/examples`.
7. **Route handler** — add `src/app/(api)/api/<route>/route.ts` querying via Drizzle, `db.$count(...)` for aggregates, and `auth.api.getSession({ headers })` guarding user-scoped verbs.
8. **UI** — add `src/app/modules/<module>/` and a thin `src/app/(web)/<route>/page.tsx` that `prefetchQuery`s the query options and wraps the module in `<HydrationBoundary>`.
9. **Gating** — if the route/page is private, add its path to `src/proxy.ts` (page gate in proxy; API auth stays in the handler).

## Hard rules (feature-specific)

These are the cross-boundary invariants this skill owns. (Layer/import/barrel/env rules belong to `client-structure`.)

1. **Build data-first.** Schema → migration → seed must land before the api slice; the api slice before the route handler; the route handler before the page that prefetches it.
2. **One query key per resource, in `EEntityKey`.** Never inline a string cache key — add an `EEntityKey.*` value and reference it from both `<api>.query.ts` and any mutation that invalidates it.
3. **Migration is generated, never hand-edited.** `drizzle/*` is a derived artifact from `yarn db:generate`; change `schema.ts` and regenerate.
4. **User-scoped reads/writes call `auth.api.getSession({ headers })` in the handler.** Page-level gating additionally goes in `proxy.ts`; never rely on the proxy alone for API auth.
5. **Aggregate counts use `db.$count(...)`** (correlated sub-select), never a `.length` over a fetched list.

## Modes

- **`+feature` (the only mode)** — run steps 1→9 in order. Skip a step only when the feature genuinely lacks that concern (e.g. no mutation for a read-only resource, no `proxy.ts` change for a public route).

## Self-verification

After running the recipe, verify in two places:
1. **This skill** — `spec/per-action.spec.md`, the `+feature` block: every cross-boundary MUST (schema ↔ migration ↔ seed ↔ query key ↔ route ↔ page wiring).
2. **`client-structure/spec/invariants.spec.md`** — the global structural invariants (barrels, import direction, naming/suffixes, env, layer purity) for every file you created. This skill deliberately does not duplicate them.

## Common mistakes

| Mistake | Reality |
|---|---|
| Hand-editing a file in `drizzle/` | It is generated — edit `schema.ts`, rerun `yarn db:generate`. |
| Inlining a string query key (`['my-thing']`) | Add an `EEntityKey.*` value; reference it from query + mutation. |
| Counting in app code (`rows.length`) for an aggregate | Use `db.$count(...)` correlated sub-select. |
| Trusting `proxy.ts` for API auth | Proxy gates pages; each user-scoped handler must call `getSession`. |
| Building the page before the api slice / the api slice before the table | Build data-first (steps 1→9); each layer imports the one below it. |
| Forgetting to seed the new table | Add rows in `src/db/seed.ts` so `yarn seed` populates it. |
| Re-documenting file placement here | Defer to `client-structure` — this skill only orders the steps. |

## Resources

This SKILL is the router. The recipe (knowledge) and the spec (verification) are independent — they do not reference each other.

| Situation | Open |
|---|---|
| The detailed ordered procedure with cross-boundary reasoning | `references/recipe.md` |
| The net-new connective snippets (schema table, `EEntityKey` add, route handler, prefetch page) | `examples/` |
| Verifying the end-to-end wiring after the change | `spec/per-action.spec.md` (`+feature`) |
| Where each individual file lives / its full shape | `client-structure` (`references/structure.md`, `examples/`) |
| Global structural invariants for the files you created | `client-structure/spec/invariants.spec.md` |

- **`references/recipe.md`** — the step-by-step DB → API → UI procedure and the reasoning between boundaries.
- **`examples/`** — only the connective snippets not templated in `client-structure/examples` (schema addition, enum addition, count+session handler, prefetch page). Everything else points to `client-structure/examples`.
- **`spec/per-action.spec.md`** — the single `+feature` checklist with `Check:` hints.
