# Regras Específicas do Projeto @brmorillo/utils

Este documento contém regras e diretrizes específicas para o desenvolvimento da biblioteca de utilitários @brmorillo/utils.

## Estrutura de Classes de Utilitários

- **Nomenclatura de Classes**
  - Todas as classes de utilitários devem terminar com o sufixo `Utils`
  - Exemplos: `StringUtils`, `ArrayUtils`, `NumberUtils`

- **Estrutura de Métodos**
  - Métodos devem ser estáticos
  - Parâmetros devem ser passados como objetos nomeados
  - Exemplo:
  ```typescript
  public static methodName({
    param1,
    param2 = defaultValue,
  }: {
    param1: Type1;
    param2?: Type2;
  }): ReturnType {
    // implementação
  }
  ```

## Tratamento de Erros

- **Use o utilitário handleError**
  - Para erros em operações try/catch, use o utilitário `handleError`
  - Exemplo:
  ```typescript
  try {
    // código que pode lançar erro
  } catch (error) {
    handleError('Mensagem descritiva do erro', error);
  }
  ```

- **Validação de Parâmetros**
  - Valide parâmetros no início do método
  - Lance erros com mensagens claras
  - Exemplo:
  ```typescript
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input: must be a non-empty string.');
  }
  ```

## Testes

- **Localização dos Testes**
  - Testes unitários: `tests/unit/[nome-do-servico].spec.ts`
  - Testes de integração: `tests/integration/[nome-do-servico].int-spec.ts`
  - Testes de benchmark: `tests/benchmark/[nome-do-servico].bench.ts`

- **Estrutura de Testes**
  - Use `describe` para agrupar testes por método
  - Use `it` com descrições em português que descrevem o comportamento esperado
  - Teste casos de sucesso e casos de erro para cada método
  - Cada tipo de teste (unitário, integração, benchmark) deve estar em seu próprio arquivo

## Documentação

- **JSDoc Completo**
  - Todos os métodos públicos devem ter documentação JSDoc completa
  - Inclua descrição, parâmetros, tipo de retorno, exceções e exemplos
  - Exemplo:
  ```typescript
  /**
   * Descrição clara do que o método faz.
   * @param {object} params - Os parâmetros para o método.
   * @param {string} params.input - Descrição do parâmetro input.
   * @param {number} [params.option=10] - Descrição do parâmetro opcional com valor padrão.
   * @returns {ReturnType} Descrição do que é retornado.
   * @throws {Error} Descrição de quando um erro é lançado.
   * @example
   * // Exemplo de uso básico
   * const result = ClassName.methodName({ input: 'valor' });
   * console.log(result); // Saída esperada
   */
  ```

## Compatibilidade

- **Compatibilidade com ESM e CommonJS**
  - A biblioteca deve ser compatível com ambos os formatos de módulo
  - Não use recursos específicos de um formato que não funcionem no outro
  - Teste a biblioteca em ambos os ambientes

- **Compatibilidade com Node.js**
  - Suporte as versões LTS do Node.js
  - Evite usar recursos muito recentes que não estão disponíveis em versões LTS

## Versionamento

- **Siga o Versionamento Semântico (SemVer)**
  - Incremento de versão MAJOR para mudanças incompatíveis
  - Incremento de versão MINOR para adições de funcionalidades compatíveis
  - Incremento de versão PATCH para correções de bugs compatíveis

- **Changelog**
  - Mantenha o CHANGELOG.md atualizado com todas as alterações
  - Use o formato do Conventional Changelog