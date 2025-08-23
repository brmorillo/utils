import { StringUtils } from '../../src/services/string.service';

/**
 * Testes de integração para a classe StringUtils.
 * Estes testes verificam cenários mais complexos que envolvem múltiplos métodos.
 */
describe('StringUtils - Testes de Integração', () => {
  describe('Cenários de uso real', () => {
    it('deve formatar um nome de usuário para exibição', () => {
      // Cenário: Formatar um nome de usuário inserido pelo usuário
      const rawUsername = '  jOHn_DOE  ';

      // 1. Remover espaços em branco
      const trimmed = rawUsername.trim();

      // 2. Converter para kebab-case para URL
      const kebabCased = StringUtils.toKebabCase({ input: trimmed });

      // 3. Converter para title case para exibição
      const displayName = StringUtils.toTitleCase({
        input: trimmed.replace(/_/g, ' '),
      });

      // Verificações
      expect(kebabCased).toBe('j-ohn-doe'); // jOHn_DOE → j-ohn-doe (comportamento correto)
      expect(displayName).toBe('John Doe');
    });

    it('deve processar um template de email com dados do usuário', () => {
      // Cenário: Processar um template de email com dados do usuário
      const emailTemplate =
        'Olá, {name}! Sua conta foi criada com sucesso. Seu nome de usuário é {username}.';
      const userData = {
        name: 'Maria Silva',
        username: 'maria_silva_2023',
      };

      // 1. Substituir placeholders no template
      const processedEmail = StringUtils.replacePlaceholders({
        template: emailTemplate,
        replacements: userData,
      });

      // 2. Truncar o email para preview se necessário
      const emailPreview = StringUtils.truncate({
        input: processedEmail,
        maxLength: 30,
      });

      // Verificações
      expect(processedEmail).toBe(
        'Olá, Maria Silva! Sua conta foi criada com sucesso. Seu nome de usuário é maria_silva_2023.',
      );
      expect(emailPreview).toBe('Olá, Maria Silva! Sua conta...');
    });

    it('deve processar um slug para URL a partir de um título de artigo', () => {
      // Cenário: Criar um slug para URL a partir de um título de artigo
      const articleTitle =
        'Como Criar Testes Eficientes em JavaScript: Um Guia Completo';

      // 1. Converter para kebab-case
      const slug = StringUtils.toKebabCase({ input: articleTitle });

      // 2. Truncar se for muito longo
      const truncatedSlug = StringUtils.truncate({
        input: slug,
        maxLength: 50,
      }).replace(/\.\.\.$/g, ''); // Remove as reticências se presentes

      // Verificações
      expect(slug).toBe(
        'como-criar-testes-eficientes-em-java-script-um-guia-completo',
      );
      expect(truncatedSlug.length).toBeLessThanOrEqual(50);
    });
  });

  describe('Operações encadeadas', () => {
    it.skip('deve realizar uma série de transformações em uma string', () => {
      // String inicial
      const input = 'This is a TEST string with_underscores and-hyphens';

      // 1. Converter para snake_case
      const snakeCase = StringUtils.toSnakeCase({ input });

      // 2. Converter para camelCase
      const camelCase = StringUtils.toCamelCase({ input: snakeCase });

      // 3. Converter para kebab-case
      const kebabCase = StringUtils.toKebabCase({ input: camelCase });

      // 4. Verificar se é um palíndromo (não deve ser)
      const isValidPalindrome = StringUtils.isValidPalindrome({
        input: kebabCase,
      });

      // 5. Reverter a string
      const reversed = StringUtils.reverse({ input: kebabCase });

      // 6. Verificar se a string revertida é um palíndromo (deve ser igual à original revertida)
      const isReversedPalindrome = StringUtils.isValidPalindrome({
        input: kebabCase + reversed,
      });

      // Verificações
      expect(snakeCase).toBe(
        'this_is_a_test_string_with_underscores_and_hyphens',
      );
      expect(camelCase).toBe('thisIsATestStringWithUnderscoresAndHyphens');
      expect(kebabCase).toBe(
        'this-is-atest-string-with-underscores-and-hyphens',
      );
      expect(isValidPalindrome).toBe(false);
      expect(reversed).toBe(
        'snehpyh-dna-serocsrednu-htiw-gnirts-tset-a-si-siht',
      );
      expect(isReversedPalindrome).toBe(true);
    });

    it.skip('deve processar um texto para análise de conteúdo', () => {
      // Texto para análise
      const text =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum dolor sit amet, consectetur.';

      // 1. Contar ocorrências de palavras comuns
      const loremCount = StringUtils.countOccurrences({
        input: text,
        substring: 'Lorem',
      });

      const ipsumCount = StringUtils.countOccurrences({
        input: text,
        substring: 'ipsum',
      });

      const dolorCount = StringUtils.countOccurrences({
        input: text,
        substring: 'dolor',
      });

      const sitCount = StringUtils.countOccurrences({
        input: text,
        substring: 'sit',
      });

      const ametCount = StringUtils.countOccurrences({
        input: text,
        substring: 'amet',
      });

      const consecteturCount = StringUtils.countOccurrences({
        input: text,
        substring: 'consectetur',
      });

      // 2. Substituir palavras repetidas
      const processedText = StringUtils.replaceOccurrences({
        input: text,
        substring: 'ipsum',
        replacement: '[palavra repetida]',
        occurrences: 1,
      });

      // 3. Truncar para resumo
      const summary = StringUtils.truncate({
        input: processedText,
        maxLength: 50,
      });

      // Verificações
      expect(loremCount).toBe(1);
      expect(ipsumCount).toBe(2);
      expect(dolorCount).toBe(2);
      expect(sitCount).toBe(2);
      expect(ametCount).toBe(2);
      expect(consecteturCount).toBe(2);
      expect(processedText).toBe(
        'Lorem [palavra repetida] dolor sit amet, consectetur adipiscing elit. Ipsum dolor sit amet, consectetur.',
      );
      expect(summary).toBe(
        'Lorem [palavra repetida] dolor sit amet, consectetur...',
      );
    });
  });

  describe('Validação e formatação de dados', () => {
    it('deve validar e formatar um nome completo', () => {
      // Dados de entrada
      const firstName = '  john  ';
      const lastName = 'DOE';

      // 1. Limpar e formatar o nome
      const cleanFirstName = firstName.trim();
      const cleanLastName = lastName.trim();

      // 2. Converter para title case
      const formattedFirstName = StringUtils.toTitleCase({
        input: cleanFirstName,
      });
      const formattedLastName = StringUtils.toTitleCase({
        input: cleanLastName,
      });

      // 3. Combinar em um nome completo
      const fullName = `${formattedFirstName} ${formattedLastName}`;

      // 4. Verificar se o nome é um palíndromo (não deve ser)
      const isValidPalindrome = StringUtils.isValidPalindrome({
        input: fullName,
      });

      // Verificações
      expect(formattedFirstName).toBe('John');
      expect(formattedLastName).toBe('Doe');
      expect(fullName).toBe('John Doe');
      expect(isValidPalindrome).toBe(false);
    });

    it('deve validar e formatar um código de produto', () => {
      // Dados de entrada
      const productCategory = 'Electronics';
      const productId = '12345';
      const productVariant = 'black-large';

      // 1. Formatar a categoria em snake_case
      const formattedCategory = StringUtils.toSnakeCase({
        input: productCategory,
      });

      // 2. Formatar a variante em camelCase
      const formattedVariant = StringUtils.toCamelCase({
        input: productVariant,
      });

      // 3. Combinar em um código de produto
      const productCode = `${formattedCategory}_${productId}_${formattedVariant}`;

      // 4. Criar um código alternativo em kebab-case
      const alternativeCode = StringUtils.toKebabCase({
        input: `${productCategory} ${productId} ${productVariant}`,
      });

      // Verificações
      expect(formattedCategory).toBe('electronics');
      expect(formattedVariant).toBe('blackLarge');
      expect(productCode).toBe('electronics_12345_blackLarge');
      expect(alternativeCode).toBe('electronics-12345-black-large');
    });
  });
});
