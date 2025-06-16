# Padrões de Testes

Este documento define os padrões para escrever e manter testes neste projeto.

## Estrutura de Diretórios

- **Organização por tipo de teste**
  - Testes unitários: `tests/unit/[nome-do-servico].spec.ts`
  - Testes de integração: `tests/integration/[nome-do-servico].int-spec.ts`
  - Testes de benchmark: `tests/benchmark/[nome-do-servico].bench.ts`

## Tipos de Testes

### Testes Unitários

- **Propósito**: Testar unidades individuais de código (funções, métodos) isoladamente
- **Nomenclatura**: `[nome-do-servico].spec.ts`
- **Características**:
  - Testes rápidos e leves
  - Sem dependências externas
  - Mockam dependências quando necessário
  - Testam um único comportamento por teste

### Testes de Integração

- **Propósito**: Testar a interação entre diferentes partes do código
- **Nomenclatura**: `[nome-do-servico].int-spec.ts`
- **Características**:
  - Testam fluxos completos
  - Podem envolver múltiplos métodos ou classes
  - Verificam se as partes trabalham bem juntas

### Testes de Benchmark

- **Propósito**: Medir e garantir o desempenho do código
- **Nomenclatura**: `[nome-do-servico].bench.ts`
- **Características**:
  - Medem o tempo de execução
  - Executam operações em massa
  - Verificam limites de desempenho
  - São opcionais em execuções normais de teste

## Estrutura dos Testes

- **Organização com `describe` e `it`**
  ```typescript
  describe('NomeClasse', () => {
    describe('nomeMetodo', () => {
      it('deve fazer algo específico quando condições específicas', () => {
        // Teste aqui
      });
      
      it('deve lançar erro quando entrada inválida', () => {
        // Teste aqui
      });
    });
  });
  ```

- **Padrão AAA (Arrange-Act-Assert)**
  ```typescript
  it('deve fazer algo específico', () => {
    // Arrange (Preparar)
    const input = { value: 'test' };
    
    // Act (Agir)
    const result = ClasseTestada.metodo(input);
    
    // Assert (Verificar)
    expect(result).toBe('valor esperado');
  });
  ```

## Configuração do Test Runner

- **Jest Config**
  ```javascript
  // jest.config.js
  module.exports = {
    projects: [
      '<rootDir>/tests/unit',
      '<rootDir>/tests/integration',
      '<rootDir>/tests/benchmark',
    ],
    // Outras configurações...
  };
  ```

- **Execução seletiva de testes**
  ```bash
  # Executar apenas testes unitários
  npm test -- --selectProjects=unit
  
  # Executar apenas testes de integração
  npm test -- --selectProjects=integration
  
  # Executar apenas testes de benchmark
  npm test -- --selectProjects=benchmark
  ```

## Boas Práticas

- **Teste Casos de Sucesso e Erro**
  - Teste o comportamento normal/esperado
  - Teste entradas inválidas e casos de borda
  - Teste exceções e tratamento de erros

- **Testes Independentes**
  - Cada teste deve ser independente dos outros
  - Não deve haver dependências entre testes
  - Use `beforeEach` para configuração comum

- **Nomes Descritivos**
  - Use nomes que descrevem o comportamento esperado
  - Formato: "deve [resultado esperado] quando [condição]"
  - Exemplo: "deve lançar erro quando input é vazio"

- **Asserções Precisas**
  - Use asserções específicas (não apenas `.toBeTruthy()`)
  - Verifique valores exatos quando possível
  - Use matchers apropriados do Jest

## Manutenção de Testes

- **Atualize Testes ao Modificar Código**
  - Ao alterar comportamento, atualize os testes correspondentes
  - Ao corrigir bugs, adicione testes que reproduzem o bug

- **Evite Testes Frágeis**
  - Evite dependências de tempo (use mocks para Date)
  - Evite dependências de ordem de execução
  - Evite dependências de ambiente

- **Cobertura de Código**
  - Mantenha alta cobertura de código (>80%)
  - Foque na qualidade dos testes, não apenas na cobertura
  - Teste lógica complexa com mais rigor

## Exemplos

### Exemplo de Teste Unitário

```typescript
// tests/unit/string.service.spec.ts
import { StringUtils } from '../../src/services/string.service';

describe('StringUtils', () => {
  describe('capitalizeFirstLetter', () => {
    it('deve capitalizar a primeira letra de uma string', () => {
      const result = StringUtils.capitalizeFirstLetter({ input: 'hello' });
      expect(result).toBe('Hello');
    });

    it('deve retornar string vazia quando input é vazio', () => {
      const result = StringUtils.capitalizeFirstLetter({ input: '' });
      expect(result).toBe('');
    });

    it('deve lançar erro quando input não é string', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        StringUtils.capitalizeFirstLetter({ input: 123 });
      }).toThrow('Invalid input');
    });
  });
});
```

### Exemplo de Teste de Benchmark

```typescript
// tests/benchmark/array.service.bench.ts
import { ArrayUtils } from '../../src/services/array.service';

describe('ArrayUtils - Benchmark', () => {
  const measureTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // ms
  };

  describe('removeDuplicates', () => {
    it('deve processar 10.000 itens em tempo razoável', () => {
      const array = Array.from({ length: 10000 }, (_, i) => i % 1000);
      
      const time = measureTime(() => {
        ArrayUtils.removeDuplicates({ array });
      });
      
      console.log(`Tempo para remover duplicatas: ${time.toFixed(2)}ms`);
      expect(time).toBeLessThan(50); // 50ms
    });
  });
});
```

### Exemplo de Teste de Integração

```typescript
// tests/integration/snowflake.service.int-spec.ts
import { SnowflakeUtils } from '../../src/services/snowflake.service';

describe('SnowflakeUtils - Integração', () => {
  it('deve gerar, decodificar e extrair timestamp corretamente', () => {
    const testEpoch = new Date('2023-01-01T00:00:00.000Z');
    
    // Gera um ID
    const id = SnowflakeUtils.generate({ epoch: testEpoch });
    
    // Decodifica o ID
    const components = SnowflakeUtils.decode({
      snowflakeId: id,
      epoch: testEpoch,
    });
    
    // Extrai o timestamp
    const timestamp = SnowflakeUtils.getTimestamp({
      snowflakeId: id,
      epoch: testEpoch,
    });
    
    // Verifica se o timestamp extraído corresponde ao componente timestamp
    expect(timestamp.getTime()).toBe(Number(components.timestamp));
  });
});
```