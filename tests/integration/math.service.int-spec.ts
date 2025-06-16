import { MathUtils } from '../../src/services/math.service';

/**
 * Testes de integração para a classe MathUtils.
 * Estes testes verificam o comportamento da classe em cenários mais complexos
 * e com interações entre diferentes métodos.
 */
describe('MathUtils - Testes de Integração', () => {
  describe('Cálculos financeiros', () => {
    it('deve calcular e arredondar porcentagens corretamente', () => {
      // Simula um cálculo de desconto
      const precoOriginal = 199.99;
      const precoComDesconto = 149.99;

      // Calcula a porcentagem de desconto
      const porcentagemDesconto = MathUtils.percentage({
        total: precoOriginal,
        part: precoOriginal - precoComDesconto,
      });

      // Arredonda para 2 casas decimais
      const porcentagemArredondada = MathUtils.roundToDecimals({
        value: porcentagemDesconto,
        decimals: 2,
      });

      // Verifica se o resultado está correto (25% de desconto)
      expect(porcentagemArredondada).toBeCloseTo(25.0);
    });
  });

  describe('Cálculos estatísticos', () => {
    it('deve calcular média e desvio dentro de limites', () => {
      // Simula uma série de medições
      const medicoes = [10.2, 9.8, 10.4, 10.1, 9.9, 10.3, 10.0];

      // Calcula a média
      const soma = medicoes.reduce((acc, val) => acc + val, 0);
      const media = soma / medicoes.length;

      // Arredonda a média
      const mediaArredondada = MathUtils.roundToDecimals({
        value: media,
        decimals: 2,
      });

      // Calcula o desvio máximo
      const desvioMaximo = Math.max(...medicoes.map(m => Math.abs(m - media)));

      // Limita o desvio a um valor máximo aceitável
      const desvioLimitado = MathUtils.clamp({
        value: desvioMaximo,
        min: 0,
        max: 0.5,
      });

      // Verifica os resultados
      expect(mediaArredondada).toBe(10.1);
      expect(desvioLimitado).toBeLessThanOrEqual(0.5);
    });
  });

  describe('Operações com frações', () => {
    it('deve simplificar frações usando MDC', () => {
      // Simula uma fração
      const numerador = 24;
      const denominador = 36;

      // Calcula o MDC para simplificar a fração
      const divisorComum = MathUtils.gcd({
        a: numerador,
        b: denominador,
      });

      // Simplifica a fração
      const numeradorSimplificado = numerador / divisorComum;
      const denominadorSimplificado = denominador / divisorComum;

      // Verifica se a fração foi simplificada corretamente (24/36 = 2/3)
      expect(numeradorSimplificado).toBe(2);
      expect(denominadorSimplificado).toBe(3);
    });

    it('deve calcular o denominador comum usando MMC', () => {
      // Simula duas frações
      const fracao1 = { numerador: 1, denominador: 4 };
      const fracao2 = { numerador: 2, denominador: 6 };

      // Calcula o MMC dos denominadores
      const denominadorComum = MathUtils.lcm({
        a: fracao1.denominador,
        b: fracao2.denominador,
      });

      // Ajusta os numeradores para o denominador comum
      const numerador1Ajustado =
        fracao1.numerador * (denominadorComum / fracao1.denominador);
      const numerador2Ajustado =
        fracao2.numerador * (denominadorComum / fracao2.denominador);

      // Soma as frações
      const numeradorSoma = numerador1Ajustado + numerador2Ajustado;

      // Verifica se o resultado está correto (1/4 + 2/6 = 3/12 + 4/12 = 7/12)
      expect(denominadorComum).toBe(12);
      expect(numerador1Ajustado).toBe(3);
      expect(numerador2Ajustado).toBe(4);
      expect(numeradorSoma).toBe(7);
    });
  });

  describe('Geração de números aleatórios com restrições', () => {
    it('deve gerar e limitar números aleatórios', () => {
      // Gera 10 números aleatórios e verifica se estão dentro dos limites
      for (let i = 0; i < 10; i++) {
        // Gera um número aleatório entre -100 e 100
        const numeroAleatorio = MathUtils.randomInRange({
          min: -100,
          max: 100,
        });

        // Limita o número ao intervalo [-50, 50]
        const numeroLimitado = MathUtils.clamp({
          value: numeroAleatorio,
          min: -50,
          max: 50,
        });

        // Verifica se o número limitado está dentro do intervalo
        expect(numeroLimitado).toBeGreaterThanOrEqual(-50);
        expect(numeroLimitado).toBeLessThanOrEqual(50);
      }
    });
  });

  describe('Verificação de propriedades matemáticas', () => {
    it('deve verificar se números são primos e calcular o MDC', () => {
      // Testa se o MDC de dois números primos é 1
      const primos = [11, 13, 17, 19, 23, 29, 31];

      for (let i = 0; i < primos.length; i++) {
        for (let j = i + 1; j < primos.length; j++) {
          const primo1 = primos[i];
          const primo2 = primos[j];

          // Verifica se ambos são primos
          const isPrimo1 = MathUtils.isPrime({ value: primo1 });
          const isPrimo2 = MathUtils.isPrime({ value: primo2 });

          // Calcula o MDC
          const mdc = MathUtils.gcd({ a: primo1, b: primo2 });

          // Verifica os resultados
          expect(isPrimo1).toBe(true);
          expect(isPrimo2).toBe(true);
          expect(mdc).toBe(1); // MDC de dois primos distintos é sempre 1
        }
      }
    });
  });
});
