# CLAUDE.md

**Tradeoff:** these guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.
- If a constraint (schema, API, deadline) blocks the simple path, report the tradeoff before patching around it.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Verify Before Claiming Done

**Evidence before assertions. Always.**

Before saying "fixed", "passing", "working", "complete":
- Run the actual command. Don't infer success from the diff.
- Read the actual output. Don't assume the exit code.
- If you can't run it (missing env, no UI access, sandboxed), say so explicitly instead of claiming success.

The bar: a future reader should be able to point at concrete tool output you saw.

**Pushback ≠ truth.** When the user disagrees with your work, investigate before agreeing. Reflexive "you're right, let me fix that" is worse than a calm "let me verify first" — they might be wrong, and capitulation hides bugs in the next layer.

---

## Red Flags — Internal Thoughts That Mean STOP

These are pattern-match triggers, not rules. If you catch the thought on the left, the reality on the right applies.

| Thought | Reality |
|---|---|
| "I'll just do this one thing first" | You're skipping plan/scope. Stop and confirm. |
| "This is too simple to need verification" | Trivial things break prod most often. Run it. |
| "User pushed back, I'll just rewrite" | Verify the claim first. Capitulation isn't humility. |
| "Let me add a bit of flexibility for later" | YAGNI. Delete it. |
| "Close enough, let me move on" | "Close enough" is how silent bugs ship. |
| "I'll add error handling just in case" | If the case can't happen, the handler hides real bugs. |
| "Let me also clean up while I'm here" | Out of scope. Mention it, don't do it. |
| "The test is probably fine, no need to run" | The test is never fine until it's green. |
| "I know what this code does without reading it" | Read it. Models confabulate confidently. |
| "I'll write a quick summary doc / README" | Not asked for. Don't create files unprompted. |

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, clarifying questions come *before* implementation, and "done" claims are backed by actual tool output the user can point at.

---

## Project facts

What this codebase is, how a request flows through it, and how its subsystems work is documented in
the wiki imported at the bottom of this file — start at `.claude/wiki/index.md`. The rules below are
here rather than in the wiki because they must be in front of you before you write a line.

### Skills — who owns which decision

- [.claude/skills/client-structure/](.claude/skills/client-structure/) (`/client-structure`) — **the law.**
  Layer/Slice/Segment layout, naming, barrels, import direction, the `(api)` route-handler contract,
  the data layer, auth, and TanStack Query patterns. Invoke it whenever code is being placed, moved
  or audited. It ships two executable checkers under `scripts/`.
- [.claude/skills/add-feature/](.claude/skills/add-feature/) (`/add-feature`) — the ordered DB → API → UI
  recipe for a brand-new entity (table + migration + seed → entity model with its own
  `E<Entity>Api`/`E<Entity>Key` → api slice → route handler → module + page → `proxy.ts` gating).
- [.claude/skills/review-changes/](.claude/skills/review-changes/) (`/review-changes`) — project-tuned
  verification pass over a diff before declaring work done. Complements `/code-review`.
- [.claude/skills/next-intl/](.claude/skills/next-intl/) (`/next-intl`) — anything localized.
- [.claude/skills/git-workflow/](.claude/skills/git-workflow/) (`/git-workflow`) — branches, commits, PRs.
  **Rule 0: committing, pushing and branching are the user's actions, not the agent's.**
- [.claude/skills/shadcn/](.claude/skills/shadcn/) — shadcn component work.

### Commands

- `yarn dev` — local Next.js dev server.
- `yarn build` / `yarn start` — production build / serve.
- `yarn format` — type-check → lint --fix → prettier. Prefer this before declaring work done.
- `yarn db:generate` / `yarn db:push` / `yarn db:migrate` / `yarn db:studio` — Drizzle Kit schema workflow.
- `yarn seed` — populate the database from `src/db/seed.ts`.
- `yarn test:e2e` — Playwright. Prepare with `yarn db:migrate:test` and `yarn seed:test` first.
- Structural checkers (the two rules no toolchain sees):
  `node .claude/skills/client-structure/scripts/check-layer-imports.mjs --root src/app --alias @/=src/`
  and `node .claude/skills/client-structure/scripts/check-barrels.mjs --root src --alias @/=src/ --ignore index.server`
  (the `--ignore` is required — see `/review-changes`).

### Hard rules

- Read process env only through `envClient` / `envServer` from [src/config/env/](src/config/env/), never `process.env` directly.
- Fetch data **only** through Drizzle inside a `*.service.ts` guarded by `import 'server-only'`, reached from an `(api)` route handler — never the `supabase-js` client, and never a query built in the handler itself.
- Use `db.$count(...)` for aggregate counts (avoids N+1); never count in application code over a fetched list.
- OAuth provider secrets are **optional** Zod env vars — an unset provider is simply disabled, not a build error.
- Route gating lives in one file, `src/proxy.ts` (Next 16's name for `middleware.ts`) — page protection there, API auth enforced in each handler.
- Query keys belong to the entity that owns them (`E<Entity>Key` in `entities/models/<entity>.model.ts`). Do not extend the legacy project-wide `EEntityKey`.
- Package manager is **yarn**, never npm.

---

<!-- BEGIN AUTO-WIKI (managed by Claude IDE) -->
@wiki/index.md
<!-- END AUTO-WIKI -->
