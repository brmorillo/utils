import { NumberUtils } from '../../src/services/number.service';

/**
 * Testes de integração para a classe NumberUtils.
 * Estes testes verificam cenários mais complexos que envolvem múltiplos métodos.
 */
describe('NumberUtils - Testes de Integração', () => {
  describe('Operações encadeadas', () => {
    it('deve processar corretamente uma sequência de operações numéricas', () => {
      // Cenário: Processar um valor através de múltiplas operações
      // 1. Começar com um valor negativo
      const valorInicial = -15.7;

      // 2. Normalizar o valor (converter -0 para 0, mas não afeta outros valores)
      const valorNormalizado = NumberUtils.normalize({ value: valorInicial });

      // 3. Verificar se é positivo (deve ser falso para valor negativo)
      const ehPositivo = NumberUtils.isPositive({ value: valorNormalizado });

      // 4. Obter o valor absoluto usando Math.abs
      const valorAbsoluto = Math.abs(valorNormalizado);

      // 5. Arredondar para o inteiro mais próximo
      const valorArredondado = NumberUtils.roundToNearest({
        value: valorAbsoluto,
      });

      // 6. Verificar se é par
      const ehPar = NumberUtils.isValidEven({ value: valorArredondado });

      // Verificações
      expect(valorNormalizado).toBe(-15.7); // Normalização não afeta valores diferentes de -0
      expect(ehPositivo).toBe(false); // Valor é negativo
      expect(valorAbsoluto).toBe(15.7); // Valor absoluto
      expect(valorArredondado).toBe(16); // Arredondado para o inteiro mais próximo
      expect(ehPar).toBe(true); // 16 é par
    });

    it('deve realizar cálculos financeiros com precisão', () => {
      // Cenário: Calcular valores financeiros com arredondamento adequado
      // 1. Valor base
      const valorBase = 99.99;

      // 2. Aplicar desconto de 15%
      const valorComDesconto = valorBase * 0.85;

      // 3. Arredondar para 2 casas decimais
      const valorArredondado = NumberUtils.roundToDecimals({
        value: valorComDesconto,
        decimals: 2,
      });

      // 4. Converter para centavos (inteiro)
      const valorEmCentavos = NumberUtils.toCents({ value: valorArredondado });

      // 5. Formatar com 2 casas decimais
      const valorFormatado = NumberUtils.addDecimalPlaces({
        value: valorArredondado,
        decimalPlaces: 2,
      });

      // Verificações
      expect(valorComDesconto).toBeCloseTo(84.9915); // Valor com desconto
      expect(valorArredondado).toBe(84.99); // Arredondado para 2 casas decimais
      expect(valorEmCentavos).toBe(8499); // Convertido para centavos
      expect(valorFormatado).toBe('84.99'); // Formatado com 2 casas decimais
    });

    it('deve lidar corretamente com limites e restrições', () => {
      // Cenário: Processar valores com limites e restrições
      // 1. Gerar um número aleatório entre 0 e 100
      const valorAleatorio = NumberUtils.randomIntegerInRange({
        min: 0,
        max: 100,
      });

      // 2. Limitar o valor entre 10 e 90
      const valorLimitado = NumberUtils.clamp({
        value: valorAleatorio,
        min: 10,
        max: 90,
      });

      // 3. Verificar se é primo
      const ehPrimo = NumberUtils.isValidPrime({ value: valorLimitado });

      // 4. Calcular o fatorial se for menor que 10, ou 0 caso contrário
      const fatorial =
        valorLimitado < 10
          ? NumberUtils.factorial({ value: valorLimitado })
          : 0;

      // Verificações
      expect(valorAleatorio).toBeGreaterThanOrEqual(0);
      expect(valorAleatorio).toBeLessThanOrEqual(100);
      expect(valorLimitado).toBeGreaterThanOrEqual(10);
      expect(valorLimitado).toBeLessThanOrEqual(90);
      // Não podemos verificar ehPrimo ou fatorial diretamente pois dependem do valor aleatório
    });
  });

  describe('Cenários de uso real', () => {
    it('deve calcular corretamente valores de parcelas', () => {
      // Cenário: Calcular parcelas de um financiamento
      // 1. Valor total
      const valorTotal = 1200;

      // 2. Número de parcelas
      const numeroParcelas = 5;

      // 3. Calcular valor da parcela
      const valorParcela = valorTotal / numeroParcelas;

      // 4. Arredondar para 2 casas decimais
      const valorParcelaArredondado = NumberUtils.roundToDecimals({
        value: valorParcela,
        decimals: 2,
      });

      // 5. Calcular valor total após arredondamento
      const valorTotalRecalculado = valorParcelaArredondado * numeroParcelas;

      // 6. Calcular diferença devido ao arredondamento
      const diferenca = NumberUtils.roundToDecimals({
        value: valorTotal - valorTotalRecalculado,
        decimals: 2,
      });

      // Verificações
      expect(valorParcela).toBe(240);
      expect(valorParcelaArredondado).toBe(240);
      expect(valorTotalRecalculado).toBe(1200);
      expect(diferenca).toBe(0);
    });

    it('deve calcular corretamente estatísticas de uma amostra', () => {
      // Cenário: Calcular estatísticas básicas de uma amostra de dados
      // 1. Amostra de dados
      const amostra = [15.7, 22.3, 18.9, 24.5, 19.2];

      // 2. Calcular média
      const soma = amostra.reduce((acc, val) => acc + val, 0);
      const media = soma / amostra.length;

      // 3. Arredondar média para 1 casa decimal
      const mediaArredondada = NumberUtils.roundToDecimals({
        value: media,
        decimals: 1,
      });

      // 4. Encontrar valor mínimo e máximo
      const minimo = Math.min(...amostra);
      const maximo = Math.max(...amostra);

      // 5. Calcular amplitude
      const amplitude = maximo - minimo;

      // Verificações
      expect(mediaArredondada).toBe(20.1);
      expect(minimo).toBe(15.7);
      expect(maximo).toBe(24.5);
      expect(amplitude).toBe(8.8);
    });

    it('deve converter corretamente entre diferentes unidades', () => {
      // Cenário: Converter valores entre diferentes unidades
      // 1. Valor em metros
      const valorMetros = 5280;

      // 2. Converter para quilômetros (dividir por 1000)
      const valorQuilometros = valorMetros / 1000;

      // 3. Converter para milhas (multiplicar por 0.621371)
      const valorMilhas = valorQuilometros * 0.621371;

      // 4. Arredondar para 2 casas decimais
      const valorMilhasArredondado = NumberUtils.roundToDecimals({
        value: valorMilhas,
        decimals: 2,
      });

      // 5. Converter de volta para metros
      const valorMetrosRecalculado = (valorMilhasArredondado / 0.621371) * 1000;

      // 6. Calcular diferença devido ao arredondamento
      const diferencaPercentual =
        Math.abs(valorMetros - valorMetrosRecalculado) / valorMetros;

      // Verificações
      expect(valorQuilometros).toBe(5.28);
      expect(valorMilhasArredondado).toBe(3.28);
      expect(valorMetrosRecalculado).toBeCloseTo(5280, -1); // Tolerância maior devido a conversões
      expect(diferencaPercentual).toBeLessThan(0.01); // Diferença menor que 1%
    });
  });
});