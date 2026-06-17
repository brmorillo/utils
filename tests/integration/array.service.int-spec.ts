import { ArrayUtils } from '../../src/services/array.service';

/**
 * Integration tests for the ArrayUtils class.
 * These tests verify the behavior of the class in more complex scenarios
 * and with interactions between different methods.
 */
describe('ArrayUtils - Integration Tests', () => {
  describe('Data processing flow', () => {
    it('should process a dataset with multiple operations', () => {
      // Arrange - Initial data
      const initialData = [
        { id: 1, category: 'fruit', name: 'apple', tags: ['red', 'sweet'] },
        {
          id: 2,
          category: 'vegetable',
          name: 'carrot',
          tags: ['orange', 'crunchy'],
        },
        { id: 3, category: 'fruit', name: 'banana', tags: ['yellow', 'sweet'] },
        { id: 4, category: 'fruit', name: 'apple', tags: ['green', 'sour'] },
        {
          id: 5,
          category: 'vegetable',
          name: 'broccoli',
          tags: ['green', 'healthy'],
        },
      ];

      // Act - Complete processing flow

      // 1. Remove duplicates based on name
      const uniqueByName = ArrayUtils.removeDuplicates({
        array: initialData,
        keyFn: item => item.name,
      });

      // 2. Group by category
      const groupedByCategory = ArrayUtils.groupBy({
        array: uniqueByName,
        keyFn: item => item.category,
      });

      // 3. Sort fruits by name
      const sortedFruits = ArrayUtils.sort({
        array: groupedByCategory.fruit,
        orderBy: { name: 'asc' },
      });

      // 4. Find item with a specific tag
      const itemWithSweetTag = ArrayUtils.findSubset({
        array: sortedFruits,
        subset: { tags: ['sweet'] },
      });

      // Assert
      // Verify that duplicates were removed correctly
      expect(uniqueByName).toHaveLength(4); // apple appears only once

      // Verify that grouping was done correctly
      expect(Object.keys(groupedByCategory)).toEqual(['fruit', 'vegetable']);
      expect(groupedByCategory.fruit).toHaveLength(2);
      expect(groupedByCategory.vegetable).toHaveLength(2);

      // Verify that sorting was done correctly
      expect(sortedFruits[0].name).toBe('apple');
      expect(sortedFruits[1].name).toBe('banana');

      // Verify that the item with the correct tag was found
      expect(itemWithSweetTag).not.toBeNull();
      expect(itemWithSweetTag?.tags).toContain('sweet');
    });
  });

  describe('Data structure transformation', () => {
    it('should transform a nested data structure into a flat structure', () => {
      // Arrange - Nested structure
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
      // 1. Extract all employees into a flat array
      const allEmployees = nestedData.map(dept => dept.employees);
      const flattenedEmployees = ArrayUtils.flatten({ array: allEmployees });

      // 2. Sort by ID
      const sortedEmployees = ArrayUtils.sort({
        array: flattenedEmployees,
        orderBy: { id: 'asc' },
      });

      // 3. Find a specific employee
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

  describe('Set operations', () => {
    it('should perform set operations (union, intersection, difference)', () => {
      // Arrange
      const set1 = [1, 2, 3, 4, 5];
      const set2 = [4, 5, 6, 7, 8];
      const set3 = [1, 3, 5, 7, 9];

      // Act
      // 1. Intersection of set1 and set2
      const intersection12 = ArrayUtils.intersect({
        array1: set1,
        array2: set2,
      });

      // 2. Intersection of set2 and set3
      const intersection23 = ArrayUtils.intersect({
        array1: set2,
        array2: set3,
      });

      // 3. Intersection of all intersections (elements common to all sets)
      const commonElements = ArrayUtils.intersect({
        array1: intersection12,
        array2: intersection23,
      });

      // 4. Union of all sets (without duplicates)
      const allElements = [...set1, ...set2, ...set3];
      const union = ArrayUtils.removeDuplicates({ array: allElements });

      // 5. Sort the union
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

  describe('Complex data manipulation', () => {
    it('should process and transform complex data', () => {
      // Arrange
      const users = [
        { id: 1, name: 'Alice', roles: ['admin', 'user'], active: true },
        { id: 2, name: 'Bob', roles: ['user'], active: false },
        { id: 3, name: 'Charlie', roles: ['user', 'editor'], active: true },
        { id: 4, name: 'Diana', roles: ['user'], active: true },
      ];

      // Act
      // 1. Filter only active users
      const activeUsers = users.filter(user => user.active);

      // 2. Group by role
      const usersByRole: Record<string, typeof users> = {};
      activeUsers.forEach(user => {
        user.roles.forEach(role => {
          if (!usersByRole[role]) {
            usersByRole[role] = [];
          }
          usersByRole[role].push(user);
        });
      });

      // 3. Remove duplicates in each group
      Object.keys(usersByRole).forEach(role => {
        usersByRole[role] = ArrayUtils.removeDuplicates({
          array: usersByRole[role],
          keyFn: user => user.id,
        });
      });

      // 4. Find users with a specific role
      const admins = usersByRole['admin'] || [];
      const editors = usersByRole['editor'] || [];

      // 5. Verify intersection between admins and editors
      const adminEditors = ArrayUtils.intersect({
        array1: admins,
        array2: editors,
      });

      // Assert
      expect(activeUsers).toHaveLength(3);
      expect(usersByRole['user']).toHaveLength(3);
      expect(usersByRole['admin']).toHaveLength(1);
      expect(usersByRole['editor']).toHaveLength(1);
      expect(adminEditors).toHaveLength(0); // No user is both admin and editor
      expect(usersByRole['admin'][0].name).toBe('Alice');
      expect(usersByRole['editor'][0].name).toBe('Charlie');
    });
  });
});
