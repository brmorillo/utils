# Contributing to @brmorillo/utils

Thank you for your interest in contributing to @brmorillo/utils! This document provides comprehensive guidelines and information for contributors.

## 🚀 Quick Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/utils.git`
3. Install dependencies: `pnpm install`
4. Create a new branch: `git checkout -b feature/my-feature`
5. Make your changes
6. Run tests: `pnpm test`
7. Commit your changes: `git commit -m "feat: add new feature"`
8. Push to your fork: `git push origin feature/my-feature`
9. Create a Pull Request

## 📋 Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Add proper type annotations for all public APIs
- Avoid `any` type unless absolutely necessary
- Use interfaces for object shapes
- Follow the existing code patterns

### ESLint & Prettier

We use ESLint and Prettier for code formatting and linting:

```bash
# Check linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

### Documentation

- Add JSDoc comments for all public methods
- Include usage examples in JSDoc
- Update README.md if adding new utilities
- Add documentation files in `docs/` directory

## 🧪 Testing

### Test Requirements

- All new features must include tests
- Maintain or improve test coverage
- Include unit tests, integration tests, and benchmark tests where applicable

### Test Types

1. **Unit Tests** (`tests/unit/*.spec.ts`)
   - Test individual functions/methods
   - Mock external dependencies
   - Fast execution

2. **Integration Tests** (`tests/integration/*.int-spec.ts`)
   - Test complete workflows
   - Real-world scenarios
   - End-to-end functionality

3. **Benchmark Tests** (`tests/benchmark/*.bench.ts`)
   - Performance testing
   - Measure execution time
   - Compare algorithm efficiency

### Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific test pattern
pnpm test -- --testPathPatterns="array.service"

# Run in watch mode
pnpm test:watch
```

## 🏗️ Adding New Utilities

### File Structure

```
src/services/
├── my-new.service.ts           # Implementation
tests/unit/
├── my-new.service.spec.ts      # Unit tests
tests/integration/
├── my-new.service.int-spec.ts  # Integration tests
tests/benchmark/
├── my-new.service.bench.ts     # Benchmark tests
docs/
├── my-new-service.md           # Documentation
```

### Service Template

```typescript
/**
 * Utility class for [describe functionality]
 */
export class MyNewUtils {
  /**
   * [Brief description of the method]
   * @param {type} param - Description of parameter
   * @returns {type} Description of return value
   * @throws {Error} When [condition for error]
   * @example
   * const result = MyNewUtils.methodName(input);
   * console.log(result); // Expected output
   */
  public static methodName(param: type): returnType {
    // Input validation
    if (!param) {
      throw new Error('Invalid input: param is required');
    }

    try {
      // Implementation
      return processedResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to process: ${errorMessage}`);
    }
  }
}
```

### Export the Service

Add your new service to `src/index.ts`:

```typescript
export * from './services/my-new.service';
```

## 🔍 Code Review Process

### Pull Request Guidelines

1. **Title**: Use conventional commit format
   - `feat: add new utility for X`
   - `fix: resolve issue with Y`
   - `docs: update documentation for Z`
   - `test: add tests for W`

2. **Description**: Include
   - What changes were made
   - Why the changes were necessary
   - Any breaking changes
   - Links to related issues

3. **Checklist**:
   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Tests added for new functionality
   - [ ] Documentation updated
   - [ ] No breaking changes (or clearly documented)

### Review Criteria

- Code quality and maintainability
- Test coverage and quality
- Documentation completeness
- Performance considerations
- Backward compatibility

## 🐛 Bug Reports

### Before Submitting a Bug Report

1. Check existing issues
2. Reproduce the bug
3. Test with the latest version

### Bug Report Template

```markdown
**Describe the Bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Import '...'
2. Call function '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- Node.js version:
- Package version:
- OS:

**Additional Context**
Any other context about the problem.
```

## 💡 Feature Requests

### Before Submitting a Feature Request

1. Check if the feature already exists
2. Consider if it fits the library's scope
3. Think about backward compatibility

### Feature Request Template

```markdown
**Feature Description**
A clear description of what you want to add.

**Use Case**
Describe the problem this feature would solve.

**Proposed Solution**
How you envision this feature working.

**Alternatives Considered**
Any alternative solutions you've considered.

**Additional Context**
Any other context or examples.
```

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Automated Releases

- Releases are automated using `semantic-release`
- Commit messages determine version bumps
- Changelog is generated automatically

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/dependency changes

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## 🤝 Community

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and best practices
- Provide constructive feedback

## 📞 Getting Help

- Check the [documentation](./index.md)
- Search existing [issues](https://github.com/brmorillo/utils/issues)
- Create a new issue with detailed information
- Join discussions in pull requests

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's [GPL-3.0 License](../LICENSE).

Thank you for contributing to @brmorillo/utils! 🎉
