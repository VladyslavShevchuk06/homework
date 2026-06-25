# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **Next.js 16 (App Router) application** — an F1-drivers catalog with search, favorites, and authentication. Persistence is **PostgreSQL via Drizzle ORM**; auth is **Better Auth**; server state is **TanStack Query v5**. Code is organised under `src/app/` following Feature-Sliced Design (Layer/Slice/Segment).

## Architecture

The full architectural specification (Layer/Slice/Segment layout, naming conventions, data layer, auth, TanStack Query patterns, Mode A bootstrap, Mode B extension) lives in the project-local skill at [.claude/skills/client-structure/](.claude/skills/client-structure/). Invoke it with `/client-structure` when the task is "add a module / widget / feature / entity / shared segment", "register a route or route handler", "decide where a new file should live", or "audit this project against the pattern".

Two workflow skills sit on top of it (they defer all file shapes/placement to `client-structure`, never duplicate it):
- [.claude/skills/add-feature/](.claude/skills/add-feature/) (`/add-feature`) — the ordered DB → API → UI recipe for a brand-new entity (table + migration + seed → `entities/api` slice + query key → route handler → module + page → proxy gating). Use when wiring a new resource end-to-end.
- [.claude/skills/review-changes/](.claude/skills/review-changes/) (`/review-changes`) — project-tuned verification pass over a diff before declaring work done (FSD direction, `db.$count`, `EEntityKey` keys, `'use client'`/optimistic-invalidate, env access, `proxy.ts` gating). Complements `/code-review`.

## Commands

- `yarn dev` — local Next.js dev server.
- `yarn build` / `yarn start` — production build / serve.
- `yarn format` — type-check → lint --fix → prettier. Prefer this before declaring work done.
- `yarn db:generate` / `yarn db:push` / `yarn db:migrate` / `yarn db:studio` — Drizzle Kit schema workflow.
- `yarn seed` — populate the database from `src/db/seed.ts`.

## Hard rules

- Read process env only through `envClient` / `envServer` from [src/config/env/](src/config/env/), never `process.env` directly.
- Fetch data **only** through Drizzle ORM inside `(api)` route handlers — never the `supabase-js` client.
- Use `db.$count(...)` for aggregate counts (avoids N+1); never count in application code over a fetched list.
- OAuth provider secrets are **optional** Zod env vars — an unset provider is simply disabled, not a build error.
- Route gating lives in one file, `src/proxy.ts` (Next.js 16) — page protection there, API auth enforced in each handler.
