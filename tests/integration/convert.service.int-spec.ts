import { ConvertUtils } from '../../src/services/convert.service';

/**
 * Testes de integração para a classe ConvertUtils.
 * Estes testes verificam o comportamento da classe em cenários mais complexos
 * e com interações entre diferentes métodos.
 */
describe('ConvertUtils - Testes de Integração', () => {
  describe('Conversões encadeadas', () => {
    it('deve converter corretamente em uma cadeia de conversões de espaço', () => {
      // Converter de metros para quilômetros e depois para milhas
      const metersToKm = ConvertUtils.space({
        value: 1000,
        fromType: 'meters',
        toType: 'kilometers',
      });
      
      const kmToMiles = ConvertUtils.space({
        value: metersToKm,
        fromType: 'kilometers',
        toType: 'miles',
      });
      
      // Verificar se o resultado é aproximadamente igual à conversão direta
      const directConversion = ConvertUtils.space({
        value: 1000,
        fromType: 'meters',
        toType: 'miles',
      });
      
      expect(kmToMiles).toBeCloseTo(directConversion, 10);
    });

    it('deve converter corretamente em uma cadeia de conversões de peso', () => {
      // Converter de quilogramas para gramas e depois para onças
      const kgToGrams = ConvertUtils.weight({
        value: 1,
        fromType: 'kilograms',
        toType: 'grams',
      });
      
      const gramsToOunces = ConvertUtils.weight({
        value: kgToGrams,
        fromType: 'grams',
        toType: 'ounces',
      });
      
      // Verificar se o resultado é aproximadamente igual à conversão direta
      const directConversion = ConvertUtils.weight({
        value: 1,
        fromType: 'kilograms',
        toType: 'ounces',
      });
      
      expect(gramsToOunces).toBeCloseTo(directConversion, 10);
    });
  });

  describe('Conversões entre diferentes sistemas', () => {
    it('deve converter valores entre diferentes sistemas de medida com precisão', () => {
      // Cenário: Converter um volume de água (1 litro) para seu peso em quilogramas
      // 1 litro de água = 1 kg

      // Primeiro, converter litros para mililitros
      const litersToMilliliters = ConvertUtils.volume({
        value: 1,
        fromType: 'liters',
        toType: 'milliliters',
      });
      
      // Depois, converter mililitros para gramas (1ml de água = 1g)
      // Aqui estamos simulando uma conversão entre sistemas diferentes
      const gramsEquivalent = litersToMilliliters; // 1000 ml = 1000 g
      
      // Por fim, converter gramas para quilogramas
      const gramsToKilograms = ConvertUtils.weight({
        value: gramsEquivalent,
        fromType: 'grams',
        toType: 'kilograms',
      });
      
      // 1 litro de água deve pesar 1 kg
      expect(gramsToKilograms).toBe(1);
    });
  });

  describe('Conversões de valor com diferentes tipos', () => {
    it('deve converter entre diferentes tipos de dados corretamente', () => {
      // Converter número para string
      const numberToString = ConvertUtils.value({
        value: 42,
        toType: 'string',
      });
      
      // Converter string de volta para número
      const stringToNumber = ConvertUtils.value({
        value: numberToString,
        toType: 'number',
      });
      
      // Converter número para romano
      const numberToRoman = ConvertUtils.value({
        value: stringToNumber,
        toType: 'roman',
      });
      
      // Verificar resultados
      expect(numberToString).toBe('42');
      expect(stringToNumber).toBe(42);
      expect(numberToRoman).toBe('XLII');
    });

    it('deve lidar com conversões complexas entre tipos', () => {
      // Converter número para romano
      const numberToRoman = ConvertUtils.value({
        value: 1984,
        toType: 'roman',
      });
      
      // Verificar resultado romano
      expect(numberToRoman).toBe('MCMLXXXIV');
      
      // Converter número para string
      const numberToString = ConvertUtils.value({
        value: 1984,
        toType: 'string',
      });
      
      // Converter string para bigint
      const stringToBigint = ConvertUtils.value({
        value: numberToString,
        toType: 'bigint',
      });
      
      // Verificar resultados
      expect(numberToString).toBe('1984');
      expect(stringToBigint).toBe(1984n);
    });
  });
});