# Spec: global invariants

Declarative structural rules that hold for **every** Next.js client built with this skill. After any change, self-verify against this list. Each rule is a `MUST` / `MUST NOT` with a **Check** hint (a grep pattern or a visual cue) — no script to run, the model reads and confirms.

## Routing ↔ module ↔ widget

- **MUST** keep a routing file (`page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`,
  `template.tsx`) free of every module-scope declaration except the default-exported route
  component, its `IProps`, and Next.js's own route exports (`generateMetadata`,
  `generateStaticParams`, `generateViewport`, `metadata`, `viewport`, `dynamic`,
  `dynamicParams`, `revalidate`, `fetchCache`, `runtime`, `preferredRegion`, `maxDuration`).
  No helper, constant, interface or inline sub-component — size is irrelevant.
  Check: `grep -nE "^(const|let|function|async function|type|interface|enum|class) " <route-file>`
  returns only the route component and the allowed Next exports.
- **MUST** have a routing file that mounts every slice under `modules/`.
  Check: for each `src/app/modules/<m>/`,
  `grep -rlE "modules/<m>(['\"/])" $(find src/app -name 'page.tsx' -o -name 'layout.tsx' -o -name 'error.tsx' -o -name 'not-found.tsx' -o -name 'template.tsx' -o -name 'global-error.tsx' | grep -v /modules/)`
  is non-empty. Empty → the slice is not a module; relocate it (2+ consumers → widget/feature/shared, 1 consumer → that module's `elements/`).
- **MUST NOT** reach a module from anywhere but the routing tree — including lazily.
  Check: `grep -rn "app/modules/" src/app/modules src/app/widgets src/app/features src/app/shared src/app/entities src/pkg`
  returns nothing (a slice's own relative imports don't match this pattern).
- **MUST** keep a `widgets/<w>` slice consumed by two or more DISTINCT modules; one consumer → move it into that module's `elements/`.
  Check: `grep -rn "widgets/<w>" src | grep -v "^src/app/widgets/<w>/"` lists ≥2 different `modules/<…>` paths.

## Barrels

- **MUST** ship an `index.ts` where the folder is ONE subject expressed in several roles — a
  unit's component plus its service/interface/constant, or an api unit's fetcher/query/mutation.
  Check: every re-export target in that `index.ts` is a role file of the folder's own subject.
- **MUST NOT** place a barrel on a GROUPING folder — one whose members are independent units
  that merely share a role or a layer. That covers every layer folder, every folder of slices,
  and every role folder holding unrelated members. Such a barrel is one module with an edge per
  member, so importing one symbol makes the whole group a dependency; bundlers group shared
  modules into chunks, so tree shaking does not reliably undo it.
  Check: an `index.ts` that re-exports from a CHILD DIRECTORY, or whose targets are unrelated
  subjects rather than roles of one.
  Check: consumers deep-importing past an existing barrel — the dodge is the diagnosis.
- **MUST** place cross-cutting code that is ONE subject with internal structure at
  `shared/systems/<system>/` with its own barrel, not scattered across role segments. The
  `systems/` folder itself groups and carries no barrel.
  Check: a shared folder holding its own `elements/`, `services/` or a runtime split, sitting
  directly under `shared/` beside the role segments.
- **MUST NOT** be bypassed where a barrel legitimately exists.
  Check: no import resolves inside a folder that ships an `index.ts`, from outside that folder.
- **MUST** keep a `pkg/<slot>/index.ts` even though its members are independent — a slot is a
  UNIT (the thing you lift into another project) and that barrel is its public face. A generic
  grouping-barrel check flags it; that is a FALSE POSITIVE to filter, not debt to pay.
  Check: deleting the barrel would only change import paths → grouping, delete it; deleting it
  would remove the slot's public face → slot barrel, keep it.

## Import direction

- **MUST** import only downward: `(web)/(api) → modules → widgets → features → entities → shared`.
- **MUST NOT** import upward or sideways within a layer (module→module, feature→feature, widget→widget).
  Check: `grep -R "from '@/app/modules/'" src/app/modules/` returns only `<module>/elements/*` self-imports.

## `pkg/` self-containment

- **MUST NOT** let a `pkg/*` slot import from `app/*` or from another `pkg/*`.
  Check: `grep -R "from '@/app/" src/pkg/` and `grep -R "from '@/pkg/<other>" src/pkg/<name>/` return nothing.
- **MUST** be entered through a barrel from outside the slot — `pkg/<name>`, or a runtime
  barrel `pkg/<name>/client` / `pkg/<name>/server` — never at a member file.
  Check: `grep -RE "from '@/pkg/[a-z-]+/[a-z-]+" src/app` returns only runtime barrels.
- **MUST** group runtime-bound members into `client/` or `server/`, each publishing its own
  `index.ts`, when a member resolves in only one runtime (browser-only SDK, server-only
  credential or native module). Isomorphic members stay at the slot root.
  Check: no single member file at the slot root imports a runtime-exclusive dependency.
- **MUST** comment at the top of `pkg/<name>/index.ts` when it deliberately does NOT
  re-export a runtime folder, naming the folder and the mechanism — otherwise the omission
  reads as an oversight and gets "fixed", reintroducing the break.
  Check: for each `client/`/`server/` absent from the slot barrel, a comment explains it.

## Server / client boundary

- **MUST** keep pages and layouts as RSC unless they call client-only APIs.
- **MUST** place `'use client'` at the **outermost** component that needs the client runtime; children inherit it.
- **MUST NOT** add `'use client'` to `*.api.ts` or `*.query.ts` (they stay server-composable for `prefetchQuery`). Only `*.mutation.ts` carries it. A `use<X>Query` wrapper hook living in `*.query.ts` is NOT a reason to add the directive — the consuming component carries it.
  Check: `grep -RL "use client" src/app/entities/api/**/*.mutation.ts` is empty; `grep -Rl "use client" src/app/entities/api/**/*.{api,query}.ts` is empty.

## Environment access

- **MUST** read env only through `envClient` / `envServer` from `config/env/`.
- **MUST NOT** read `process.env` outside `config/env/`. Two exceptions, both for values
  that must be INLINED at build time rather than read at runtime: `src/proxy.ts`
  reading `process.env.NODE_ENV` for cookie flags, and a literal `process.env.NODE_ENV`
  used to dead-code-eliminate a dev-only import (React Query devtools). Going through
  `envClient` there would keep the code in the production bundle, which defeats the gate.
  Check: `grep -R "process.env" src --include=*.ts | grep -v "config/env" | grep -v "proxy.ts"` returns nothing.
- **MUST** place `NEXT_PUBLIC_*` vars on `envClient`; secrets on `envServer`.

## File naming

- **MUST** carry the role suffix on every implementation file (`.module.tsx`, `.component.tsx`, `.service.ts`, `.store.ts`, `.hook.ts(x)`, `.api.ts`, `.query.ts`, `.mutation.ts`, `.model.ts`, `.interface.ts`, `.constant.ts`, `.util.ts`, `.pkg.ts`).
  Sole exception: `shared/validation/validation.ts` (plain `*.ts`).
- **MUST** use kebab-case folder names; the slice folder name equals the file prefix.
  Check: `modules/<name>/<name>.module.tsx` — folder and prefix match, no camelCase, no `_`.
- **MUST** put every test for a slice in that slice's SINGLE `tests/` folder, at the slice
  root, named `<subject-file>.test.ts`. A slice-internal file is absent from the barrel, so
  a test outside the slice could only reach it by breaking barrel-only imports; and one
  folder per slice keeps "what covers this module?" answerable in one place.
  Check: `find src -name '*.test.*'` returns only `**/tests/*.test.*` paths, with at most
  one `tests/` folder per slice; no top-level `tests/` mirror of `src/`.
- **MUST NOT** put an `index.ts` in a `tests/` folder — nothing imports a test.
  Check: `find src -path '*/tests/index.ts'` is empty.
- **MUST** keep a MODULE barrel to its entry component only — literally one export line,
  `export { default as <X>Module } from './<x>.module'`. A module is closed business logic:
  its store, service, provider, hooks, utils, types, constants and `elements/` are internal,
  and exporting them advertises a surface no consumer is allowed to use anyway (modules
  never import modules; only routing mounts a module). A symbol another slice genuinely
  needs is LIFTED DOWN a layer, never exported from here.
  Check: `for f in src/app/modules/*/index.ts; do n=$(grep -c "^export" "$f"); [ "$n" = 1 ] || echo "$f: $n"; done`
  prints nothing.
- **MUST** have exactly one `*.module.tsx` per module slice, and an `index.ts` in every one.
  Check: `for d in src/app/modules/*/; do [ -f "$d/index.ts" ] || echo "no barrel: $d"; c=$(find "$d" -maxdepth 1 -name '*.module.tsx' | wc -l | tr -d ' '); [ "$c" = 1 ] || echo "$d: $c module files"; done`
  prints nothing.
- **MUST NOT** widen a barrel solely to make a file testable.
  Check: every symbol added to an `index.ts` has a non-test consumer.
- **MUST NOT** keep a `model/` folder inside a slice — it repeats a role the suffixes already
  carry. Flatten to the slice root (`model/x.types.ts` → `x.interface.ts`, `model/x.constants.ts`
  → `x.constant.ts`, `model/x.store.ts` → `x.store.ts`), then apply "the second file of a role
  earns a folder" normally.
  Check: `find src/app -type d -name model` is empty.

## Code style

- **MUST** keep every implementation file at 1000 lines or fewer; when a file approaches the cap, split along the pattern (`elements/` sub-components, `*.service.ts`, `*.constant.ts`, or a new slice). A file already over the cap is split before it is edited further.
  Check: `wc -l` on every file touched by the change → each ≤ 1000.
- **MUST** keep a `*.component.tsx` / `*.module.tsx` file down to the component itself: its `IProps`, the component, the default export. Module-scope constants move to `<name>.constant.ts`; module-scope helper functions move to `<name>.util.ts` when pure (input → output) or `<name>.service.ts` when they touch React, I/O or a store. Locals declared INSIDE the component body are not affected.
  Check: `grep -nE "^(const|let|function|async function) [A-Za-z0-9_]+" <file>.component.tsx` returns nothing but the component declaration itself.
- **MUST** give declared arrow functions a block body with an explicit `return` (`const <fn> = (…) => { return … }`).
- **MUST NOT** use a one-line implicit-return body on a declared function (`const <fn> = (…) => value`). Inline callbacks passed directly as arguments or JSX props (selectors, `map`, event handlers) may stay concise.
  Check: both greps return nothing —
  `grep -RnE "const [a-zA-Z0-9_]+ = (async )?\(.*\)(: [^=]+)? => [^{]" src --include='*.ts' --include='*.tsx'` (same-line concise body) and
  `grep -RnE "const [a-zA-Z0-9_]+ = (async )?\(.*\) =>$" src --include='*.ts' --include='*.tsx'` (concise body wrapped to the next line).

## Layer purity

- **MUST** keep `shared/utils/*.util.ts` pure (no React, no I/O, no service calls).
- **MUST** keep `entities/models/*.model.ts` free of LOGIC — types, interfaces, enums and
  `as const` literal lists only. A list of literals is an enum by another name; a function
  (a type guard, a mapper) is logic and belongs in a `*.util.ts`.
  Check: `grep -rn "^export function \|=> {" src/app/entities/models` returns nothing.
- **MUST NOT** put TanStack Query files (`*.api.ts` / `*.query.ts` / `*.mutation.ts`) anywhere except `entities/api/<api>/`.
  Check: `grep -Rl "queryOptions\|useMutation\|useQuery" src/app/{modules,widgets,features}` returns nothing.
