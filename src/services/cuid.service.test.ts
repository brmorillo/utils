import { CuidUtils } from './cuid.service';

describe('CuidUtils', () => {
  describe('generate', () => {
    it('should generate a CUID2 with the default length', () => {
      const cuid = CuidUtils.generate();
      expect(cuid).toBeDefined();
      expect(typeof cuid).toBe('string');
      expect(CuidUtils.isValid({ id: cuid })).toBe(true);
    });

    it('should generate a CUID2 with a custom length', () => {
      const length = 16;
      const cuid = CuidUtils.generate({ length });
      expect(cuid).toBeDefined();
      expect(typeof cuid).toBe('string');
      expect(cuid.length).toBe(length);
      expect(CuidUtils.isValid({ id: cuid })).toBe(true);
    });

    it('should generate unique CUID2s', () => {
      const cuid1 = CuidUtils.generate();
      const cuid2 = CuidUtils.generate();
      expect(cuid1).not.toBe(cuid2);
    });
  });

  describe('isValid', () => {
    it('should return true for valid CUID2 strings', () => {
      const validCuid = CuidUtils.generate();
      expect(CuidUtils.isValid({ id: validCuid })).toBe(true);
    });

    it('should return false for invalid strings', () => {
      const invalidCuid = 'invalid_cuid';
      expect(CuidUtils.isValid({ id: invalidCuid })).toBe(false);
    });

    it('should return false for an empty string', () => {
      expect(CuidUtils.isValid({ id: '' })).toBe(false);
    });
  });
});
