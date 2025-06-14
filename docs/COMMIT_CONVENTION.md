# Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages.

## Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding or correcting tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration
- **chore**: Other changes that don't modify src or test files

## Scope

The scope should be the name of the affected module (e.g., `ArrayUtils`, `DateUtils`).

## Subject

- Use imperative, present tense: "add" not "added" or "adds"
- Don't capitalize first letter
- No period (.) at the end

## Examples

```
feat(ArrayUtils): add method to filter arrays by predicate
fix(DateUtils): correct timezone handling in toUTC method
docs: update installation instructions
```

## Using Commitizen

Run `npm run commit` to use the interactive commit message builder.