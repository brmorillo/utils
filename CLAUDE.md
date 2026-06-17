# CLAUDE.md

Context guide for AI assistants and developers working in this repository. Read this first, then `docs/README.md` for the per-module reference.

## What this is

`@brmorillo/utils` — a comprehensive, production-ready utility library for JavaScript/TypeScript. One npm package exposing ~27 modules behind a single, consistent, type-safe API.

- **Language:** TypeScript, compiled to **CommonJS + ESM** (dual) via `tsup`; ships its own `.d.ts`.
- **Package manager:** **bun** (`bun.lock` is authoritative). Use `bun install` / `bun add`. `npm install` fails here on a pre-existing peer-dependency conflict (npm is fine for `npm pack`).
- **Node:** >= 18 (`package.json` `engines`).
- **Version line:** **v13** — the stable line. v13 is **API-frozen: only additive, non-breaking changes**. Do not change signatures, rename or remove public methods, or alter observable behavior without a major bump. New optional params (like `inPlace?`) and new methods/classes are fine.

## Mental model — four kinds of exports

Understanding which category a thing is tells you how to use and extend it:

1. **Static utility classes** — stateless transforms, never instantiated. Call static methods directly: `ArrayUtils`, `ObjectUtils`, `StringUtils`, `NumberUtils`, `MathUtils`, `ConvertUtils`, `DateUtils`, `ValidationUtils`, `CryptUtils`, `HashUtils`, `JWTUtils`, `UUIDUtils`, `CuidUtils`, `SnowflakeUtils`, `SortUtils`, `BenchmarkUtils`, `RequestUtils`, `FileUtils`, `RetryUtils`. Also the factory classes `QueueUtils`, `CacheUtils`, `EventUtils`.
2. **Configurable singleton services** — stateful, configured once via `getInstance(options)` / `configure(options)`: `HttpService`, `LogService`, `StorageService`. The `Utils` facade bundles these three.
3. **Instantiable helpers & data structures** — `new`-ed by the consumer (often produced by the factory classes above): `Cache`, `LazyLoader`, `Queue`, `Stack`, `PriorityQueue`, `DelayQueue`, `CircularBuffer`, `MultiQueue`, `EventEmitter`.
4. **Typed errors** — `BaseError` + `ValidationError`, `HttpError`, `StorageError`, `QueueFullError`. Everything the library throws is one of these.

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

The external consumer smoke project lives **outside** this repo at `../utils-dumb` (see [Testing & quality](#testing--quality)).

## Conventions (follow these)

- **Single object argument.** Static utilities take ONE destructured object: `StringUtils.toCamelCase({ input })`, `SortUtils.quickSort({ array })`, `CryptUtils.aesEncrypt({ data, secretKey })`. The singleton services use a method-style API instead (`http.get(url, opts)`).
- **Data is non-mutating by default.** Every method that transforms data returns a NEW value and leaves the caller's input untouched. Where in-place mutation is coherent, it is **opt-in** via `inPlace?: boolean` (default `false`): all `SortUtils.*`; `ArrayUtils` `removeDuplicates`/`intersect`/`flatten`/`shuffle`/`sort`; `ObjectUtils` `deepMerge`/`pick`/`omit`/`removeUndefined`/`removeNull`/`unflattenObject`. Methods that produce a different structure (`groupBy`, `flattenObject`, `invert`), read-only checks, and `deepClone` have no `inPlace`. The one intentional in-place exception is `ObjectUtils.deepFreeze` (native `Object.freeze` semantics, documented). Two parametrized invariant tests guard the convention: `tests/unit/immutability.spec.ts` (default never mutates) and `tests/unit/inplace-invariant.spec.ts` (`inPlace:true` mutates and returns the same reference). Do not introduce default mutation, and keep both invariants green when adding an `inPlace` method.
- **Never `throw new Error(...)` in library code.** Use the typed errors from `src/errors` (re-exported at the package root):
  - `ValidationError` — invalid input / failed guard
  - `StorageError` — file/storage failures
  - `HttpError` — HTTP failures
  - `QueueFullError` — bounded queue/stack is full
  - `BaseError(message, code, statusCode?, details?, { cause })` — any other operational failure; give it a domain `code` (`CRYPTO_ERROR`, `JWT_ERROR`, …) and pass `{ cause }` when wrapping a caught error.
- **Predicate naming.** Property predicates use `is*` (`isEven`, `isOdd`, `isPrime`, `isPalindrome`, `isPositive`). Format validators in `ValidationUtils` keep `isValid*` (`isValidEmail`, `isValidCPF`, …).
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

## Testing & quality

Test layers (`jest`, ts-jest):

- `tests/unit/*.spec.ts` and `tests/integration/*.int-spec.ts` — run in CI.
- `tests/benchmark/*.bench.ts` — local only (machine-dependent perf thresholds; excluded when `CI=true`).

Cross-cutting **invariant guards** (these catch what line coverage cannot — keep them green):

- `tests/unit/public-surface.spec.ts` — asserts every module/service/error class is exported from the package root, and that removed scaffolding stays gone.
- `tests/integration/contract.int-spec.ts` — exercises one representative method of every module end to end + the typed-error invariant.
- `tests/unit/immutability.spec.ts` — every data transformation must leave its input unchanged by default.
- Sort suite — parametrized non-mutation check across all 18 algorithms.

**External consumer test** (`../utils-dumb`, a sibling project, not committed here): installs the packed tarball and exercises every module via both `require` (CJS) and `import` (ESM). Use it to validate the actual published artifact — packaging/export/ESM-dep problems that the in-repo suite can't see. To run after a change:

```bash
cd ../utils && bun run build && npm pack          # produce brmorillo-utils-<v>.tgz
mv brmorillo-utils-*.tgz ../utils-dumb/ && cd ../utils-dumb
npm install ./brmorillo-utils-*.tgz
node smoke.cjs && node smoke.mjs
```

Coverage thresholds (enforced): 95% lines/statements/functions, 88% branches.

Jest mocking note: mock installed dependencies with plain `jest.mock('name', factory)` — do **not** pass `{ virtual: true }` for a module that is actually installed; it makes the mock non-deterministic and lets real network/SDK calls leak through (this caused a real flaky failure).

## Development workflow

```bash
bun install            # install deps (NOT npm)
bun run build          # tsc typecheck + tsup build (CJS + ESM + d.ts)
bun run type-check     # tsc --noEmit
CI=true bun run test   # unit + integration (jest); benchmarks excluded in CI
bun run test:coverage  # coverage report
bun run lint           # eslint (flat config: eslint.config.js)
bun run format         # prettier --write src
```

Notes:
- The local TypeScript compiler is `./node_modules/.bin/tsc` (a bare `npx tsc` hits a placeholder).
- There is currently **no CI workflow** in the repo (`.github/` was removed); run `build` + `test` + `lint` locally before publishing.

## Where to look

- Public API & exports: `src/index.ts`
- Per-module reference docs: `docs/<module>/README.md` (index at `docs/README.md`)
- Project overview & usage: root `README.md`
- Architecture/conventions (this file): `CLAUDE.md`
