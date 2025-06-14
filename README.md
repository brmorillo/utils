# @brmorillo/util

A comprehensive utility library with standardized methods for common operations.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Non-Commercial](https://img.shields.io/badge/License-Non%20Commercial-red.svg)](./docs/LICENSE_INFO.md)

## Installation

```bash
npm install @brmorillo/util
```

## Usage

```typescript
import { Utils } from '@brmorillo/util';

// Using ArrayUtils
const uniqueArray = Utils.Array.removeDuplicates({ 
  array: [1, 2, 2, 3] 
}); // [1, 2, 3]

// Using DateUtils
const now = Utils.Date.now({ utc: true });

// Using StringUtils
const kebabCase = Utils.String.toKebabCase({ 
  input: 'Hello World' 
}); // "hello-world"
```

## Available Utilities

- **ArrayUtils**: Array manipulation methods
- **ConvertUtils**: Unit and type conversions
- **CryptUtils**: Encryption and decryption operations
- **CuidUtils**: CUID generation and validation
- **DateUtils**: Date manipulation using Luxon
- **HashUtils**: Hashing and comparing values
- **MathUtils**: Mathematical operations
- **NumberUtils**: Number manipulation
- **ObjectUtils**: Object operations
- **RequestUtils**: HTTP request data extraction
- **SnowflakeUtils**: Snowflake ID generation and decoding
- **SortUtils**: Various sorting algorithms
- **StringUtils**: String manipulation
- **UUIDUtils**: UUID generation and validation
- **ValidationUtils**: Data validation

## Features

- All methods accept objects as parameters for consistency
- Complete JSDoc documentation with detailed examples
- Full TypeScript typing
- Comprehensive unit tests
- Semantic versioning

## Development

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Format code
npm run format

# Build the library
npm run build

# Run tests
npm run test

# Create a commit (using Commitizen)
npm run commit

# Create a new release
npm run release
```

## Documentation

- [Contributing Guide](./docs/CONTRIBUTING.md)
- [Code of Conduct](./docs/CODE_OF_CONDUCT.md)
- [Commit Convention](./docs/COMMIT_CONVENTION.md)
- [Security Policy](./docs/SECURITY.md)
- [Project Structure](./docs/STRUCTURE.md)
- [License Information](./docs/LICENSE_INFO.md)
- [Changelog](./CHANGELOG.md)

## License

This project is licensed under the GNU General Public License v3.0 with additional non-commercial terms. This software is free and may not be used for commercial purposes.

## Author

Bruno Morillo ([@brmorillo](https://github.com/brmorillo)) - bruno@rmorillo.com

## Versionamento

Este projeto utiliza o padrão de Conventional Commits para controle de versão automático. Ao fazer um commit:

1. Use o comando `npm run commit` para garantir que seu commit siga o padrão correto
2. O sistema automaticamente:
   - Incrementa a versão com base no tipo de commit (feat: minor, fix: patch, BREAKING CHANGE: major)
   - Gera uma nova tag com a versão atualizada
   - Atualiza o CHANGELOG.md com as alterações
   - Faz push das alterações e tags para o repositório remoto

### Tipos de commit e seu impacto na versão

- `feat`: Nova funcionalidade (incrementa versão minor)
- `fix`: Correção de bug (incrementa versão patch)
- `docs`: Alterações na documentação (não incrementa versão)
- `style`: Alterações de formatação (não incrementa versão)
- `refactor`: Refatoração de código (não incrementa versão)
- `perf`: Melhorias de performance (não incrementa versão)
- `test`: Adição ou correção de testes (não incrementa versão)
- `chore`: Alterações em ferramentas de build (não incrementa versão)

Para indicar uma mudança que quebra compatibilidade (BREAKING CHANGE), adicione `BREAKING CHANGE:` no corpo ou rodapé do commit.
## Versionamento

Este projeto utiliza o padrão de Conventional Commits para controle de versão.

### Como fazer commits

1. Use o comando `pnpm commit` para garantir que seu commit siga o padrão correto
   - Isso iniciará um assistente interativo para criar um commit padronizado

### Como gerar uma nova versão

Quando estiver pronto para lançar uma nova versão:

1. Execute `pnpm version:bump`
   - Isso incrementará a versão com base nos commits (feat: minor, fix: patch, BREAKING CHANGE: major)
   - Gerará uma nova tag com a versão atualizada
   - Atualizará o CHANGELOG.md com as alterações
   - Fará push das alterações e tags para o repositório remoto

### Tipos de commit e seu impacto na versão

- `feat`: Nova funcionalidade (incrementa versão minor)
- `fix`: Correção de bug (incrementa versão patch)
- `docs`: Alterações na documentação (não incrementa versão)
- `style`: Alterações de formatação (não incrementa versão)
- `refactor`: Refatoração de código (não incrementa versão)
- `perf`: Melhorias de performance (não incrementa versão)
- `test`: Adição ou correção de testes (não incrementa versão)
- `chore`: Alterações em ferramentas de build (não incrementa versão)

Para indicar uma mudança que quebra compatibilidade (BREAKING CHANGE), adicione `BREAKING CHANGE:` no corpo ou rodapé do commit.