import { StringUtils } from '../../src/services/string.service';

/**
 * Testes de benchmark para a classe StringUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('StringUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('capitalizeFirstLetter', () => {
    it('deve processar 1.000.000 de strings em tempo razoável', () => {
      const input = 'hello world';
      const count = 1000000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.capitalizeFirstLetter({ input });
        }
      });

      console.log(
        `Tempo para capitalizar ${count} strings: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('reverse', () => {
    it('deve processar 1.000.000 de strings em tempo razoável', () => {
      const input = 'hello world';
      const count = 1000000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.reverse({ input });
        }
      });

      console.log(
        `Tempo para reverter ${count} strings: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });

    it('deve processar 10.000 strings longas em tempo razoável', () => {
      // Cria uma string longa de 10.000 caracteres
      const input = 'a'.repeat(10000);
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.reverse({ input });
        }
      });

      console.log(
        `Tempo para reverter ${count} strings longas: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(1);
    });
  });

  describe('isValidPalindrome', () => {
    it('deve processar 1.000.000 de verificações de palíndromo em tempo razoável', () => {
      const input = 'racecar';
      const count = 1000000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.isValidPalindrome({ input });
        }
      });

      console.log(
        `Tempo para verificar ${count} palíndromos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.002ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.002);
    });

    it('deve processar 10.000 verificações de palíndromo com strings complexas em tempo razoável', () => {
      const input = 'A man, a plan, a canal: Panama';
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.isValidPalindrome({ input });
        }
      });

      console.log(
        `Tempo para verificar ${count} palíndromos complexos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('truncate', () => {
    it('deve processar 1.000.000 de truncamentos em tempo razoável', () => {
      const input = 'This is a long string that needs to be truncated';
      const maxLength = 20;
      const count = 1000000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.truncate({ input, maxLength });
        }
      });

      console.log(
        `Tempo para truncar ${count} strings: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('toKebabCase', () => {
    it('deve processar 100.000 conversões para kebab-case em tempo razoável', () => {
      const input = 'ThisIsACamelCaseStringThatNeedsToBeConverted';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.toKebabCase({ input });
        }
      });

      console.log(
        `Tempo para converter ${count} strings para kebab-case: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('toSnakeCase', () => {
    it('deve processar 100.000 conversões para snake_case em tempo razoável', () => {
      const input = 'ThisIsACamelCaseStringThatNeedsToBeConverted';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.toSnakeCase({ input });
        }
      });

      console.log(
        `Tempo para converter ${count} strings para snake_case: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('toCamelCase', () => {
    it('deve processar 100.000 conversões para camelCase em tempo razoável', () => {
      const input = 'this-is-a-kebab-case-string-that-needs-to-be-converted';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.toCamelCase({ input });
        }
      });

      console.log(
        `Tempo para converter ${count} strings para camelCase: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('toTitleCase', () => {
    it('deve processar 100.000 conversões para title case em tempo razoável', () => {
      const input = 'this is a string that needs to be converted to title case';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.toTitleCase({ input });
        }
      });

      console.log(
        `Tempo para converter ${count} strings para title case: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('countOccurrences', () => {
    it('deve processar 100.000 contagens de ocorrências em tempo razoável', () => {
      const input =
        'This is a string with multiple occurrences of the word string. String appears multiple times in this string.';
      const substring = 'string';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.countOccurrences({ input, substring });
        }
      });

      console.log(
        `Tempo para contar ${count} ocorrências: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });

    it('deve processar 10.000 contagens de ocorrências em strings longas em tempo razoável', () => {
      // Cria uma string longa com muitas ocorrências
      const input = 'target'.repeat(1000);
      const substring = 'target';
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.countOccurrences({ input, substring });
        }
      });

      console.log(
        `Tempo para contar ${count} ocorrências em strings longas: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(1);
    });
  });

  describe('replaceAll', () => {
    it('deve processar 100.000 substituições em tempo razoável', () => {
      const input =
        'This is a string with multiple occurrences of the word string. String appears multiple times in this string.';
      const substring = 'string';
      const replacement = 'text';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.replaceAll({ input, substring, replacement });
        }
      });

      console.log(
        `Tempo para realizar ${count} substituições: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('replaceOccurrences', () => {
    it('deve processar 100.000 substituições de ocorrências em tempo razoável', () => {
      const input =
        'This is a string with multiple occurrences of the word string. String appears multiple times in this string.';
      const substring = 'string';
      const replacement = 'text';
      const occurrences = 2;
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.replaceOccurrences({
            input,
            substring,
            replacement,
            occurrences,
          });
        }
      });

      console.log(
        `Tempo para realizar ${count} substituições de ocorrências: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('replacePlaceholders', () => {
    it('deve processar 100.000 substituições de placeholders em tempo razoável', () => {
      const template =
        'Hello, {name}! You have {count} new messages. Your last login was on {date}.';
      const replacements = { name: 'John', count: '5', date: '2023-06-15' };
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.replacePlaceholders({ template, replacements });
        }
      });

      console.log(
        `Tempo para realizar ${count} substituições de placeholders: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });

    it('deve processar 10.000 substituições de placeholders em templates longos em tempo razoável', () => {
      // Cria um template longo com muitos placeholders
      let template = '';
      const replacements: Record<string, string> = {};

      for (let i = 0; i < 100; i++) {
        template += `Field {field${i}} has value {value${i}}. `;
        replacements[`field${i}`] = `field${i}`;
        replacements[`value${i}`] = `value${i}`;
      }

      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.replacePlaceholders({ template, replacements });
        }
      });

      console.log(
        `Tempo para realizar ${count} substituições de placeholders em templates longos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(1);
    });
  });

  describe('Operações combinadas', () => {
    it('deve processar 10.000 operações combinadas em tempo razoável', () => {
      const input = 'This is a test string for benchmark testing';
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          // Sequência de operações
          const kebabCase = StringUtils.toKebabCase({ input });
          const reversed = StringUtils.reverse({ input: kebabCase });
          const isValidPalindrome = StringUtils.isValidPalindrome({
            input: reversed,
          });
          const truncated = StringUtils.truncate({
            input: reversed,
            maxLength: 20,
          });
          const titleCase = StringUtils.toTitleCase({ input: truncated });
        }
      });

      console.log(
        `Tempo para realizar ${count} operações combinadas: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação combinada deve ser menor que 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });
});
