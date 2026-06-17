import { CuidUtils } from '../../src/services/cuid.service';

/**
 * Unit tests for the CuidUtils class.
 * These tests verify CUID2 generation with default and custom lengths
 * and validation of valid versus invalid identifiers.
 */
describe('CuidUtils', () => {
  describe('generate', () => {
    it('should generate a non-empty string with no arguments', () => {
      // Arrange & Act
      const id = CuidUtils.generate();

      // Assert
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate an id with the default length of 24', () => {
      // Arrange & Act
      const id = CuidUtils.generate();

      // Assert
      expect(id).toHaveLength(24);
    });

    it('should generate an id with the requested custom length', () => {
      // Arrange
      const length = 10;

      // Act
      const id = CuidUtils.generate({ length });

      // Assert
      expect(id).toHaveLength(length);
    });

    it('should generate unique ids on consecutive calls', () => {
      // Arrange & Act
      const first = CuidUtils.generate();
      const second = CuidUtils.generate();

      // Assert
      expect(first).not.toBe(second);
    });

    it('should generate a valid CUID', () => {
      // Arrange & Act
      const id = CuidUtils.generate();

      // Assert
      expect(CuidUtils.isValidCuid({ id })).toBe(true);
    });

    it('should accept the boundary lengths 2 and 32', () => {
      expect(CuidUtils.generate({ length: 2 })).toHaveLength(2);
      expect(CuidUtils.generate({ length: 32 })).toHaveLength(32);
    });

    it('should throw a ValidationError for a length below 2', () => {
      expect(() => CuidUtils.generate({ length: 1 })).toThrow('Invalid length');
    });

    it('should throw a ValidationError for a length above 32', () => {
      expect(() => CuidUtils.generate({ length: 33 })).toThrow('Invalid length');
    });

    it('should throw a ValidationError for a non-integer length', () => {
      expect(() => CuidUtils.generate({ length: 10.5 })).toThrow(
        'Invalid length',
      );
    });
  });

  describe('isValidCuid', () => {
    it('should return true for a generated id', () => {
      // Arrange
      const id = CuidUtils.generate();

      // Act & Assert
      expect(CuidUtils.isValidCuid({ id })).toBe(true);
    });

    it('should return false for an obviously invalid id', () => {
      // Arrange & Act & Assert
      expect(CuidUtils.isValidCuid({ id: 'invalid-id' })).toBe(false);
    });

    it('should return false for an empty string', () => {
      // Arrange & Act & Assert
      expect(CuidUtils.isValidCuid({ id: '' })).toBe(false);
    });

    it('should return false for a string with uppercase characters', () => {
      // Arrange & Act & Assert
      expect(CuidUtils.isValidCuid({ id: 'ABC123' })).toBe(false);
    });
  });
});
