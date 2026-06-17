# Contributing to @brmorillo/utils

Thank you for taking the time to contribute! This document is a quick-start guide. For the full architecture and convention reference, read [CLAUDE.md](./CLAUDE.md).

## Table of contents

- [Getting started](#getting-started)
- [Development workflow](#development-workflow)
- [Conventions](#conventions)
- [Adding a new method](#adding-a-new-method)
- [Adding a new module](#adding-a-new-module)
- [Commit and branch naming](#commit-and-branch-naming)
- [Pull request process](#pull-request-process)
- [Dependency policy](#dependency-policy)

---

## Getting started

```bash
git clone https://github.com/brmorillo/utils.git
cd utils
bun install          # npm install fails here — use bun
bun run build        # typecheck + CJS + ESM + .d.ts
CI=true bun run test:ci   # full suite with coverage gate
```

> **Node.js >= 18** and **[Bun](https://bun.sh)** are required.

---

## Development workflow

```bash
bun run type-check   # tsc --noEmit
bun run lint         # eslint (0 warnings expected)
bun run test         # jest unit + integration
bun run test:coverage
bun run build        # must finish with 0 warnings
bun run format       # prettier --write src/
```

All five commands must pass before opening a PR.

---

## Conventions

These are enforced by CI and the invariant test suites — a PR that breaks them will not be merged.

### Single object argument

Every static utility method takes **one destructured object**:

```ts
// ✅
StringUtils.toCamelCase({ input: 'hello world' })

// ❌
StringUtils.toCamelCase('hello world')
```

Singleton services (`HttpService`, `LogService`, `StorageService`) use a method-style API instead — that is intentional.

### Non-mutating by default

Data-transforming methods must return a **new value** and leave the input untouched. Where in-place mutation makes sense, expose it as `inPlace?: boolean` (default `false`). See `immutability.spec.ts` and `inplace-invariant.spec.ts`.

### Typed errors only

**Never** `throw new Error(…)` in library code. Use the typed errors from `src/errors`:

```ts
import { ValidationError, BaseError, StorageError, HttpError, QueueFullError } from '../errors';

throw new ValidationError('Input must be a string', 'input');
throw new BaseError('Something went wrong', 'MY_ERROR_CODE', 500, details, { cause: err });
```

### TSDoc on every public member

All exported classes, methods, constructors, and helpers need a `/** */` block with at least a summary line.

### Predicate naming

- Property predicates: `is*` (`isEven`, `isPrime`, `isPalindrome`)
- Format validators in `ValidationUtils`: `isValid*` (`isValidEmail`, `isValidCPF`)

### English only

All identifiers, comments, doc strings, and test descriptions must be in English.

---

## Adding a new method

1. Add the static method to the appropriate service in `src/services/`.
2. Write a TSDoc block for it.
3. Add unit tests in `tests/unit/<module>.service.spec.ts`.
4. Add an integration test in `tests/integration/<module>.service.int-spec.ts`.
5. If the method is data-transforming, add it to `immutability.spec.ts`. If it supports `inPlace`, add it to `inplace-invariant.spec.ts`.
6. Update the module docs in `docs/<module>/README.md`.

---

## Adding a new module

1. Create `src/services/<name>.service.ts` with a static utility class.
2. Export it from `src/index.ts`.
3. Add unit + integration tests.
4. Add it to `tests/unit/public-surface.spec.ts` and `tests/integration/contract.int-spec.ts`.
5. Create `docs/<name>/README.md` and link it from `docs/README.md` and `README.md`.

---

## Commit and branch naming

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

| Type | When to use |
| --- | --- |
| `feat:` | New method, module, or additive export |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `refactor:` | Internal restructure, no behavior change |
| `test:` | Adding or fixing tests |
| `chore:` | Build, config, tooling |
| `ci:` | CI workflow changes |
| `perf:` | Performance improvement |

Breaking changes: add `!` suffix (`feat!:`) and include a `BREAKING CHANGE:` footer.

Branch naming: `feature/<name>`, `fix/<issue>`, `docs/<topic>`, `chore/<task>`.

---

## Pull request process

1. Open a PR against `main`.
2. The `pr-version` workflow automatically commits a `chore(release): vX.Y.Z` bump to your branch — **do not edit it manually**.
3. The CI pipeline (type-check → lint → test with coverage → build → secret scan) must pass.
4. A maintainer reviews and merges. After merge, the `release` workflow tags and publishes to npm automatically.

---

## Dependency policy

- All dependencies are pinned to **exact versions** (no `^` or `~`).
- Updates happen **once a month**, staying **at least 3 months behind** the latest release (supply-chain safety buffer).
- Before bumping a runtime dependency to a new major, verify it ships a CommonJS build:
  ```bash
  node -e "require('<package>')"
  ```
- `uuid` is permanently pinned to `^11` and `@paralleldrive/cuid2` to `^2` (v3+ are ESM-only and would break CJS consumers).

---

## Questions?

Open a [GitHub Discussion](https://github.com/brmorillo/utils/issues) or reach out via [bruno@rmorillo.com](mailto:bruno@rmorillo.com).
