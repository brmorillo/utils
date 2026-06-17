import { UUIDUtils } from '../../src/services/uuid.service';

/**
 * Unit tests for the UUIDUtils class.
 * These tests verify the behavior of each method individually.
 */
describe('UUIDUtils - Unit Tests', () => {
  describe('uuidV1Generate', () => {
    it('should generate a valid UUID v1', () => {
      const uuid = UUIDUtils.uuidV1Generate();

      // Verify that it is a string
      expect(typeof uuid).toBe('string');

      // Verify that it has the correct UUID format
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      // Verify that it is valid using the validation method itself
      expect(UUIDUtils.isValidUuid({ id: uuid })).toBe(true);
    });

    it('should generate unique UUIDs v1 on consecutive calls', () => {
      const uuid1 = UUIDUtils.uuidV1Generate();
      const uuid2 = UUIDUtils.uuidV1Generate();

      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('uuidV4Generate', () => {
    it('should generate a valid UUID v4', () => {
      const uuid = UUIDUtils.uuidV4Generate();

      // Verify that it is a string
      expect(typeof uuid).toBe('string');

      // Verify that it has the correct UUID v4 format
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      // Verify that it is valid using the validation method itself
      expect(UUIDUtils.isValidUuid({ id: uuid })).toBe(true);
    });

    it('should generate unique UUIDs v4 on consecutive calls', () => {
      const uuid1 = UUIDUtils.uuidV4Generate();
      const uuid2 = UUIDUtils.uuidV4Generate();

      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('uuidV5Generate', () => {
    it('should generate a valid UUID v5 with namespace and name', () => {
      const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // DNS namespace
      const name = 'example.com';

      const uuid = UUIDUtils.uuidV5Generate({ namespace, name });

      // Verify that it is a string
      expect(typeof uuid).toBe('string');

      // Verify that it has the correct UUID v5 format
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      // Verify that it is valid using the validation method itself
      expect(UUIDUtils.isValidUuid({ id: uuid })).toBe(true);
    });

    it('should generate the same UUID v5 for the same namespace and name', () => {
      const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const name = 'example.com';

      const uuid1 = UUIDUtils.uuidV5Generate({ namespace, name });
      const uuid2 = UUIDUtils.uuidV5Generate({ namespace, name });

      expect(uuid1).toBe(uuid2);
    });

    it('should generate different UUIDs v5 for different names with the same namespace', () => {
      const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const name1 = 'example.com';
      const name2 = 'example.org';

      const uuid1 = UUIDUtils.uuidV5Generate({ namespace, name: name1 });
      const uuid2 = UUIDUtils.uuidV5Generate({ namespace, name: name2 });

      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate a valid UUID v5 without a provided namespace', () => {
      const name = 'example.com';

      const uuid = UUIDUtils.uuidV5Generate({ name });

      // Verify that it is a string
      expect(typeof uuid).toBe('string');

      // Verify that it has the correct UUID v5 format
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      // Verify that it is valid using the validation method itself
      expect(UUIDUtils.isValidUuid({ id: uuid })).toBe(true);
    });

    it('should throw a ValidationError for an invalid namespace', () => {
      expect(() => {
        UUIDUtils.uuidV5Generate({
          namespace: 'not-a-valid-uuid',
          name: 'example.com',
        });
      }).toThrow('Invalid namespace');
    });

    it('should throw a ValidationError for an empty name', () => {
      expect(() => {
        UUIDUtils.uuidV5Generate({ name: '' });
      }).toThrow('Invalid name');
    });
  });

  describe('isValidUuid', () => {
    it('should validate a UUID v1 as valid', () => {
      const uuid = UUIDUtils.uuidV1Generate();
      const isValid = UUIDUtils.isValidUuid({ id: uuid });

      expect(isValid).toBe(true);
    });

    it('should validate a UUID v4 as valid', () => {
      const uuid = UUIDUtils.uuidV4Generate();
      const isValid = UUIDUtils.isValidUuid({ id: uuid });

      expect(isValid).toBe(true);
    });

    it('should validate a UUID v5 as valid', () => {
      const uuid = UUIDUtils.uuidV5Generate({ name: 'test' });
      const isValid = UUIDUtils.isValidUuid({ id: uuid });

      expect(isValid).toBe(true);
    });

    it('should validate a non-UUID string as invalid', () => {
      const invalidUuids = [
        'not-a-uuid',
        '123e4567-e89b-12d3-a456-4266554400', // too short
        '123e4567-e89b-12d3-a456-42665544000000', // too long
        '123e4567-e89b-12d3-a456_426655440000', // invalid character
        '123e4567-e89b-12d3-a456', // incomplete
        '', // empty
      ];

      invalidUuids.forEach(invalidUuid => {
        const isValid = UUIDUtils.isValidUuid({ id: invalidUuid });
        expect(isValid).toBe(false);
      });
    });
  });
});
