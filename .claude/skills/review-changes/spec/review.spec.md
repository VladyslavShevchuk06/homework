# Spec: net-new diff-aware review MUSTs

Declarative `MUST` checks that are **specific to reviewing a diff** and are NOT already stated in `client-structure/spec`. The canonical structural invariants stay there; this file adds only the few rules that are framed around *a change being introduced*. Each is a `MUST` / `MUST NOT` with a `Check:` hint — read and confirm, no script.

This spec is self-contained. After scoping a diff, run these alongside the canonical `client-structure/spec` blocks (SKILL.md's Self-verification section routes you to both).

## Optimistic mutations

- A diff that introduces an optimistic write (`onMutate` calling `setQueryData` / `setQueriesData`) **MUST** also introduce a matching `onSettled` that calls `invalidateQueries` for every cache key it touched.
  Check: in the changed mutation, count the keys mutated in `onMutate`; each appears in an `onSettled` `invalidateQueries`. An added `onMutate` with no `onSettled` invalidate is a defect.
- Such a diff **MUST** also restore the snapshot in `onError`.
  Check: the changed mutation snapshots in `onMutate` and the `onError` handler restores it.

## Route gating

- A diff that introduces a new private (auth-only) or guest-only page route **MUST** add that path to BOTH the gating logic and `config.matcher` in `src/proxy.ts` — never one without the other.
  Check: a path added to a redirect branch also appears in `config.matcher`; a path added to `config.matcher` for gating also has a branch. An orphaned matcher entry or an unmatched gate is a defect.
- A diff **MUST NOT** add page-route gating outside `src/proxy.ts`.
  Check: no new session/redirect gating logic appears in pages, layouts, or modules in the diff.

## Environment variables

- A diff that introduces a new env var **MUST** declare it in the Zod schema of `env.client.ts` / `env.server.ts` AND wire it into that file's `runtimeEnv`, AND every consumer **MUST** read it via `envClient` / `envServer`.
  Check: the new var name appears in the schema object, in `runtimeEnv`, and `grep -Rn "process.env.<NEW_VAR>" src` (outside `config/env/`) returns nothing.
- A new `NEXT_PUBLIC_*` var **MUST** be placed on `envClient`; a new secret **MUST** be placed on `envServer`.
  Check: prefix matches the file it was added to.

## Schema changes

- A diff that changes `src/db/schema.ts` **MUST** include a generated migration under `drizzle/`, and **MUST** keep `src/db/seed.ts` consistent with the new shape.
  Check: a new `*.sql` migration file accompanies the schema change; `seed.ts` references no dropped column and supplies values for new required columns.
