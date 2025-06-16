import { ArrayUtils } from '../../src/services/array.service';

/**
 * Testes unitários para a classe ArrayUtils.
 * Estes testes verificam o comportamento de cada método individualmente.
 */
describe('ArrayUtils', () => {
  // Testes para o método removeDuplicates
  describe('removeDuplicates', () => {
    it('deve remover valores duplicados de um array de números', () => {
// Arrange
const array = [1, 2, 2, 3, 4, 4, 5];

// Act
const result = ArrayUtils.removeDuplicates({ array });

// Assert
expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('deve remover valores duplicados de um array de strings', () => {
// Arrange
const array = ['a', 'b', 'b', 'c', 'a'];

// Act
const result = ArrayUtils.removeDuplicates({ array });

// Assert
expect(result).toEqual(['a', 'b', 'c']);
    });

    it('deve remover duplicados usando uma função de chave personalizada', () => {
// Arrange
const array = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'John (duplicate)' },
];

// Act
const result = ArrayUtils.removeDuplicates({
  array,
  keyFn: item => item.id,
});

// Assert
expect(result).toHaveLength(2);
expect(result[0].id).toBe(1);
expect(result[1].id).toBe(2);
    });

    it('deve retornar um array vazio quando o input é um array vazio', () => {
// Arrange
const array: number[] = [];

// Act
const result = ArrayUtils.removeDuplicates({ array });

// Assert
expect(result).toEqual([]);
    });

    it('deve lançar erro quando o input não é um array', () => {
// Arrange & Act & Assert
expect(() => {
  // @ts-ignore - Testando propositalmente com valor inválido
  ArrayUtils.removeDuplicates({ array: 'not an array' });
}).toThrow('Input must be an array');
    });
  });

  // Testes para o método intersect
  describe('intersect', () => {
    it('deve encontrar a interseção entre dois arrays de números', () => {
// Arrange
const array1 = [1, 2, 3, 4];
const array2 = [3, 4, 5, 6];

// Act
const result = ArrayUtils.intersect({ array1, array2 });

// Assert
expect(result).toEqual([3, 4]);
    });

    it('deve encontrar a interseção entre dois arrays de strings', () => {
// Arrange
const array1 = ['a', 'b', 'c'];
const array2 = ['b', 'c', 'd'];

// Act
const result = ArrayUtils.intersect({ array1, array2 });

// Assert
expect(result).toEqual(['b', 'c']);
    });

    it('deve retornar um array vazio quando não há interseção', () => {
// Arrange
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];

// Act
const result = ArrayUtils.intersect({ array1, array2 });

// Assert
expect(result).toEqual([]);
    });

    it('deve lançar erro quando o primeiro input não é um array', () => {
// Arrange & Act & Assert
expect(() => {
  // @ts-ignore - Testando propositalmente com valor inválido
  ArrayUtils.intersect({ array1: 'not an array', array2: [1, 2, 3] });
}).toThrow('Both inputs must be arrays');
    });

    it('deve lançar erro quando o segundo input não é um array', () => {
// Arrange & Act & Assert
expect(() => {
  // @ts-ignore - Testando propositalmente com valor inválido
  ArrayUtils.intersect({ array1: [1, 2, 3], array2: 'not an array' });
}).toThrow('Both inputs must be arrays');
    });
  });

  // Testes para o método flatten
  describe('flatten', () => {
    it('deve achatar um array multidimensional', () => {
// Arrange
const array = [1, [2, [3, 4]], 5];

// Act
const result = ArrayUtils.flatten({ array });

// Assert
expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('deve retornar o mesmo array quando já está achatado', () => {
// Arrange
const array = [1, 2, 3, 4, 5];

// Act
const result = ArrayUtils.flatten({ array });

// Assert
expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('deve lidar com arrays vazios', () => {
// Arrange
const array = [1, [], 2, [], 3];

// Act
const result = ArrayUtils.flatten({ array });

// Assert
expect(result).toEqual([1, 2, 3]);
    });

    it('deve lançar erro quando o input não é um array', () => {
// Arrange & Act & Assert
expect(() => {
  // @ts-ignore - Testando propositalmente com valor inválido
  ArrayUtils.flatten({ array: 'not an array' });
}).toThrow('Input must be an array');
    });
  });

  // Testes para o método groupBy
  describe('groupBy', () => {
    it('deve agrupar objetos por uma propriedade', () => {
// Arrange
const array = [
  { type: 'fruit', name: 'apple' },
  { type: 'vegetable', name: 'carrot' },
  { type: 'fruit', name: 'banana' },
];

// Act
const result = ArrayUtils.groupBy({
  array,
  keyFn: item => item.type,
});

// Assert
expect(Object.keys(result)).toEqual(['fruit', 'vegetable']);
expect(result.fruit).toHaveLength(2);
expect(result.vegetable).toHaveLength(1);
expect(result.fruit[0].name).toBe('apple');
expect(result.fruit[1].name).toBe('banana');
expect(result.vegetable[0].name).toBe('carrot');
    });

    it('deve agrupar números por paridade', () => {
// Arrange
const array = [1, 2, 3, 4, 5];

// Act
const result = ArrayUtils.groupBy({
  array,
  keyFn: item => item % 2 === 0 ? 'even' : 'odd',
});

// Assert
expect(Object.keys(result)).toEqual(['odd', 'even']);
expect(result.odd).toEqual([1, 3, 5]);
expect(result.even).toEqual([2, 4]);
    });

    it('deve lançar erro quando o input não é um array', () => {
// Arrange & Act & Assert
expect(() => {
  // @ts-ignore - Testando propositalmente com valor inválido
  ArrayUtils.groupBy({ array: 'not an array', keyFn: item => item });
}).toThrow('Input must be an array');
    });
  });

  // Testes para o método shuffle
  describe('shuffle', () => {
    it('deve embaralhar um array mantendo os mesmos elementos', () => {
// Arrange
const array = [1, 2, 3, 4, 5];

// Act
const result = ArrayUtils.shuffle({ array });

// Assert
// Verifica se o resultado tem o mesmo tamanho
expect(result).toHaveLength(array.length);

// Verifica se todos os elementos originais estão presentes
array.forEach(item => {
  expect(result).toContain(item);
});

// Verifica se o array foi realmente embaralhado (pode falhar raramente)
// Como o embaralhamento é aleatório, há uma pequena chance de obter a mesma ordem
const isSameOrder = array.every((item, index) => result[index] === item);

// Se o array for muito pequeno, pode acontecer de ficar na mesma ordem
// então só verificamos se o array tem tamanho suficiente
if (array.length > 3) {
  // É improvável (mas possível) que o array embaralhado seja idêntico ao original
  // Esta verificação pode falhar ocasionalmente, mas é útil para detectar problemas
  expect(isSameOrder).toBe(false);
}
    });

    it('deve retornar uma cópia do array e não modificar o original', () => {
// Arrange
const array = [1, 2, 3, 4, 5];
const originalArray = [...array];

// Act
const result = ArrayUtils.shuffle({ array });

// Assert
expect(array).toEqual(originalArray);
expect(result).not.toBe(array);
    });

    it('deve lançar erro quando o input não é um array', () => {
// Arrange & Act & Assert
expect(() => {
  // @ts-ignore - Testando propositalmente com valor inválido
  ArrayUtils.shuffle({ array: 'not an array' });
}).toThrow('Input must be an array');
    });
  });

  // Testes para o método sort
  describe('sort', () => {
    it('deve ordenar um array de números em ordem ascendente', () => {
// Arrange
const array = [5, 3, 1, 4, 2];

// Act
const result = ArrayUtils.sort({ array, orderBy: 'asc' });

// Assert
expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('deve ordenar um array de números em ordem descendente', () => {
// Arrange
const array = [5, 3, 1, 4, 2];

// Act
const result = ArrayUtils.sort({ array, orderBy: 'desc' });

// Assert
expect(result).toEqual([5, 4, 3, 2, 1]);
    });

    it('deve ordenar um array de objetos por uma propriedade', () => {
// Arrange
const array = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 40 },
];

// Act
const result = ArrayUtils.sort({ array, orderBy: { age: 'asc' } });

// Assert
expect(result[0].age).toBe(25);
expect(result[1].age).toBe(30);
expect(result[2].age).toBe(40);
    });

    it('deve ordenar um array de objetos por múltiplas propriedades', () => {
// Arrange
const array = [
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Jane', age: 25, city: 'Boston' },
  { name: 'Bob', age: 25, city: 'Chicago' },
];

// Act
const result = ArrayUtils.sort({
  array,
  orderBy: { age: 'asc', city: 'asc' },
});

// Assert
expect(result[0].name).toBe('Jane');
expect(result[1].name).toBe('Bob');
expect(result[2].name).toBe('John');
    });

    it('deve lançar erro quando o input não é um array', () => {
// Arrange & Act & Assert
expect(() => {
  // @ts-ignore - Testando propositalmente com valor inválido
  ArrayUtils.sort({ array: 'not an array', orderBy: 'asc' });
}).toThrow('Input must be a non-empty array');
    });

    it('deve lançar erro quando o array está vazio', () => {
// Arrange & Act & Assert
expect(() => {
  ArrayUtils.sort({ array: [], orderBy: 'asc' });
}).toThrow('Input must be a non-empty array');
    });

    it('deve lançar erro quando o formato de orderBy é inválido', () => {
// Arrange & Act & Assert
expect(() => {
  // @ts-ignore - Testando propositalmente com valor inválido
  ArrayUtils.sort({ array: [1, 2, 3], orderBy: 'invalid' });
}).toThrow("Invalid 'orderBy' format");
    });
  });

  // Testes para o método findSubset
  describe('findSubset', () => {
    it('deve encontrar o primeiro objeto que corresponde ao subconjunto', () => {
// Arrange
const array = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
  { id: 3, name: 'John', age: 40 },
];

// Act
const result = ArrayUtils.findSubset({
  array,
  subset: { name: 'John' },
});

// Assert
expect(result).not.toBeNull();
expect(result?.id).toBe(1);
expect(result?.name).toBe('John');
expect(result?.age).toBe(30);
    });

    it('deve encontrar correspondência com múltiplas propriedades', () => {
// Arrange
const array = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
  { id: 3, name: 'John', age: 40 },
];

// Act
const result = ArrayUtils.findSubset({
  array,
  subset: { name: 'John', age: 40 },
});

// Assert
expect(result).not.toBeNull();
expect(result?.id).toBe(3);
    });

    it('deve retornar null quando não encontra correspondência', () => {
// Arrange
const array = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
];

// Act
const result = ArrayUtils.findSubset({
  array,
  subset: { name: 'Bob' },
});

// Assert
expect(result).toBeNull();
    });

    it('deve corresponder arrays dentro de objetos', () => {
// Arrange
const array = [
  { id: 1, tags: ['javascript', 'typescript'] },
  { id: 2, tags: ['python', 'java'] },
];

// Act
const result = ArrayUtils.findSubset({
  array,
  subset: { tags: ['javascript'] },
});

// Assert
expect(result).not.toBeNull();
expect(result?.id).toBe(1);
    });
  });

  // Testes para o método isSubset
  describe('isSubset', () => {
    it('deve verificar se um objeto contém um subconjunto', () => {
// Arrange
const superset = { id: 1, name: 'John', age: 30, city: 'New York' };
const subset = { name: 'John', age: 30 };

// Act
const result = ArrayUtils.isSubset({ superset, subset });

// Assert
expect(result).toBe(true);
    });

    it('deve retornar false quando o subconjunto não está contido', () => {
// Arrange
const superset = { id: 1, name: 'John', age: 30 };
const subset = { name: 'John', city: 'New York' };

// Act
const result = ArrayUtils.isSubset({ superset, subset });

// Assert
expect(result).toBe(false);
    });

    it('deve verificar arrays dentro de objetos', () => {
// Arrange
const superset = { id: 1, tags: ['javascript', 'typescript', 'react'] };
const subset = { tags: ['javascript', 'typescript'] };

// Act
const result = ArrayUtils.isSubset({ superset, subset });

// Assert
expect(result).toBe(true);
    });

    it('deve retornar false quando um array não contém todos os elementos', () => {
// Arrange
const superset = { id: 1, tags: ['javascript', 'react'] };
const subset = { tags: ['javascript', 'typescript'] };

// Act
const result = ArrayUtils.isSubset({ superset, subset });

// Assert
expect(result).toBe(false);
    });
  });
});