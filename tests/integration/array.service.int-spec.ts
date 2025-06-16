import { ArrayUtils } from '../../src/services/array.service';

/**
 * Testes de integração para a classe ArrayUtils.
 * Estes testes verificam o comportamento da classe em cenários mais complexos
 * e com interações entre diferentes métodos.
 */
describe('ArrayUtils - Testes de Integração', () => {
  describe('Fluxo de processamento de dados', () => {
    it('deve processar um conjunto de dados com múltiplas operações', () => {
      // Arrange - Dados iniciais
      const initialData = [
        { id: 1, category: 'fruit', name: 'apple', tags: ['red', 'sweet'] },
        { id: 2, category: 'vegetable', name: 'carrot', tags: ['orange', 'crunchy'] },
        { id: 3, category: 'fruit', name: 'banana', tags: ['yellow', 'sweet'] },
        { id: 4, category: 'fruit', name: 'apple', tags: ['green', 'sour'] },
        { id: 5, category: 'vegetable', name: 'broccoli', tags: ['green', 'healthy'] },
      ];

      // Act - Fluxo de processamento completo
      
      // 1. Remover duplicatas baseadas no nome
      const uniqueByName = ArrayUtils.removeDuplicates({
        array: initialData,
        keyFn: item => item.name,
      });

      // 2. Agrupar por categoria
      const groupedByCategory = ArrayUtils.groupBy({
        array: uniqueByName,
        keyFn: item => item.category,
      });

      // 3. Ordenar frutas por nome
      const sortedFruits = ArrayUtils.sort({
        array: groupedByCategory.fruit,
        orderBy: { name: 'asc' },
      });

      // 4. Encontrar item com tag específica
      const itemWithSweetTag = ArrayUtils.findSubset({
        array: sortedFruits,
        subset: { tags: ['sweet'] },
      });

      // Assert
      // Verificar se removeu duplicatas corretamente
      expect(uniqueByName).toHaveLength(4); // apple aparece apenas uma vez
      
      // Verificar se agrupou corretamente
      expect(Object.keys(groupedByCategory)).toEqual(['fruit', 'vegetable']);
      expect(groupedByCategory.fruit).toHaveLength(2);
      expect(groupedByCategory.vegetable).toHaveLength(2);
      
      // Verificar se ordenou corretamente
      expect(sortedFruits[0].name).toBe('apple');
      expect(sortedFruits[1].name).toBe('banana');
      
      // Verificar se encontrou o item com a tag correta
      expect(itemWithSweetTag).not.toBeNull();
      expect(itemWithSweetTag?.tags).toContain('sweet');
    });
  });

  describe('Transformação de estruturas de dados', () => {
    it('deve transformar uma estrutura de dados aninhada em uma estrutura plana', () => {
      // Arrange - Estrutura aninhada
      const nestedData = [
        {
          department: 'Engineering',
          employees: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
          ],
        },
        {
          department: 'Marketing',
          employees: [
            { id: 3, name: 'Charlie' },
            { id: 4, name: 'Diana' },
          ],
        },
      ];

      // Act
      // 1. Extrair todos os funcionários em um array plano
      const allEmployees = nestedData.map(dept => dept.employees);
      const flattenedEmployees = ArrayUtils.flatten({ array: allEmployees });
      
      // 2. Ordenar por ID
      const sortedEmployees = ArrayUtils.sort({
        array: flattenedEmployees,
        orderBy: { id: 'asc' },
      });
      
      // 3. Encontrar funcionário específico
      const foundEmployee = ArrayUtils.findSubset({
        array: sortedEmployees,
        subset: { name: 'Charlie' },
      });

      // Assert
      expect(flattenedEmployees).toHaveLength(4);
      expect(sortedEmployees[0].name).toBe('Alice');
      expect(sortedEmployees[3].name).toBe('Diana');
      expect(foundEmployee?.id).toBe(3);
    });
  });

  describe('Operações com conjuntos', () => {
    it('deve realizar operações de conjunto (união, interseção, diferença)', () => {
      // Arrange
      const set1 = [1, 2, 3, 4, 5];
      const set2 = [4, 5, 6, 7, 8];
      const set3 = [1, 3, 5, 7, 9];

      // Act
      // 1. Interseção de set1 e set2
      const intersection12 = ArrayUtils.intersect({
        array1: set1,
        array2: set2,
      });

      // 2. Interseção de set2 e set3
      const intersection23 = ArrayUtils.intersect({
        array1: set2,
        array2: set3,
      });

      // 3. Interseção de todas as interseções (elementos comuns a todos os conjuntos)
      const commonElements = ArrayUtils.intersect({
        array1: intersection12,
        array2: intersection23,
      });

      // 4. União de todos os conjuntos (sem duplicatas)
      const allElements = [...set1, ...set2, ...set3];
      const union = ArrayUtils.removeDuplicates({ array: allElements });

      // 5. Ordenar a união
      const sortedUnion = ArrayUtils.sort({
        array: union,
        orderBy: 'asc',
      });

      // Assert
      expect(intersection12).toEqual([4, 5]);
      expect(intersection23).toEqual([5, 7]);
      expect(commonElements).toEqual([5]);
      expect(sortedUnion).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('Manipulação de dados complexos', () => {
    it('deve processar e transformar dados complexos', () => {
      // Arrange
      const users = [
        { id: 1, name: 'Alice', roles: ['admin', 'user'], active: true },
        { id: 2, name: 'Bob', roles: ['user'], active: false },
        { id: 3, name: 'Charlie', roles: ['user', 'editor'], active: true },
        { id: 4, name: 'Diana', roles: ['user'], active: true },
      ];

      // Act
      // 1. Filtrar apenas usuários ativos
      const activeUsers = users.filter(user => user.active);
      
      // 2. Agrupar por papel
      const usersByRole: Record<string, typeof users> = {};
      activeUsers.forEach(user => {
        user.roles.forEach(role => {
          if (!usersByRole[role]) usersByRole[role] = [];
          usersByRole[role].push(user);
        });
      });
      
      // 3. Remover duplicatas em cada grupo
      Object.keys(usersByRole).forEach(role => {
        usersByRole[role] = ArrayUtils.removeDuplicates({
          array: usersByRole[role],
          keyFn: user => user.id,
        });
      });
      
      // 4. Encontrar usuários com papel específico
      const admins = usersByRole['admin'] || [];
      const editors = usersByRole['editor'] || [];
      
      // 5. Verificar interseção entre admins e editors
      const adminEditors = ArrayUtils.intersect({
        array1: admins,
        array2: editors,
      });

      // Assert
      expect(activeUsers).toHaveLength(3);
      expect(usersByRole['user']).toHaveLength(3);
      expect(usersByRole['admin']).toHaveLength(1);
      expect(usersByRole['editor']).toHaveLength(1);
      expect(adminEditors).toHaveLength(0); // Nenhum usuário é admin e editor
      expect(usersByRole['admin'][0].name).toBe('Alice');
      expect(usersByRole['editor'][0].name).toBe('Charlie');
    });
  });
});