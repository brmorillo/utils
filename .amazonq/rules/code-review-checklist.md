# Checklist de Revisão de Código

Use esta checklist ao revisar código ou ao preparar código para revisão.

## Funcionalidade

- [ ] O código implementa corretamente a funcionalidade pretendida?
- [ ] O código lida adequadamente com casos de borda?
- [ ] O código valida adequadamente as entradas?
- [ ] O código lança erros apropriados quando necessário?
- [ ] O código é eficiente em termos de desempenho?

## Qualidade do Código

- [ ] O código segue os padrões de codificação do projeto?
- [ ] O código é DRY (Don't Repeat Yourself)?
- [ ] O código é legível e fácil de entender?
- [ ] Os nomes de variáveis, funções e classes são descritivos e seguem as convenções?
- [ ] O código está livre de código morto ou comentado?

## Tipagem e Documentação

- [ ] Todas as funções e métodos têm tipos adequados para parâmetros e retornos?
- [ ] Todas as interfaces e tipos estão bem definidos?
- [ ] Todos os métodos públicos têm documentação JSDoc completa?
- [ ] Os exemplos na documentação são corretos e úteis?
- [ ] Há comentários explicando lógica complexa quando necessário?

## Testes

- [ ] Existem testes unitários para a nova funcionalidade?
- [ ] Os testes cobrem casos de sucesso e casos de erro?
- [ ] Os testes são independentes uns dos outros?
- [ ] Os testes são significativos e não apenas para aumentar a cobertura?
- [ ] Todos os testes passam?

## Segurança

- [ ] O código valida e sanitiza todas as entradas?
- [ ] O código evita vulnerabilidades comuns?
- [ ] O código não expõe informações sensíveis?
- [ ] O código lida adequadamente com erros sem expor detalhes internos?

## Compatibilidade

- [ ] O código é compatível com as versões suportadas do Node.js?
- [ ] O código funciona tanto em ESM quanto em CommonJS?
- [ ] O código é compatível com diferentes sistemas operacionais?
- [ ] O código mantém compatibilidade com versões anteriores quando apropriado?

## Estilo e Formatação

- [ ] O código segue as regras do ESLint e Prettier?
- [ ] A indentação e formatação são consistentes?
- [ ] As importações estão organizadas adequadamente?
- [ ] Não há problemas de lint ou formatação?

## Commits e Pull Requests

- [ ] Os commits seguem o padrão de mensagens do Conventional Commits?
- [ ] O PR tem uma descrição clara do que foi alterado e por quê?
- [ ] O CHANGELOG.md foi atualizado quando apropriado?
- [ ] A versão foi incrementada de acordo com o SemVer quando apropriado?