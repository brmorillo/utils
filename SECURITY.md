# Security Policy

## Supported versions

Only the **current major** release line receives security fixes.

| Version | Status              |
| ------- | ------------------- |
| 14.x    | ✅ Actively supported |
| < 14    | ❌ Not supported     |

Upgrade to the latest `14.x` release to receive all patches.

## Reporting a vulnerability

**Do not open a public GitHub issue for security reports.**

Report vulnerabilities privately via **GitHub Security Advisories**:

1. Go to the [Security tab](https://github.com/brmorillo/utils/security/advisories) of this repository.
2. Click **"New draft security advisory"**.
3. Fill in the description, affected versions, and steps to reproduce.
4. Submit — the maintainer will be notified privately.

Alternatively, send an e-mail to **bruno@rmorillo.com** with:
- Subject: `[SECURITY] @brmorillo/utils — <short title>`
- Affected version(s) and runtime environment.
- A concise description and steps to reproduce.
- (Optional) a suggested fix or patch.

### Response timeline

| Event | Target |
| ----- | ------ |
| Acknowledgement | within **48 hours** |
| Initial triage & severity rating | within **5 business days** |
| Patch or workaround | within **14 days** for critical/high; **30 days** for medium/low |
| Public disclosure | after the patch is published (coordinated with reporter) |

We follow [responsible disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure). Credit will be given in the release notes unless you prefer to remain anonymous.

## Security defaults — what the library guarantees

These invariants are tested in CI and must not regress:

### Cryptography (`CryptUtils`)

- Symmetric encryption uses **AES-256-GCM** or **ChaCha20-Poly1305** — both authenticated; the `authTag` is verified on decryption, so tampering throws.
- RSA uses **OAEP with SHA-256** padding. PKCS#1 v1.5 is not provided.
- ECC default curve is **prime256v1** (P-256).
- **RC4 is intentionally absent** and must never be added.
- AES-CBC is not provided; do not simplify back to it.

### Hashing (`HashUtils`)

- Password hashing uses **bcrypt** (minimum cost 10).
- General-purpose digests are **SHA-256** and **SHA-512**.

### JWT (`JWTUtils`)

- `verify` enforces an `algorithms` allowlist (default `['HS256']`); the `none` algorithm is always rejected.
- `generate` defaults to `expiresIn: '1h'` and pins `HS256`.
- `decode` does **not** verify the signature — treat its output as untrusted.

### Storage (`LocalStorageProvider`)

- All file paths are confined to the configured `basePath`. Paths containing `../` or any other traversal sequence are rejected with a `StorageError`.

### Object utilities (`ObjectUtils`)

- `deepMerge` and `unflattenObject` silently drop keys that would modify `__proto__`, `constructor`, or `prototype` (prototype-pollution protection).

### Error handling

- `BaseError.toJSON()` omits the `stack` trace by default (opt in with `{ includeStack: true }`) — safe to forward in HTTP responses.
- All library errors extend `BaseError`; the library never throws a bare `Error`.

### Retry (`RetryUtils`)

- Backoff is capped at `maxDelay` (default 30 s) with optional jitter to prevent thundering-herd.

## Dependency policy

- All runtime and dev dependencies are pinned to **exact versions** (no `^` or `~`) for reproducible installs.
- Dependencies are updated **once a month**, intentionally staying **at least 3 months behind** the latest release to allow time for the community to detect supply-chain attacks or malicious publishes.
- Before adopting a new runtime dependency major, it is verified to ship a **CommonJS build** (required for dual CJS+ESM output).
- CI runs [Gitleaks](https://github.com/gitleaks/gitleaks) on every PR and push to `main` to detect accidentally committed secrets.

## Scope

In-scope for security reports:

- Vulnerabilities in the library code itself (`src/`).
- Weaknesses in the cryptographic or JWT defaults described above.
- Path traversal or prototype-pollution bypasses.
- Supply-chain issues in pinned dependencies.

Out of scope:

- Vulnerabilities in example code (`examples/`) — these are illustrative only.
- Issues requiring physical access to the developer's machine.
- Denial-of-service against the npm registry or GitHub Actions infrastructure.
