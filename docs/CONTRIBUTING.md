# Contributing to @brmorillo/util

Thank you for considering contributing to this project! This document provides guidelines and instructions for contribution.

## Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Issues

- Use the issue templates when creating new issues
- Provide clear reproduction steps
- Include relevant environment information

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/feature-name` or `fix/bug-name`
3. Make your changes
4. Run tests: `npm test`
5. Create a commit using: `npm run commit`
6. Push to your fork
7. Submit a pull request using the PR template

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

- **Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore
- **Scope**: The module affected (e.g., ArrayUtils)
- **Subject**: Short description in present tense

For more details, see our [full commit convention guide](./COMMIT_CONVENTION.md).

## Pull Request Process

1. Follow the PR template
2. Ensure all tests pass
3. Update documentation as needed
4. Request review from maintainers

## Release Process

Releases follow semantic versioning and are automated based on commit messages:

- **Major**: Breaking changes (not backward compatible)
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

## License

By contributing, you agree that your contributions will be licensed under the project's [GPL-3.0 License](../LICENSE) with additional non-commercial terms.