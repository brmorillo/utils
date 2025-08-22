import { ObjectUtils } from '../../src/services/object.service';

describe('ObjectUtils', () => {
  describe('findValue', () => {
    it('deve encontrar um valor em um objeto por caminho', () => {
      const obj = { a: { b: { c: 42 } } };
      expect(ObjectUtils.findValue({ obj, path: 'a.b.c' })).toBe(42);
    });

    it('deve retornar undefined para caminhos inexistentes', () => {
      const obj = { a: { b: { c: 42 } } };
      expect(ObjectUtils.findValue({ obj, path: 'a.b.d' })).toBeUndefined();
    });

    it('deve funcionar com arrays', () => {
      const obj = { a: { b: [1, 2, { c: 42 }] } };
      expect(ObjectUtils.findValue({ obj, path: 'a.b.2.c' })).toBe(42);
    });

    it('deve respeitar o delimitador personalizado', () => {
      const obj = { a: { b: { c: 42 } } };
      expect(ObjectUtils.findValue({ obj, path: 'a/b/c', delimiter: '/' })).toBe(42);
    });
  });

  describe('deepClone', () => {
    it('deve clonar objetos simples', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
    });

    it('deve clonar objetos aninhados', () => {
      const obj = { a: { b: { c: 42 } } };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone).toEqual(obj);
      expect(clone.a).not.toBe(obj.a);
      expect(clone.a.b).not.toBe(obj.a.b);
    });

    it('deve clonar arrays', () => {
      const obj = { a: [1, 2, 3] };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone).toEqual(obj);
      expect(clone.a).not.toBe(obj.a);
    });

    it('deve clonar datas', () => {
      const date = new Date();
      const obj = { a: date };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone.a).toEqual(date);
      expect(clone.a).not.toBe(date);
    });

    it('deve clonar expressões regulares', () => {
      const regex = /test/g;
      const obj = { a: regex };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone.a).toEqual(regex);
      expect(clone.a).not.toBe(regex);
    });

    it('deve clonar Map', () => {
      const map = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const obj = { a: map };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone.a instanceof Map).toBe(true);
      expect(clone.a).not.toBe(map);
      expect(clone.a.get('a')).toBe(1);
      expect(clone.a.get('b')).toBe(2);
    });

    it('deve clonar Set', () => {
      const set = new Set([1, 2, 3]);
      const obj = { a: set };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone.a instanceof Set).toBe(true);
      expect(clone.a).not.toBe(set);
      expect(clone.a.has(1)).toBe(true);
      expect(clone.a.has(2)).toBe(true);
      expect(clone.a.has(3)).toBe(true);
    });

    it('deve lidar com valores primitivos', () => {
      expect(ObjectUtils.deepClone({ obj: 42 })).toBe(42);
      expect(ObjectUtils.deepClone({ obj: 'test' })).toBe('test');
      expect(ObjectUtils.deepClone({ obj: true })).toBe(true);
      expect(ObjectUtils.deepClone({ obj: null })).toBe(null);
      expect(ObjectUtils.deepClone({ obj: undefined })).toBe(undefined);
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

    it('deve substituir arrays', () => {
      const target = { a: [1, 2] };
      const source = { a: [3, 4] };
      const result = ObjectUtils.deepMerge({ target, source });
      expect(result).toEqual({ a: [3, 4] });
    });

    it('deve adicionar novas propriedades', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const result = ObjectUtils.deepMerge({ target, source });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('deve lidar com objetos vazios', () => {
      const target = {};
      const source = { a: 1 };
      const result = ObjectUtils.deepMerge({ target, source });
      expect(result).toEqual({ a: 1 });
    });

    it('deve preservar o objeto original', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const result = ObjectUtils.deepMerge({ target, source });
      expect(target).toEqual({ a: 1 });
      expect(source).toEqual({ b: 2 });
    });
  });

  describe('pick', () => {
    it('deve selecionar propriedades específicas', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = ObjectUtils.pick({ obj, keys: ['a', 'c'] });
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('deve ignorar propriedades inexistentes', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.pick({ obj, keys: ['a', 'c'] as any });
      expect(result).toEqual({ a: 1 });
    });

    it('deve retornar um objeto vazio se nenhuma propriedade for encontrada', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.pick({ obj, keys: ['c', 'd'] as any });
      expect(result).toEqual({});
    });
  });

  describe('omit', () => {
    it('deve omitir propriedades específicas', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = ObjectUtils.omit({ obj, keys: ['b', 'd'] });
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('deve ignorar propriedades inexistentes', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.omit({ obj, keys: ['b', 'c'] as any });
      expect(result).toEqual({ a: 1 });
    });

    it('deve retornar uma cópia do objeto se nenhuma propriedade for omitida', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.omit({ obj, keys: ['c', 'd'] as any });
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('flattenObject', () => {
    it('deve achatar um objeto aninhado', () => {
      const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
      const result = ObjectUtils.flattenObject({ obj });
      expect(result).toEqual({
        a: 1,
        'b.c': 2,
        'b.d.e': 3,
      });
    });

    it('deve usar o prefixo fornecido', () => {
      const obj = { a: 1, b: { c: 2 } };
      const result = ObjectUtils.flattenObject({ obj, prefix: 'prefix' });
      expect(result).toEqual({
        'prefix.a': 1,
        'prefix.b.c': 2,
      });
    });

    it('deve usar o delimitador fornecido', () => {
      const obj = { a: 1, b: { c: 2 } };
      const result = ObjectUtils.flattenObject({ obj, delimiter: '/' });
      expect(result).toEqual({
        a: 1,
        'b/c': 2,
      });
    });

    it('deve preservar arrays', () => {
      const obj = { a: [1, 2, 3] };
      const result = ObjectUtils.flattenObject({ obj });
      expect(result).toEqual({ a: [1, 2, 3] });
    });

    it('deve preservar objetos vazios', () => {
      const obj = { a: {} };
      const result = ObjectUtils.flattenObject({ obj });
      expect(result).toEqual({});
    });
  });

  describe('unflattenObject', () => {
    it('deve desachatar um objeto', () => {
      const obj = {};
      ObjectUtils.unflattenObject({ obj, path: 'a.b.c', value: 42 });
      expect(obj).toEqual({ a: { b: { c: 42 } } });
    });

    it('deve usar o delimitador fornecido', () => {
      const obj = {};
      ObjectUtils.unflattenObject({ obj, path: 'a/b/c', value: 42, delimiter: '/' });
      expect(obj).toEqual({ a: { b: { c: 42 } } });
    });

    it('deve sobrescrever valores existentes', () => {
      const obj = { a: { b: { c: 1 } } };
      ObjectUtils.unflattenObject({ obj, path: 'a.b.c', value: 42 });
      expect(obj).toEqual({ a: { b: { c: 42 } } });
    });

    it('deve criar objetos intermediários', () => {
      const obj = { a: { d: 1 } };
      ObjectUtils.unflattenObject({ obj, path: 'a.b.c', value: 42 });
      expect(obj).toEqual({ a: { d: 1, b: { c: 42 } } });
    });
  });

  describe('invert', () => {
    it('deve inverter chaves e valores', () => {
      const obj = { a: '1', b: '2', c: '3' };
      const result = ObjectUtils.invert({ obj });
      expect(result).toEqual({ '1': 'a', '2': 'b', '3': 'c' });
    });

    it('deve lidar com valores duplicados', () => {
      const obj = { a: '1', b: '1', c: '2' };
      const result = ObjectUtils.invert({ obj });
      // O último valor sobrescreve os anteriores
      expect(result).toEqual({ '1': 'b', '2': 'c' });
    });

    it('deve converter valores não-string para string', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = ObjectUtils.invert({ obj });
      expect(result).toEqual({ '1': 'a', '2': 'b', '3': 'c' });
    });
  });

  describe('deepFreeze', () => {
    it('deve congelar um objeto', () => {
      const obj = { a: 1, b: 2 };
      const frozen = ObjectUtils.deepFreeze({ obj });
      expect(Object.isFrozen(frozen)).toBe(true);
    });

    it('deve congelar objetos aninhados', () => {
      const obj = { a: { b: { c: 42 } } };
      const frozen = ObjectUtils.deepFreeze({ obj });
      expect(Object.isFrozen(frozen.a)).toBe(true);
      expect(Object.isFrozen(frozen.a.b)).toBe(true);
    });

    it('deve lidar com valores primitivos', () => {
      expect(ObjectUtils.deepFreeze({ obj: 42 })).toBe(42);
      expect(ObjectUtils.deepFreeze({ obj: 'test' })).toBe('test');
      expect(ObjectUtils.deepFreeze({ obj: null })).toBe(null);
    });
  });

  describe('isEmpty', () => {
    it('deve identificar objetos vazios', () => {
      expect(ObjectUtils.isEmpty({ obj: {} })).toBe(true);
    });

    it('deve identificar objetos não vazios', () => {
      expect(ObjectUtils.isEmpty({ obj: { a: 1 } })).toBe(false);
    });
  });

  describe('compare', () => {
    it('deve comparar objetos simples', () => {
      const obj1 = { a: 1 };
      const obj2 = { a: 1 };
      expect(ObjectUtils.compare({ obj1, obj2 })).toBe(true);
      
      const obj3 = { a: 1 };
      const obj4 = { a: 2 };
      expect(ObjectUtils.compare({ obj1: obj3, obj2: obj4 })).toBe(false);
    });

    it('deve comparar objetos aninhados', () => {
      const obj1 = { a: { b: 1 } };
      const obj2 = { a: { b: 1 } };
      expect(ObjectUtils.compare({ obj1, obj2 })).toBe(true);
      
      const obj3 = { a: { b: 1 } };
      const obj4 = { a: { b: 2 } };
      expect(ObjectUtils.compare({ obj1: obj3, obj2: obj4 })).toBe(false);
    });

    it('deve comparar arrays', () => {
      const obj1 = { a: [1, 2, 3] };
      const obj2 = { a: [1, 2, 3] };
      expect(ObjectUtils.compare({ obj1, obj2 })).toBe(true);
      
      const obj3 = { a: [1, 2, 3] };
      const obj4 = { a: [1, 2, 4] };
      expect(ObjectUtils.compare({ obj1: obj3, obj2: obj4 })).toBe(false);
    });
  });

  describe('hasCircularReference', () => {
    it('deve detectar referências circulares', () => {
      const obj: any = { a: 1 };
      obj.self = obj;
      expect(ObjectUtils.hasCircularReference({ obj })).toBe(true);
    });

    it('deve detectar referências circulares aninhadas', () => {
      const obj: any = { a: { b: { c: {} } } };
      obj.a.b.c.d = obj;
      expect(ObjectUtils.hasCircularReference({ obj })).toBe(true);
    });

    it('não deve detectar referências não circulares', () => {
      const obj = { a: { b: { c: 42 } } };
      expect(ObjectUtils.hasCircularReference({ obj })).toBe(false);
    });
  });

  describe('removeUndefined', () => {
    it('deve remover propriedades undefined', () => {
      const obj = { a: 1, b: undefined, c: 3 };
      const result = ObjectUtils.removeUndefined({ obj });
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('deve preservar valores null', () => {
      const obj = { a: 1, b: null, c: 3 };
      const result = ObjectUtils.removeUndefined({ obj });
      expect(result).toEqual({ a: 1, b: null, c: 3 });
    });
  });

  describe('removeNull', () => {
    it('deve remover propriedades null', () => {
      const obj = { a: 1, b: null, c: 3 };
      const result = ObjectUtils.removeNull({ obj });
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('deve preservar valores undefined', () => {
      const obj = { a: 1, b: undefined, c: 3 };
      const result = ObjectUtils.removeNull({ obj });
      expect(result).toEqual({ a: 1, b: undefined, c: 3 });
    });
  });

  describe('diff', () => {
    it('deve encontrar diferenças entre objetos', () => {
      const obj1 = { a: 1, b: 2, c: 3 };
      const obj2 = { a: 1, b: 3, c: 4 };
      const result = ObjectUtils.diff({ obj1, obj2 });
      expect(result).toEqual({
        b: { obj1: 2, obj2: 3 },
        c: { obj1: 3, obj2: 4 },
      });
    });

    it('deve encontrar diferenças em objetos aninhados', () => {
      const obj1 = { a: { b: 1 } };
      const obj2 = { a: { b: 2 } };
      const result = ObjectUtils.diff({ obj1, obj2 });
      expect(result).toEqual({
        a: { obj1: { b: 1 }, obj2: { b: 2 } },
      });
    });
  });

  describe('groupBy', () => {
    it('deve agrupar valores por chave', () => {
      const obj = {
        user1: { id: 'user1', role: 'admin' },
        user2: { id: 'user2', role: 'user' },
        user3: { id: 'user3', role: 'admin' },
      };
      const result = ObjectUtils.groupBy({
        obj,
        callback: user => user.role,
      });
      expect(result).toEqual({
        admin: ['user1', 'user3'],
        user: ['user2'],
      });
    });
  });

  describe('compressObject e decompressObject', () => {
    it('deve comprimir e descomprimir um objeto', () => {
      const obj = { a: 1, b: 2, c: { d: 3 } };
      const compressed = ObjectUtils.compressObject({ json: obj });
      const decompressed = ObjectUtils.decompressObject({
        jsonString: compressed,
      });
      expect(decompressed).toEqual(obj);
    });
  });

  describe('compressObjectToBase64 e decompressBase64ToObject', () => {
    it('deve comprimir e descomprimir um objeto em base64', () => {
      const obj = { a: 1, b: 2, c: { d: 3 } };
      const compressed = ObjectUtils.compressObjectToBase64({ json: obj });
      const decompressed = ObjectUtils.decompressBase64ToObject({
        base64String: compressed,
      });
      expect(decompressed).toEqual(obj);
    });

    it('deve comprimir e descomprimir um objeto em base64 URL-safe', () => {
      const obj = { a: 1, b: 2, c: { d: 3 } };
      const compressed = ObjectUtils.compressObjectToBase64({
        json: obj,
        urlSafe: true,
      });
      const decompressed = ObjectUtils.decompressBase64ToObject({
        base64String: compressed,
        urlSafe: true,
      });
      expect(decompressed).toEqual(obj);
    });
  });

  describe('findSubsetObjects', () => {
    it('deve encontrar objetos que correspondem a um subconjunto', () => {
      const array = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
        { id: 3, name: 'John', age: 40 },
      ];
      const result = ObjectUtils.findSubsetObjects({
        array,
        subset: { name: 'John' },
      });
      expect(result).toEqual([
        { id: 1, name: 'John', age: 30 },
        { id: 3, name: 'John', age: 40 },
      ]);
    });

    it('deve retornar um array vazio se nenhum objeto corresponder', () => {
      const array = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
      ];
      const result = ObjectUtils.findSubsetObjects({
        array,
        subset: { name: 'Bob' },
      });
      expect(result).toEqual([]);
    });
  });

  describe('isSubsetObject', () => {
    it('deve verificar se um objeto é subconjunto de outro', () => {
      const superset = { a: 1, b: 2, c: { d: 3, e: 4 } };
      const subset = { a: 1, c: { d: 3, e: 4 } };
      expect(ObjectUtils.isSubsetObject({ superset, subset })).toBe(true);
    });

    it('deve retornar false se o objeto não for um subconjunto', () => {
      const superset = { a: 1, b: 2, c: { d: 3, e: 4 } };
      const subset = { a: 1, c: { d: 4, e: 4 } };
      expect(ObjectUtils.isSubsetObject({ superset, subset })).toBe(false);
    });

    it('deve retornar false se uma propriedade não existir no superset', () => {
      const superset = { a: 1, b: 2 };
      const subset = { a: 1, c: 3 };
      expect(ObjectUtils.isSubsetObject({ superset, subset })).toBe(false);
    });
  });
});