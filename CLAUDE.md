# CLAUDE.md

Context guide for AI assistants and developers working in this repository. Read this first.

## What this is

`@brmorillo/utils` — a comprehensive, production-ready utility library for JavaScript/TypeScript. It is a single npm package exposing ~27 modules: pure static utility classes (arrays, strings, crypto, IDs, …) plus three configurable services (HTTP, logging, storage).

- **Language:** TypeScript, compiled to **CommonJS + ESM** (dual) via `tsup`.
- **Package manager:** **bun** (`bun.lock` is authoritative). Use `bun install` / `bun add`. `npm install` fails here on a pre-existing peer-dependency conflict.
- **Node:** >= 18 (`package.json` `engines`).
- **Current line:** **v13** — the stable line. v13 is API-frozen: only **additive, non-breaking** changes from here. Do not change signatures, rename public methods, remove methods, or alter observable behavior without a major version bump.

## Repository layout

```
src/
  index.ts            # public surface: Utils facade + re-exports of everything
  services/           # one file per module (array.service.ts, crypt.service.ts, …)
  clients/            # http clients (axios-client.ts, http-client.ts)
  providers/          # storage providers (local-storage, s3-storage)
  loggers/            # console / pino / winston logger adapters
  errors/             # BaseError + ValidationError/HttpError/StorageError/QueueFullError
  interfaces/         # shared TS interfaces (logger, request, storage)
  utils/              # Cache<T>, LazyLoader<T>
tests/
  unit/               # *.spec.ts        (run in CI)
  integration/        # *.int-spec.ts    (run in CI)
  benchmark/          # *.bench.ts       (local only; perf thresholds, not in CI)
docs/                 # per-module docs: docs/<module>/README.md  (+ docs/README.md index)
examples/             # runnable examples
usage-example.js      # end-to-end smoke script against the built dist/
```

## Conventions (follow these)

- **Static utilities take ONE destructured object argument.** e.g. `StringUtils.toCamelCase({ input })`, `SortUtils.quickSort({ array })`, `CryptUtils.aesEncrypt({ data, secretKey, iv })`. The services `HttpService` / `LogService` / `StorageService` are singletons with a method-style API instead.
- **Never `throw new Error(...)` in library code.** Use the typed errors from `src/errors` (re-exported at the package root):
  - `ValidationError` — invalid input / failed guard
  - `StorageError` — file/storage failures
  - `HttpError` — HTTP failures
  - `QueueFullError` — bounded queue/stack is full
  - `BaseError(message, code, statusCode?, details?, { cause })` — any other operational failure; give it a domain `code` (`CRYPTO_ERROR`, `JWT_ERROR`, …) and pass `{ cause }` when wrapping a caught error.
- **Property predicates use `is*`** (`isEven`, `isOdd`, `isPrime`, `isPalindrome`, `isPositive`). The **format validators** in `ValidationUtils` keep `isValid*` (`isValidEmail`, `isValidCPF`, …).
- Comments, identifiers, docs, and test descriptions are in **English**.
- Match the surrounding style; run Prettier (`bun run format`) before committing.

## Dependency constraints (important)

This package ships as CommonJS and leaves runtime deps external, so **every runtime dependency must provide a CJS (`require`) build**. ESM-only majors break both Jest and real `require('@brmorillo/utils')` consumers. Notably:

- `uuid` is pinned to **^11** (v14 is ESM-only).
- `@paralleldrive/cuid2` is pinned to **^2** (v3 is ESM-only).

Before bumping any runtime dependency major, check its `package.json` `exports` has a `require`/`node.require` entry. Smoke test after building: `node -e "require('./dist/index.js')"`.

## Security defaults (do not regress)

- `CryptUtils`: AES-256-**GCM** (returns `{ encryptedData, iv, authTag }`), ChaCha20-**Poly1305**, RSA-**OAEP**(sha256), ECC default curve **prime256v1**. **RC4 is intentionally absent** — do not reintroduce it, and do not "simplify" AES back to CBC.
- `JWTUtils.verify` enforces an `algorithms` allowlist (default `['HS256']`, `'none'` rejected); `generate` defaults `expiresIn: '1h'` and pins `HS256`. `decode` does NOT verify — treat its output as untrusted.
- `BaseError.toJSON()` omits `stack` by default (opt in with `{ includeStack: true }`).
- `LocalStorageProvider` confines paths to its `basePath` (rejects `../` traversal); `ObjectUtils.deepMerge`/`unflattenObject` block prototype-pollution keys.
- `RetryUtils` caps backoff (`maxDelay`, default 30s) with optional jitter.

## Development workflow

```bash
bun install            # install deps (NOT npm)
bun run build          # tsc typecheck + tsup build (CJS + ESM + d.ts)
bun run type-check     # tsc --noEmit
CI=true bun run test   # unit + integration (jest); benchmarks excluded in CI
bun run test:coverage  # coverage report (thresholds: 95% lines/stmts/funcs, 88% branches)
bun run lint           # eslint (flat config: eslint.config.js)
bun run format         # prettier --write src
```

Notes:
- The local TypeScript compiler is `./node_modules/.bin/tsc` (a bare `npx tsc` hits a placeholder).
- Tests must stay green and coverage above the configured thresholds.
- Mock installed dependencies with plain `jest.mock('name', factory)` — do **not** pass `{ virtual: true }` for a module that is actually installed (it makes the mock non-deterministic and lets real network/SDK calls leak through).

## Where to look

- Public API & exports: `src/index.ts`
- Per-module reference docs: `docs/<module>/README.md` (index at `docs/README.md`)
- Project overview & usage: root `README.md`
