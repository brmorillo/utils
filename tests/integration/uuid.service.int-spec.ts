import { UUIDUtils } from '../../src/services/uuid.service';

/**
 * Integration tests for the UUIDUtils class.
 * These tests verify more complex scenarios involving multiple methods.
 */
describe('UUIDUtils - Integration Tests', () => {
  describe('Real-world usage scenarios', () => {
    it('should generate and validate UUIDs in a workflow', () => {
      // Scenario: Generate different types of UUIDs and validate them

      // 1. Generate UUIDs of different versions
      const uuidV1 = UUIDUtils.uuidV1Generate();
      const uuidV4 = UUIDUtils.uuidV4Generate();
      const uuidV5 = UUIDUtils.uuidV5Generate({
        namespace: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        name: 'example.com',
      });

      // 2. Validate each UUID
      const isV1Valid = UUIDUtils.isValidUuid({ id: uuidV1 });
      const isV4Valid = UUIDUtils.isValidUuid({ id: uuidV4 });
      const isV5Valid = UUIDUtils.isValidUuid({ id: uuidV5 });

      // Assertions
      expect(isV1Valid).toBe(true);
      expect(isV4Valid).toBe(true);
      expect(isV5Valid).toBe(true);

      // 3. Verify that the UUIDs have the correct versions
      expect(uuidV1.charAt(14)).toBe('1'); // Verify that it is v1
      expect(uuidV4.charAt(14)).toBe('4'); // Verify that it is v4
      expect(uuidV5.charAt(14)).toBe('5'); // Verify that it is v5
    });

    it('should use UUIDs for entity identification in a system', () => {
      // Scenario: Simulate a system that uses UUIDs to identify entities

      // 1. Create a simulated "database" of users
      const userDatabase: Record<string, any> = {};

      // 2. Create some users with UUID-based IDs
      const userId1 = UUIDUtils.uuidV4Generate();
      userDatabase[userId1] = { name: 'Alice', email: 'alice@example.com' };

      const userId2 = UUIDUtils.uuidV4Generate();
      userDatabase[userId2] = { name: 'Bob', email: 'bob@example.com' };

      // 3. Verify that the users were stored correctly
      expect(userDatabase[userId1].name).toBe('Alice');
      expect(userDatabase[userId2].name).toBe('Bob');

      // 4. Verify that the IDs are valid
      expect(UUIDUtils.isValidUuid({ id: userId1 })).toBe(true);
      expect(UUIDUtils.isValidUuid({ id: userId2 })).toBe(true);

      // 5. Verify that an invalid ID does not exist in the database
      const invalidId = 'not-a-uuid';
      expect(UUIDUtils.isValidUuid({ id: invalidId })).toBe(false);
      expect(userDatabase[invalidId]).toBeUndefined();
    });

    it('should use v5 UUIDs to generate deterministic IDs', () => {
      // Scenario: Use v5 UUIDs to generate deterministic IDs for resources

      // 1. Define a namespace for the application domain
      const appNamespace = UUIDUtils.uuidV4Generate();

      // 2. Generate deterministic IDs for different resources
      const productId = UUIDUtils.uuidV5Generate({
        namespace: appNamespace,
        name: 'product-1',
      });

      const categoryId = UUIDUtils.uuidV5Generate({
        namespace: appNamespace,
        name: 'category-electronics',
      });

      // 3. Verify that the IDs are valid
      expect(UUIDUtils.isValidUuid({ id: productId })).toBe(true);
      expect(UUIDUtils.isValidUuid({ id: categoryId })).toBe(true);

      // 4. Verify that the IDs are different for different resources
      expect(productId).not.toBe(categoryId);

      // 5. Verify that the IDs are consistent for the same resource
      const productIdAgain = UUIDUtils.uuidV5Generate({
        namespace: appNamespace,
        name: 'product-1',
      });

      expect(productId).toBe(productIdAgain);
    });
  });

  describe('Combination of methods', () => {
    it('should use v1 UUIDs for temporal records and validate them', () => {
      // Scenario: Use v1 UUIDs for records with a temporal component

      // 1. Generate a series of v1 UUIDs in sequence
      const uuids: string[] = [];
      for (let i = 0; i < 5; i++) {
        uuids.push(UUIDUtils.uuidV1Generate());
      }

      // 2. Verify that all are valid
      const allValid = uuids.every(uuid => UUIDUtils.isValidUuid({ id: uuid }));
      expect(allValid).toBe(true);

      // 3. Verify that all are unique
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(uuids.length);

      // 4. Verify that all are v1 UUIDs
      const allV1 = uuids.every(uuid => uuid.charAt(14) === '1');
      expect(allV1).toBe(true);
    });

    it('should use v4 UUIDs for random identifiers and validate them', () => {
      // Scenario: Use v4 UUIDs for random identifiers

      // 1. Generate a series of v4 UUIDs
      const uuids: string[] = [];
      for (let i = 0; i < 5; i++) {
        uuids.push(UUIDUtils.uuidV4Generate());
      }

      // 2. Verify that all are valid
      const allValid = uuids.every(uuid => UUIDUtils.isValidUuid({ id: uuid }));
      expect(allValid).toBe(true);

      // 3. Verify that all are unique
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(uuids.length);

      // 4. Verify that all are v4 UUIDs
      const allV4 = uuids.every(uuid => uuid.charAt(14) === '4');
      expect(allV4).toBe(true);
    });
  });
});
