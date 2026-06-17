## Summary

<!-- What does this PR do? 1-3 bullet points. -->

-
-

## Type of change

- [ ] Bug fix (`fix:`)
- [ ] New feature / additive change (`feat:`)
- [ ] Documentation (`docs:`)
- [ ] Refactor — no behavior change (`refactor:`)
- [ ] Tests (`test:`)
- [ ] CI / tooling (`chore:`, `ci:`)
- [ ] Performance (`perf:`)
- [ ] Breaking change (`feat!:` / `fix!:` + `BREAKING CHANGE:` footer)

## Checklist

- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, …)
- [ ] `bun run type-check` passes
- [ ] `bun run lint` passes (0 warnings)
- [ ] `CI=true bun run test:ci` passes (coverage thresholds met)
- [ ] `bun run build` passes with 0 warnings
- [ ] New public methods have TSDoc (`/** */` with at least a summary line)
- [ ] No `throw new Error(…)` — typed errors from `src/errors` only
- [ ] Data-transforming methods are non-mutating by default (add `inPlace?` if mutation is needed)
- [ ] No ESM-only runtime dependencies added (check `require` export before bumping a major)

## Test plan

<!-- How did you verify this works? Which test files cover it? -->

-
