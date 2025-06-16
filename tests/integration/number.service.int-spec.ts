import { NumberUtils } from '../../src/services/number.service';

/**
 * Testes de integração para a classe NumberUtils.
 * Estes testes verificam o comportamento da classe em cenários mais complexos
 * e com interações entre diferentes métodos.
 */
describe('NumberUtils - Testes de Integração', () => {
  describe('Formatação de valores monetários', () => {
    it('deve formatar valores monetários com precisão', () => {
      // Simula um cálculo de preço com desconto
      const precoOriginal = 99.99;
      const percentualDesconto = 15;

      // Calcula o valor do desconto
      const valorDesconto = precoOriginal * (percentualDesconto / 100);

      // Calcula o preço com desconto
      const precoComDesconto = precoOriginal - valorDesconto;

      // Arredonda para 2 casas decimais
      const precoFinal = NumberUtils.roundToDecimals({
        value: precoComDesconto,
      });

      // Formata com 2 casas decimais
      const precoFormatado = NumberUtils.addDecimalPlaces({
        value: precoFinal,
        decimalPlaces: 2,
      });

      // Converte para centavos para armazenamento
      const precoCentavos = NumberUtils.toCents({ value: precoFinal });

      // Verifica os resultados
      expect(precoFinal).toBe(84.99);
      expect(precoFormatado).toBe('84.99');
      expect(precoCentavos).toBe(8499);
    });
  });

  describe('Validação e normalização de entradas', () => {
    it('deve validar e normalizar entradas numéricas', () => {
      // Simula uma entrada de usuário que precisa ser validada
      const entradas = [5.7, -0, 10.123, -3.5];
      const resultados = [];

      for (const entrada of entradas) {
        // Normaliza o valor (converte -0 para 0)
        const valorNormalizado = NumberUtils.normalize({ value: entrada });

        // Verifica se é positivo
        const ehPositivo = NumberUtils.isPositive({ value: valorNormalizado });

        // Limita o valor entre 0 e 10
        const valorLimitado = NumberUtils.clamp({
          value: valorNormalizado,
          min: 0,
          max: 10,
        });

        // Arredonda para o inteiro mais próximo
        const valorArredondado = NumberUtils.roundToNearest({
          value: valorLimitado,
        });

        resultados.push({
          original: entrada,
          normalizado: valorNormalizado,
          ehPositivo,
          limitado: valorLimitado,
          arredondado: valorArredondado,
        });
      }

      // Verifica os resultados
      expect(resultados[0].arredondado).toBe(6); // 5.7 -> 6
      expect(resultados[1].normalizado).toBe(0); // -0 -> 0
      expect(resultados[2].limitado).toBe(10); // 10.123 -> 10
      expect(resultados[3].limitado).toBe(0); // -3.5 -> 0
    });
  });

  describe('Cálculos matemáticos em cadeia', () => {
    it('deve realizar uma série de operações matemáticas', () => {
      // Gera um número aleatório entre 1 e 10
      const numeroAleatorio = NumberUtils.randomFloatInRange({
        min: 1,
        max: 10,
      });

      // Arredonda para 2 casas decimais
      const numeroArredondado = NumberUtils.roundToDecimals({
        value: numeroAleatorio,
        decimals: 2,
      });

      // Verifica se é par ou ímpar após remover casas decimais
      const numeroInteiro = NumberUtils.removeDecimalPlaces({
        value: numeroArredondado,
      });
      const ehPar = NumberUtils.isEven({ value: numeroInteiro });

      // Calcula o fatorial se for um número pequeno e par
      let fatorial = 0;
      if (ehPar && numeroInteiro <= 10) {
        fatorial = NumberUtils.factorial({ value: numeroInteiro });
      }

      // Verifica os resultados
      expect(numeroArredondado).toBeGreaterThanOrEqual(1);
      expect(numeroArredondado).toBeLessThan(10);
      expect(Number.isInteger(numeroInteiro)).toBe(true);

      // Se calculamos o fatorial, verifica se está correto
      if (fatorial > 0) {
        const fatorialEsperado = [
          1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800,
        ];
        expect(fatorial).toBe(fatorialEsperado[numeroInteiro - 1]);
      }
    });
  });

  describe('Geração de sequências numéricas', () => {
    it('deve gerar e processar uma sequência de números', () => {
      const tamanhoSequencia = 10;
      const sequencia = [];

      // Gera uma sequência de números aleatórios
      for (let i = 0; i < tamanhoSequencia; i++) {
        const numero = NumberUtils.randomIntegerInRange({ min: 1, max: 100 });
        sequencia.push(numero);
      }

      // Processa a sequência
      const resultados = {
        pares: 0,
        impares: 0,
        primos: 0,
        maiorNumero: -Infinity,
        menorNumero: Infinity,
      };

      for (const numero of sequencia) {
        // Conta pares e ímpares
        if (NumberUtils.isEven({ value: numero })) {
          resultados.pares++;
        } else {
          resultados.impares++;
        }

        // Conta números primos
        if (NumberUtils.isPrime({ value: numero })) {
          resultados.primos++;
        }

        // Atualiza maior e menor número
        resultados.maiorNumero = Math.max(resultados.maiorNumero, numero);
        resultados.menorNumero = Math.min(resultados.menorNumero, numero);
      }

      // Verifica os resultados
      expect(sequencia.length).toBe(tamanhoSequencia);
      expect(resultados.pares + resultados.impares).toBe(tamanhoSequencia);
      expect(resultados.maiorNumero).toBeGreaterThanOrEqual(
        resultados.menorNumero,
      );

      // Verifica se o maior número está limitado corretamente
      const maiorLimitado = NumberUtils.clamp({
        value: resultados.maiorNumero,
        min: 1,
        max: 100,
      });
      expect(maiorLimitado).toBe(resultados.maiorNumero);
    });
  });

  describe('Operações com números primos', () => {
    it('deve identificar e processar números primos', () => {
      const limite = 20;
      const numerosPrimos = [];

      // Encontra todos os números primos até o limite
      for (let i = 1; i <= limite; i++) {
        if (NumberUtils.isPrime({ value: i })) {
          numerosPrimos.push(i);
        }
      }

      // Verifica se os números primos estão corretos
      const primosEsperados = [2, 3, 5, 7, 11, 13, 17, 19];
      expect(numerosPrimos).toEqual(primosEsperados);

      // Calcula o produto dos números primos menores que 10
      const produtoPrimos = numerosPrimos
        .filter(n => n < 10)
        .reduce((acc, n) => acc * n, 1);

      // Verifica o resultado
      expect(produtoPrimos).toBe(2 * 3 * 5 * 7);
    });
  });
});
