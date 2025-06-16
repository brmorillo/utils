import { ConvertUtils } from '../../src/services/convert.service';

/**
 * Testes de benchmark para a classe ConvertUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('ConvertUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('Conversão de espaço em massa', () => {
    it('deve converter 100.000 valores de metros para quilômetros em tempo razoável', () => {
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ConvertUtils.space({
            value: i,
            fromType: 'meters',
            toType: 'kilometers',
          });
        }
      });

      console.log(
        `Tempo para converter ${count} valores de metros para quilômetros: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por conversão deve ser menor que 0.001ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.001);
    });
  });

  describe('Conversão de peso em massa', () => {
    it('deve converter 100.000 valores de quilogramas para libras em tempo razoável', () => {
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ConvertUtils.weight({
            value: i,
            fromType: 'kilograms',
            toType: 'pounds',
          });
        }
      });

      console.log(
        `Tempo para converter ${count} valores de quilogramas para libras: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por conversão deve ser menor que 0.001ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.001);
    });
  });

  describe('Conversão de volume em massa', () => {
    it('deve converter 100.000 valores de litros para galões em tempo razoável', () => {
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ConvertUtils.volume({
            value: i,
            fromType: 'liters',
            toType: 'gallons',
          });
        }
      });

      console.log(
        `Tempo para converter ${count} valores de litros para galões: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por conversão deve ser menor que 0.001ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.001);
    });
  });

  describe('Conversão de valor em massa', () => {
    it('deve converter 100.000 valores de string para number em tempo razoável', () => {
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ConvertUtils.value({
            value: i.toString(),
            toType: 'number',
          });
        }
      });

      console.log(
        `Tempo para converter ${count} valores de string para number: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por conversão deve ser menor que 0.001ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.001);
    });

    it('deve converter 10.000 valores de number para roman em tempo razoável', () => {
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 1; i <= count; i++) {
          ConvertUtils.value({
            value: i,
            toType: 'roman',
          });
        }
      });

      console.log(
        `Tempo para converter ${count} valores de number para roman: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por conversão deve ser menor que 0.05ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.05);
    });
  });

  describe('Fluxo completo em massa', () => {
    it('deve executar um fluxo completo de conversões para 10.000 valores em tempo razoável', () => {
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 1; i <= count; i++) {
          // Converter metros para quilômetros
          const kmValue = ConvertUtils.space({
            value: i,
            fromType: 'meters',
            toType: 'kilometers',
          });

          // Converter quilômetros para string
          const strValue = ConvertUtils.value({
            value: kmValue,
            toType: 'string',
          });

          // Converter string de volta para number
          const numValue = ConvertUtils.value({
            value: strValue,
            toType: 'number',
          });

          // Converter number para litros (simulando uma conversão entre sistemas)
          const literValue = numValue;

          // Converter litros para galões
          ConvertUtils.volume({
            value: literValue,
            fromType: 'liters',
            toType: 'gallons',
          });
        }
      });

      console.log(
        `Tempo para executar fluxo completo para ${count} valores: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por fluxo completo deve ser menor que 0.05ms
      const avgTimePerFlow = executionTime / count;
      expect(avgTimePerFlow).toBeLessThan(0.05);
    });
  });
});
