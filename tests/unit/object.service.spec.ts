import { ObjectUtils } from '../../src/services/object.service';

/**
 * Testes unitários para a classe ObjectUtils.
 * Estes testes verificam o comportamento de cada método individualmente.
 */
describe('ObjectUtils - Testes Unitários', () => {
  describe('findValue', () => {
    it('deve encontrar um valor em um objeto usando uma chave simples', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.findValue<number>({ obj, path: 'a' });
      expect(result).toBe(1);
    });

    it('deve encontrar um valor em um objeto usando um caminho aninhado', () => {
      const obj = { user: { address: { city: 'NY' } } };
      const result = ObjectUtils.findValue<string>({
        obj,
        path: 'user.address.city',
      });
      expect(result).toBe('NY');
    });

    it('deve retornar undefined para um caminho que não existe', () => {
      const obj = { user: { address: { city: 'NY' } } };
      const result = ObjectUtils.findValue<string>({
        obj,
        path: 'user.phone.number',
      });
      expect(result).toBeUndefined();
    });

    it('deve lidar com objetos vazios', () => {
      const obj = {};
      const result = ObjectUtils.findValue<any>({ obj, path: 'a.b.c' });
      expect(result).toBeUndefined();
    });
  });

  describe('deepClone', () => {
    it('deve criar uma cópia profunda de um objeto', () => {
      const original = { a: { b: 1 } };
      const clone = ObjectUtils.deepClone({ obj: original });

      // Modifica o clone
      clone.a.b = 2;

      // Verifica que o original não foi modificado
      expect(original.a.b).toBe(1);
      expect(clone.a.b).toBe(2);
    });

    it('deve criar uma cópia profunda de um array', () => {
      const original = [1, 2, { a: 3 }] as const;
      const clone = ObjectUtils.deepClone({ obj: original });

      // Modifica o clone
      (clone[2] as any).a = 4;

      // Verifica que o original não foi modificado
      expect((original[2] as any).a).toBe(3);
      expect((clone[2] as any).a).toBe(4);
    });

    it('deve lidar com valores primitivos', () => {
      const original = 42;
      const clone = ObjectUtils.deepClone({ obj: original });
      expect(clone).toBe(42);
    });

    it('deve lançar erro para objetos com referências circulares', () => {
      const circular: any = { a: 1 };
      circular.self = circular;

      expect(() => {
        ObjectUtils.deepClone({ obj: circular });
      }).toThrow();
    });
  });

  describe('deepMerge', () => {
    it('deve mesclar objetos simples', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };

      const result = ObjectUtils.deepMerge({ target, source });

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('deve mesclar objetos aninhados', () => {
      const target = { a: { b: 1, c: 2 } };
      const source = { a: { c: 3, d: 4 } };

      const result = ObjectUtils.deepMerge({ target, source });

      expect(result).toEqual({ a: { b: 1, c: 3, d: 4 } });
    });

    it('deve concatenar arrays', () => {
      const target = { a: [1, 2] };
      const source = { a: [3, 4] };

      const result = ObjectUtils.deepMerge({ target, source });

      expect(result).toEqual({ a: [1, 2, 3, 4] });
    });

    it('deve lidar com valores null ou não-objetos', () => {
      const target = { a: 1 };
      const source = null as any;

      const result = ObjectUtils.deepMerge({ target, source });

      expect(result).toEqual({ a: 1 });
    });
  });

  describe('pick', () => {
    it('deve selecionar chaves específicas de um objeto', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = ObjectUtils.pick({ obj, keys: ['a', 'c'] });

      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('deve retornar um objeto vazio se nenhuma chave for encontrada', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.pick({ obj, keys: ['c', 'd'] as any });

      expect(result).toEqual({});
    });

    it('deve lidar com objetos aninhados', () => {
      const obj = { a: 1, b: { x: 10 }, c: 3 };
      const result = ObjectUtils.pick({ obj, keys: ['b'] });

      expect(result).toEqual({ b: { x: 10 } });
    });
  });

  describe('omit', () => {
    it('deve omitir chaves específicas de um objeto', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = ObjectUtils.omit({ obj, keys: ['b'] });

      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('deve retornar o objeto original se nenhuma chave for omitida', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.omit({ obj, keys: ['c', 'd'] as any });

      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('deve lidar com objetos aninhados', () => {
      const obj = { a: 1, b: { x: 10 }, c: 3 };
      const result = ObjectUtils.omit({ obj, keys: ['b'] });

      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe('flattenObject', () => {
    it('deve achatar um objeto aninhado', () => {
      const obj = { a: { b: 1, c: 2 }, d: 3 };
      const result = ObjectUtils.flattenObject({ obj });

      expect(result).toEqual({ 'a.b': 1, 'a.c': 2, d: 3 });
    });

    it('deve lidar com objetos vazios', () => {
      const obj = {};
      const result = ObjectUtils.flattenObject({ obj });

      expect(result).toEqual({});
    });

    it('deve preservar arrays', () => {
      const obj = { a: [1, 2, 3], b: { c: [4, 5] } };
      const result = ObjectUtils.flattenObject({ obj });

      expect(result).toEqual({ a: [1, 2, 3], 'b.c': [4, 5] });
    });

    it('deve usar o prefixo fornecido', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.flattenObject({ obj, prefix: 'test' });

      expect(result).toEqual({ 'test.a': 1, 'test.b': 2 });
    });
  });

  describe('invert', () => {
    it('deve inverter chaves e valores de um objeto', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.invert({ obj });

      expect(result).toEqual({ '1': 'a', '2': 'b' });
    });

    it('deve lidar com valores duplicados', () => {
      const obj = { a: 1, b: 1, c: 2 };
      const result = ObjectUtils.invert({ obj });

      // O último valor sobrescreve os anteriores
      expect(result).toEqual({ '1': 'b', '2': 'c' });
    });

    it('deve lidar com objetos vazios', () => {
      const obj = {};
      const result = ObjectUtils.invert({ obj });

      expect(result).toEqual({});
    });
  });

  describe('deepFreeze', () => {
    it('deve congelar um objeto profundamente', () => {
      const obj = { a: { b: 1 } };
      const frozen = ObjectUtils.deepFreeze({ obj });

      // Verificamos apenas se o objeto foi congelado
      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen.a)).toBe(true);
    });

    it('deve retornar o mesmo objeto', () => {
      const obj = { a: 1 };
      const frozen = ObjectUtils.deepFreeze({ obj });

      expect(frozen).toBe(obj);
    });
  });

  describe('compare', () => {
    it('deve retornar true para objetos idênticos', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 2 } };

      const result = ObjectUtils.compare({ obj1, obj2 });

      expect(result).toBe(true);
    });

    it('deve retornar false para objetos diferentes', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 3 } };

      const result = ObjectUtils.compare({ obj1, obj2 });

      expect(result).toBe(false);
    });

    it('deve retornar true para o mesmo objeto', () => {
      const obj = { a: 1 };

      const result = ObjectUtils.compare({ obj1: obj, obj2: obj });

      expect(result).toBe(true);
    });

    it('deve retornar false para objetos com diferentes chaves', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, c: 2 } as any;

      const result = ObjectUtils.compare({ obj1, obj2 });

      expect(result).toBe(false);
    });

    it('deve lidar com valores null', () => {
      const obj1 = { a: null };
      const obj2 = { a: null };

      const result = ObjectUtils.compare({ obj1, obj2 });

      expect(result).toBe(true);
    });
  });

  describe('groupBy', () => {
    it('deve agrupar chaves por valores', () => {
      const obj = { a: 1, b: 2, c: 1, d: 3 };
      const result = ObjectUtils.groupBy({
        obj,
        // @ts-ignore - Testando propositalmente com valor que será convertido
        callback: value => String(value),
      });

      expect(result).toEqual({
        '1': ['a', 'c'],
        '2': ['b'],
        '3': ['d'],
      });
    });

    it('deve agrupar por resultado de callback personalizado', () => {
      const obj = { a: 5, b: 10, c: 15, d: 20 };
      const result = ObjectUtils.groupBy({
        obj,
        callback: (value): string | number => value % 10,
      });

      expect(result).toEqual({
        '0': ['b', 'd'],
        '5': ['a', 'c'],
      });
    });

    it('deve lidar com objetos vazios', () => {
      const obj = {};
      const result = ObjectUtils.groupBy({
        obj,
        // @ts-ignore - Testando propositalmente com valor que será convertido
        callback: value => String(value),
      });

      expect(result).toEqual({});
    });
  });

  describe('diff', () => {
    it('deve encontrar diferenças entre dois objetos', () => {
      const obj1 = { a: 1, b: 2, c: 3 };
      const obj2 = { a: 1, b: 3, d: 4 } as any;

      const result = ObjectUtils.diff({ obj1, obj2 });

      expect(result).toEqual({ b: 3, d: 4 });
    });

    it('deve retornar objeto vazio se não houver diferenças', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 2 };

      const result = ObjectUtils.diff({ obj1, obj2 });

      expect(result).toEqual({});
    });

    it('deve lidar com objetos aninhados', () => {
      const obj1 = { a: { b: 1 } };
      const obj2 = { a: { b: 2 } } as any;

      const result = ObjectUtils.diff({ obj1, obj2 });

      // Note que a comparação é superficial
      expect(result).toEqual({ a: { b: 2 } });
    });
  });

  describe('unflattenObject', () => {
    it('deve definir um valor em um caminho aninhado', () => {
      const obj = { a: { b: 1 } };
      const result = ObjectUtils.unflattenObject({
        obj,
        path: 'a.c',
        value: 2,
      });

      expect(result).toEqual({ a: { b: 1, c: 2 } });
    });

    it('deve criar objetos intermediários se necessário', () => {
      const obj = {};
      const result = ObjectUtils.unflattenObject({
        obj,
        path: 'a.b.c',
        value: 1,
      });

      expect(result).toEqual({ a: { b: { c: 1 } } });
    });

    it('deve sobrescrever valores existentes', () => {
      const obj = { a: { b: 1 } };
      const result = ObjectUtils.unflattenObject({
        obj,
        path: 'a.b',
        value: 2,
      });

      expect(result).toEqual({ a: { b: 2 } });
    });
  });

  describe('compressObject', () => {
    it('deve comprimir um objeto para uma string JSON', () => {
      const json = { key: 'value', nested: { count: 42 } };
      const result = ObjectUtils.compressObject({ json });

      expect(result).toBe('{"key":"value","nested":{"count":42}}');
    });

    it('deve lançar erro para objetos com referências circulares', () => {
      const circular: any = { key: 'value' };
      circular.self = circular;

      expect(() => {
        ObjectUtils.compressObject({ json: circular });
      }).toThrow('Failed to compress JSON object.');
    });
  });

  describe('decompressObject', () => {
    it('deve descomprimir uma string JSON para um objeto', () => {
      const jsonString = '{"key":"value","nested":{"count":42}}';
      const result = ObjectUtils.decompressObject({ jsonString });

      expect(result).toEqual({ key: 'value', nested: { count: 42 } });
    });

    it('deve lançar erro para strings JSON inválidas', () => {
      const invalidJson = '{"key":"value",}';

      expect(() => {
        ObjectUtils.decompressObject({ jsonString: invalidJson });
      }).toThrow('Failed to decompress JSON string.');
    });
  });

  describe('compressObjectToBase64', () => {
    it('deve comprimir e codificar um objeto para Base64', () => {
      const json = { key: 'value', nested: { count: 42 } };
      const result = ObjectUtils.compressObjectToBase64({
        json,
        urlSafe: false,
      });

      // O resultado esperado é a string JSON codificada em Base64
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^[A-Za-z0-9+/=]+$/); // Padrão Base64
    });

    it('deve gerar Base64 URL-safe quando solicitado', () => {
      const json = { key: 'value+/' };
      const result = ObjectUtils.compressObjectToBase64({
        json,
        urlSafe: true,
      });

      // Não deve conter caracteres '+' ou '/'
      expect(result).not.toMatch(/[+/=]/);
    });

    it('deve lançar erro para objetos com referências circulares', () => {
      const circular: any = { key: 'value' };
      circular.self = circular;

      expect(() => {
        ObjectUtils.compressObjectToBase64({ json: circular, urlSafe: false });
      }).toThrow('Failed to compress and encode JSON object to Base64.');
    });
  });

  describe('decompressBase64ToObject', () => {
    it('deve descomprimir uma string Base64 para um objeto', () => {
      // Esta é a codificação Base64 de '{"key":"value","nested":{"count":42}}'
      const base64String =
        'eyJrZXkiOiJ2YWx1ZSIsIm5lc3RlZCI6eyJjb3VudCI6NDJ9fQ==';
      const result = ObjectUtils.decompressBase64ToObject({ base64String });

      expect(result).toEqual({ key: 'value', nested: { count: 42 } });
    });

    it('deve lançar erro para strings Base64 inválidas', () => {
      const invalidBase64 = 'invalid@@base64';

      expect(() => {
        ObjectUtils.decompressBase64ToObject({ base64String: invalidBase64 });
      }).toThrow('Failed to decompress Base64 string to JSON object.');
    });
  });
});
