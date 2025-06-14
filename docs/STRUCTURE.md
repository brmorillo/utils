# Project Structure

## Directory Layout

```
util/
├── .github/              # GitHub templates and workflows
├── .husky/               # Git hooks
├── docs/                 # Documentation
├── src/                  # Source code
│   ├── __tests__/        # Unit tests
│   ├── config/           # Configurations
│   ├── decorators/       # TypeScript decorators
│   ├── middleware/       # Middlewares
│   ├── services/         # Utility classes
│   └── utils/            # Utility functions
└── [config files]        # Various configuration files
```

## Key Components

- **Services**: Core utility classes organized by functionality
- **Utils**: Shared utility functions
- **Config**: Configuration constants
- **Decorators**: TypeScript decorators for reusable functionality
- **Middleware**: Data processing middlewares

## Tools

- **TypeScript**: Static typing
- **ESLint/Prettier**: Code quality and formatting
- **Jest**: Testing
- **Husky**: Git hooks
- **Commitizen**: Standardized commits
- **Standard-Version**: Semantic versioning