---
name: review-changes
description: Use when reviewing a diff/PR in this repo before declaring work done — runs THIS project's structural + correctness invariants over the change (FSD layer direction, TanStack Query keys/`'use client'`/optimistic-invalidate, Drizzle-only data access, `db.$count`, env via `envClient`/`envServer`, route gating in `src/proxy.ts`, optional OAuth secrets). Trigger it after editing `entities/api/*`, `src/db/schema.ts`, a `(api)` route handler, `src/proxy.ts`, or `config/env/*`, and as the final pass before saying a change is complete. Skip for generic non-project review (use `/code-review`) and for security audits (use `/security-review`).
---

# review-changes

A **project-tuned review pass over a diff/PR** for this Next.js 16 + Drizzle + Better Auth + TanStack Query repo. It complements the generic `/code-review` by knowing THIS repo's specific rules and where they bite. Given a set of changes, it scopes the diff, picks the relevant check-groups by what was touched, and runs the project's invariants in a diff-aware form.

This is **not** a generic bug hunter (use `/code-review`) and **not** a security audit (use `/security-review`).

## Source of truth (read this first)

The canonical structural invariants live in `.claude/skills/client-structure/spec/invariants.spec.md` and `.claude/skills/client-structure/spec/per-action.spec.md`. **That is the law.** This skill does not restate it as new law — `references/checklist.md` is a diff-aware *run* of those same rules, and `spec/review.spec.md` adds only the few **net-new diff-aware** MUSTs not already in client-structure. When in doubt about a structural rule, open client-structure's spec.

## Procedure

1. **Get the diff.** `git diff` (unstaged), `git diff --staged`, or `git diff <base>...HEAD` for a branch/PR. Read the changed files, not just the hunks — a rule can be violated by a line that wasn't touched (e.g. an `onMutate` added without an `onSettled`).
2. **Scope by what changed** using the table below — only run the check-groups whose trigger paths appear in the diff.
3. **Run the checks.** For each selected group, apply the matching block in `references/checklist.md` (project rules, diff-aware) and `spec/review.spec.md` (net-new diff MUSTs). Use the `Check:` grep hints.
4. **Run the build gate.** `yarn format` (type-check → lint --fix → prettier) must pass before declaring done. Package manager is **yarn**, never npm.
5. **Report** violations as `file:line → rule → fix`, citing the source-of-truth rule.

## What changed → which checks to run

| Touched in the diff | Run these check-groups |
|---|---|
| `src/app/entities/api/**` (`*.api.ts` / `*.query.ts` / `*.mutation.ts`) | query-key from `EEntityKey`; `'use client'` on `*.mutation.ts` only; optimistic `onMutate` ⇒ `onSettled` invalidate; no `useQuery`/`useMutation`/`queryOptions` outside this folder |
| `src/db/schema.ts` | a migration was generated (`yarn db:generate` → new file in `drizzle/`); `src/db/seed.ts` still matches the schema; counts use `db.$count` |
| any `(api)` route handler (`route.ts`) | data via Drizzle (`db` from `@/db`), never `@supabase/supabase-js`; user-scoped handlers call `auth.api.getSession({ headers })`; env via `config/env/` |
| `src/proxy.ts` | a new private/guest path is in BOTH the gating logic AND `config.matcher`; all page gating stays in this one file; `process.env.NODE_ENV` is the only `process.env` allowed here |
| `src/config/env/**` | new var declared in the Zod schema AND wired in `runtimeEnv`; `NEXT_PUBLIC_*` on `envClient`, secrets on `envServer`; OAuth `*_CLIENT_SECRET` is `.optional()` |
| anything reading config | consumed via `envClient` / `envServer`, never raw `process.env` |
| any new slice/segment file (module/widget/feature/entity/shared/`pkg`) | structural placement, barrels, import direction — defer to `client-structure` `/client-structure` and its `spec/per-action.spec.md` |

## Self-verification

After scoping a diff, confirm the change against:
1. **`references/checklist.md`** — the diff-aware run of the project rules (mirrors `client-structure/spec`).
2. **`spec/review.spec.md`** — the net-new diff-aware MUSTs (optimistic⇒invalidate, new private route in `proxy` matcher, new env var declared + consumed).
3. **`client-structure/spec/invariants.spec.md` + the matching `per-action` block** — the canonical structural law, for any new slice/segment.

Then run `yarn format` and confirm it passes.

## Common mistakes

| Mistake | Reality |
|---|---|
| Treating this skill as the rule source | It is a review *procedure*; the law is `client-structure/spec`. |
| Reviewing only the changed hunks | A missing `onSettled` or unregistered matcher entry is an *absence* — read the whole changed file. |
| Adding `'use client'` to a new `*.api.ts`/`*.query.ts` | Only `*.mutation.ts` carries it; api/query stay server-composable. |
| New env var read via `process.env` | Declare it in the Zod schema, consume via `envClient`/`envServer`. |
| New `schema.ts` change with no migration | `yarn db:generate` must produce a file under `drizzle/`. |
| Running this for a security or generic bug review | Use `/security-review` or `/code-review` instead. |

## Resources

This SKILL is the router: it decides which resource to open. The resource sets are **independent** — they do not reference one another. This skill intentionally has **no `examples/`** (it reviews existing code rather than scaffolding new files; canonical file shapes live in `client-structure/examples/`).

| Situation | Open |
|---|---|
| Running the project rules over a diff, group by group, with grep hints | `references/checklist.md` |
| Confirming the net-new diff-aware MUSTs (optimistic⇒invalidate, proxy matcher, env declare+consume) | `spec/review.spec.md` |
| The canonical structural law behind every check | `.claude/skills/client-structure/spec/invariants.spec.md` + `per-action.spec.md` |
