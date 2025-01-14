import { HashUtils } from './hash.service';

describe('CryptUtils', () => {
  const plainText = 'password123';
  const wrongText = 'wrongpassword';
  let encryptedValue: string | null;

  describe('encrypt', () => {
    it('should encrypt a string value', () => {
      encryptedValue = HashUtils.bcryptHash({ value: plainText });
      expect(encryptedValue).toBeDefined();
      expect(typeof encryptedValue).toBe('string');
    });

    it('should return null if saltRounds is invalid', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = HashUtils.bcryptHash({ value: plainText, saltRounds: 3 });
      expect(result).toBeNull();
    });

    it('should return null if value is empty', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = HashUtils.bcryptHash({ value: '', saltRounds: 10 });
      expect(result).toBeNull();
    });
  });

  describe('compare', () => {
    beforeAll(() => {
      encryptedValue = HashUtils.bcryptHash({ value: plainText });
    });

    it('should return true for matching values', () => {
      const isMatch = HashUtils.bcryptCompare({
        value: plainText,
        encryptedValue: encryptedValue!,
      });
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching values', () => {
      const isMatch = HashUtils.bcryptCompare({
        value: wrongText,
        encryptedValue: encryptedValue!,
      });
      expect(isMatch).toBe(false);
    });

    it('should return false if encryptedValue is invalid', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const isMatch = HashUtils.bcryptCompare({
        value: plainText,
        encryptedValue: '',
      });
      expect(isMatch).toBe(false);
    });
  });

  describe('generateRandomString', () => {
    it('should generate a random string', () => {
      const randomString = HashUtils.bcryptRandomString({ length: 10 });
      expect(randomString).toBeDefined();
      expect(typeof randomString).toBe('string');
    });

    it('should return null if length is less than 4', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = HashUtils.bcryptRandomString({ length: 3 });
      expect(result).toBeNull();
    });

    it('should generate unique strings', () => {
      const randomString1 = HashUtils.bcryptRandomString({ length: 10 });
      const randomString2 = HashUtils.bcryptRandomString({ length: 10 });
      expect(randomString1).not.toBe(randomString2);
    });
  });
});
