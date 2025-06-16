import { StringUtils } from '../../src/services/string.service';

/**
 * Testes unitários para a classe StringUtils.
 * Estes testes verificam o comportamento de cada método individualmente.
 */
describe('StringUtils - Testes Unitários', () => {
  describe('capitalizeFirstLetter', () => {
    it('deve capitalizar a primeira letra de uma string', () => {
      const result = StringUtils.capitalizeFirstLetter({ input: 'hello' });
      expect(result).toBe('Hello');
    });

    it('deve converter o restante da string para minúsculas', () => {
      const result = StringUtils.capitalizeFirstLetter({ input: 'hELLO' });
      expect(result).toBe('Hello');
    });

    it('deve lidar com strings vazias', () => {
      const result = StringUtils.capitalizeFirstLetter({ input: '' });
      expect(result).toBe('');
    });

    it('deve lidar com strings de um único caractere', () => {
      const result = StringUtils.capitalizeFirstLetter({ input: 'a' });
      expect(result).toBe('A');
    });
  });

  describe('reverse', () => {
    it('deve inverter uma string', () => {
      const result = StringUtils.reverse({ input: 'hello' });
      expect(result).toBe('olleh');
    });

    it('deve lidar com strings vazias', () => {
      const result = StringUtils.reverse({ input: '' });
      expect(result).toBe('');
    });

    it('deve lidar com strings de um único caractere', () => {
      const result = StringUtils.reverse({ input: 'a' });
      expect(result).toBe('a');
    });

    it('deve lidar com strings com espaços', () => {
      const result = StringUtils.reverse({ input: 'hello world' });
      expect(result).toBe('dlrow olleh');
    });
  });

  describe('isPalindrome', () => {
    it('deve identificar um palíndromo simples', () => {
      const result = StringUtils.isPalindrome({ input: 'racecar' });
      expect(result).toBe(true);
    });

    it('deve identificar uma string que não é palíndromo', () => {
      const result = StringUtils.isPalindrome({ input: 'hello' });
      expect(result).toBe(false);
    });

    it('deve ignorar espaços e pontuação', () => {
      const result = StringUtils.isPalindrome({
        input: 'A man, a plan, a canal: Panama',
      });
      expect(result).toBe(true);
    });

    it('deve ignorar maiúsculas e minúsculas', () => {
      const result = StringUtils.isPalindrome({
        input: 'Able was I ere I saw Elba',
      });
      expect(result).toBe(true);
    });

    it('deve lidar com strings vazias', () => {
      const result = StringUtils.isPalindrome({ input: '' });
      expect(result).toBe(true);
    });

    it('deve lidar com strings de um único caractere', () => {
      const result = StringUtils.isPalindrome({ input: 'a' });
      expect(result).toBe(true);
    });
  });

  describe('truncate', () => {
    it('deve truncar uma string longa', () => {
      const result = StringUtils.truncate({
        input: 'This is a long string',
        maxLength: 10,
      });
      expect(result).toBe('This is a...');
    });

    it('não deve truncar uma string curta', () => {
      const result = StringUtils.truncate({
        input: 'Short',
        maxLength: 10,
      });
      expect(result).toBe('Short');
    });

    it('deve truncar exatamente no comprimento máximo', () => {
      const result = StringUtils.truncate({
        input: '1234567890abcdef',
        maxLength: 10,
      });
      expect(result).toBe('1234567890...');
    });

    it('deve remover espaços em branco no final antes de adicionar reticências', () => {
      const result = StringUtils.truncate({
        input: 'Hello world ',
        maxLength: 7,
      });
      expect(result).toBe('Hello...');
    });
  });

  describe('toKebabCase', () => {
    it('deve converter uma string com espaços para kebab-case', () => {
      const result = StringUtils.toKebabCase({ input: 'Hello World' });
      expect(result).toBe('hello-world');
    });

    it('deve converter uma string camelCase para kebab-case', () => {
      const result = StringUtils.toKebabCase({ input: 'camelCaseString' });
      expect(result).toBe('camel-case-string');
    });

    it('deve lidar com múltiplos espaços', () => {
      const result = StringUtils.toKebabCase({ input: 'Hello  World  Test' });
      expect(result).toBe('hello--world--test');
    });

    it('deve lidar com strings já em kebab-case', () => {
      const result = StringUtils.toKebabCase({ input: 'already-kebab-case' });
      expect(result).toBe('already-kebab-case');
    });

    it('deve lidar com strings vazias', () => {
      const result = StringUtils.toKebabCase({ input: '' });
      expect(result).toBe('');
    });
  });

  describe('toSnakeCase', () => {
    it('deve converter uma string com espaços para snake_case', () => {
      const result = StringUtils.toSnakeCase({ input: 'Hello World' });
      expect(result).toBe('hello_world');
    });

    it('deve converter uma string camelCase para snake_case', () => {
      const result = StringUtils.toSnakeCase({ input: 'camelCaseString' });
      expect(result).toBe('camel_case_string');
    });

    it('deve lidar com múltiplos espaços', () => {
      const result = StringUtils.toSnakeCase({ input: 'Hello  World  Test' });
      expect(result).toBe('hello__world__test');
    });

    it('deve lidar com strings já em snake_case', () => {
      const result = StringUtils.toSnakeCase({ input: 'already_snake_case' });
      expect(result).toBe('already_snake_case');
    });

    it('deve lidar com strings vazias', () => {
      const result = StringUtils.toSnakeCase({ input: '' });
      expect(result).toBe('');
    });
  });

  describe('toCamelCase', () => {
    it('deve converter uma string com espaços para camelCase', () => {
      const result = StringUtils.toCamelCase({ input: 'Hello World' });
      expect(result).toBe('helloWorld');
    });

    it('deve converter uma string snake_case para camelCase', () => {
      const result = StringUtils.toCamelCase({ input: 'snake_case_string' });
      expect(result).toBe('snakeCaseString');
    });

    it('deve converter uma string kebab-case para camelCase', () => {
      const result = StringUtils.toCamelCase({ input: 'kebab-case-string' });
      expect(result).toBe('kebabCaseString');
    });

    it('deve lidar com múltiplos separadores', () => {
      const result = StringUtils.toCamelCase({ input: 'hello__world--test' });
      expect(result).toBe('helloWorldTest');
    });

    it('deve lidar com strings já em camelCase', () => {
      const result = StringUtils.toCamelCase({ input: 'alreadyCamelCase' });
      expect(result).toBe('alreadycamelcase');
    });

    it('deve lidar com strings vazias', () => {
      const result = StringUtils.toCamelCase({ input: '' });
      expect(result).toBe('');
    });
  });

  describe('toTitleCase', () => {
    it('deve converter uma string para title case', () => {
      const result = StringUtils.toTitleCase({ input: 'hello world' });
      expect(result).toBe('Hello World');
    });

    it('deve converter uma string toda em maiúsculas para title case', () => {
      const result = StringUtils.toTitleCase({ input: 'HELLO WORLD' });
      expect(result).toBe('Hello World');
    });

    it('deve converter uma string toda em minúsculas para title case', () => {
      const result = StringUtils.toTitleCase({ input: 'hello world' });
      expect(result).toBe('Hello World');
    });

    it('deve lidar com múltiplos espaços', () => {
      const result = StringUtils.toTitleCase({ input: 'hello  world  test' });
      expect(result).toBe('Hello  World  Test');
    });

    it('deve lidar com strings vazias', () => {
      const result = StringUtils.toTitleCase({ input: '' });
      expect(result).toBe('');
    });
  });

  describe('countOccurrences', () => {
    it('deve contar ocorrências de uma substring', () => {
      const result = StringUtils.countOccurrences({
        input: 'hello world hello',
        substring: 'hello',
      });
      expect(result).toBe(2);
    });

    it('deve retornar 0 quando a substring não existe', () => {
      const result = StringUtils.countOccurrences({
        input: 'hello world',
        substring: 'xyz',
      });
      expect(result).toBe(0);
    });

    it('deve contar ocorrências sobrepostas', () => {
      const result = StringUtils.countOccurrences({
        input: 'abababa',
        substring: 'aba',
      });
      expect(result).toBe(2);
    });

    it('deve lidar com strings vazias', () => {
      const result = StringUtils.countOccurrences({
        input: '',
        substring: 'hello',
      });
      expect(result).toBe(0);
    });

    it('deve lidar com substrings vazias', () => {
      const result = StringUtils.countOccurrences({
        input: 'hello',
        substring: '',
      });
      expect(result).toBe(0);
    });
  });

  describe('replaceAll', () => {
    it('deve substituir todas as ocorrências de uma substring', () => {
      const result = StringUtils.replaceAll({
        input: 'hello world hello',
        substring: 'hello',
        replacement: 'hi',
      });
      expect(result).toBe('hi world hi');
    });

    it('deve retornar a string original quando a substring não existe', () => {
      const result = StringUtils.replaceAll({
        input: 'hello world',
        substring: 'xyz',
        replacement: 'abc',
      });
      expect(result).toBe('hello world');
    });

    it('deve lidar com strings vazias', () => {
      const result = StringUtils.replaceAll({
        input: '',
        substring: 'hello',
        replacement: 'hi',
      });
      expect(result).toBe('');
    });

    it('deve lidar com substrings vazias', () => {
      const result = StringUtils.replaceAll({
        input: 'hello',
        substring: '',
        replacement: 'hi',
      });
      expect(result).toBe('hello');
    });
  });

  describe('replaceOccurrences', () => {
    it('deve substituir o número especificado de ocorrências', () => {
      const result = StringUtils.replaceOccurrences({
        input: 'hello world hello world hello',
        substring: 'hello',
        replacement: 'hi',
        occurrences: 2,
      });
      expect(result).toBe('hi world hi world hello');
    });

    it('deve substituir todas as ocorrências quando o número é maior que o total', () => {
      const result = StringUtils.replaceOccurrences({
        input: 'hello world hello',
        substring: 'hello',
        replacement: 'hi',
        occurrences: 5,
      });
      expect(result).toBe('hi world hi');
    });

    it('deve retornar a string original quando a ocorrência é 0', () => {
      const result = StringUtils.replaceOccurrences({
        input: 'hello world hello',
        substring: 'hello',
        replacement: 'hi',
        occurrences: 0,
      });
      expect(result).toBe('hello world hello');
    });

    it('deve retornar a string original quando a substring não existe', () => {
      const result = StringUtils.replaceOccurrences({
        input: 'hello world',
        substring: 'xyz',
        replacement: 'abc',
        occurrences: 1,
      });
      expect(result).toBe('hello world');
    });
  });

  describe('replacePlaceholders', () => {
    it('deve substituir placeholders em um template', () => {
      const result = StringUtils.replacePlaceholders({
        template: 'Hello, {name}! You have {count} new messages.',
        replacements: { name: 'John', count: '5' },
      });
      expect(result).toBe('Hello, John! You have 5 new messages.');
    });

    it('deve manter placeholders não encontrados no mapa de substituições', () => {
      const result = StringUtils.replacePlaceholders({
        template: 'Hello, {name}! You have {count} new messages.',
        replacements: { name: 'John' },
      });
      expect(result).toBe('Hello, John! You have {count} new messages.');
    });

    it('deve lidar com templates sem placeholders', () => {
      const result = StringUtils.replacePlaceholders({
        template: 'Hello, world!',
        replacements: { name: 'John', count: '5' },
      });
      expect(result).toBe('Hello, world!');
    });

    it('deve lidar com templates vazios', () => {
      const result = StringUtils.replacePlaceholders({
        template: '',
        replacements: { name: 'John', count: '5' },
      });
      expect(result).toBe('');
    });

    it('deve lidar com mapa de substituições vazio', () => {
      const result = StringUtils.replacePlaceholders({
        template: 'Hello, {name}!',
        replacements: {},
      });
      expect(result).toBe('Hello, {name}!');
    });
  });
});
