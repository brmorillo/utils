# @brmorillo/utils

Biblioteca de utilitários para projetos JavaScript/TypeScript.

## Estrutura de Testes

Os testes estão organizados em uma estrutura híbrida que combina organização por tipo de teste com organização por funcionalidade:

```
tests/
├── unit/                  # Testes unitários
│   ├── array.service.spec.ts
│   ├── string.service.spec.ts
│   └── ...
├── integration/           # Testes de integração
│   ├── array.service.int-spec.ts
│   ├── string.service.int-spec.ts
│   └── ...
└── benchmark/             # Testes de benchmark/performance
    ├── array.service.bench.ts
    ├── string.service.bench.ts
    └── ...
```

### Tipos de Testes

- **Testes Unitários**: Testam unidades individuais de código isoladamente
- **Testes de Integração**: Testam a interação entre diferentes partes do código
- **Testes de Benchmark**: Medem e garantem o desempenho do código

### Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de integração
npm run test:integration

# Executar apenas testes de benchmark
npm run test:benchmark
```

## Convenções de Nomenclatura

- Testes unitários: `[nome-do-servico].spec.ts`
- Testes de integração: `[nome-do-servico].int-spec.ts`
- Testes de benchmark: `[nome-do-servico].bench.ts`

## Desenvolvimento

### Instalação

```bash
npm install
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```