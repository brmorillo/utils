# Padrões de Codificação e Boas Práticas

Este documento define os padrões de codificação e boas práticas a serem seguidos ao trabalhar neste projeto.

## Comandos e Sistema Operacional

- **Sempre verifique o sistema operacional antes de recomendar comandos**
  - Para Windows, use comandos com aspas duplas: `mkdir "pasta\subpasta"`
  - Para Windows, como alternativa, use barras invertidas duplas: `mkdir pasta\\subpasta`
  - Para Linux/macOS, use comandos com formato Unix: `mkdir -p pasta/subpasta`

- **Exemplos de comandos específicos por SO:**
  - Windows: `dir`, `type`, `copy`, `move`, `del`
  - Linux/macOS: `ls`, `cat`, `cp`, `mv`, `rm`

## Tipagem e Documentação

- **Código deve ser fortemente tipado**
  - Evite o uso de `any` sempre que possível
  - Use interfaces e tipos para definir estruturas de dados
  - Utilize genéricos para criar funções e classes reutilizáveis

- **Documentação com JSDoc é obrigatória**
  - Todos os métodos públicos devem ter documentação JSDoc completa
  - Inclua descrição, parâmetros, tipo de retorno e exemplos
  - Formato padrão:
  ```typescript
  /**
   * Descrição da função.
   * @param {object} params - Os parâmetros para o método.
   * @param {string} params.input - Descrição do parâmetro.
   * @returns {ReturnType} Descrição do retorno.
   * @throws {Error} Descrição de quando um erro é lançado.
   * @example
   * // Exemplo de uso
   * const result = funcao({ input: 'valor' });
   */
  ```

- **Comentários no código**
  - Use comentários para explicar lógica complexa
  - Evite comentários óbvios que apenas repetem o que o código faz
  - Prefira código legível a comentários extensos

## Estrutura e Padrões de Projeto

- **Siga o padrão de projeto existente**
  - Mantenha a consistência com o código existente
  - Respeite a estrutura de diretórios do projeto
  - Siga o padrão de nomenclatura existente

- **Classes de Utilidades**
  - Métodos devem ser estáticos
  - Parâmetros devem ser passados como objetos para facilitar extensibilidade
  - Nomes de métodos devem ser descritivos e seguir o padrão camelCase

- **Tratamento de Erros**
  - Use o utilitário `handleError` para tratamento consistente de erros
  - Lance erros com mensagens descritivas
  - Valide parâmetros de entrada no início das funções

## Testes

- **Mantenha os testes atualizados**
  - Ao adicionar ou modificar funcionalidades, atualize os testes correspondentes
  - Testes devem estar na pasta `test/services/` correspondente ao serviço
  - Crie testes unitários, de integração e de benchmark quando apropriado

- **Estrutura de testes**
  - Use `describe` para agrupar testes relacionados
  - Use `it` com descrições claras do que está sendo testado
  - Teste casos de sucesso e casos de erro

## Estilo de Código

- **Siga as configurações do ESLint e Prettier**
  - Não desative regras do ESLint sem uma boa razão
  - Use 2 espaços para indentação
  - Use aspas simples para strings
  - Termine cada arquivo com uma linha em branco

- **Importações e Exportações**
  - Organize as importações em grupos: bibliotecas externas, depois internas
  - Prefira importações nomeadas a importações padrão
  - Exporte interfaces e tipos junto com as classes

## Segurança

- **Valide entradas de usuário**
  - Nunca confie em dados de entrada
  - Sanitize e valide todas as entradas antes de processá-las
  - Use constantes para valores fixos em vez de strings literais

- **Evite vulnerabilidades comuns**
  - Evite eval() e construções similares
  - Tenha cuidado com operações assíncronas e promessas não tratadas
  - Não exponha informações sensíveis em logs ou mensagens de erro