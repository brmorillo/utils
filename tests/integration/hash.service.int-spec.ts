import { HashUtils } from '../../src/services/hash.service';

/**
 * Integration tests for the HashUtils class.
 * These tests verify the behavior of the class in more complex scenarios
 * and with interactions between different methods.
 */
describe('HashUtils - Integration Tests', () => {
  describe('Authentication flow', () => {
    it('should create a bcrypt hash and validate correctly', () => {
      // Simulates a registration and login flow
      const password = 'MinhaS3nhaF0rte!';

      // Registration: generates the password hash
      const passwordHash = HashUtils.bcryptHash({ value: password, saltRounds: 10 });

      // Login: validates the password
      const isValid = HashUtils.bcryptCompare({
        value: password,
        encryptedValue: passwordHash,
      });

      expect(isValid).toBe(true);

      // Attempt with an incorrect password
      const isInvalid = HashUtils.bcryptCompare({
        value: 'SenhaErrada',
        encryptedValue: passwordHash,
      });

      expect(isInvalid).toBe(false);
    });
  });

  describe('Combination of hash algorithms', () => {
    it('should combine SHA-256 and bcrypt for layered hashing', () => {
      const originalValue = 'DadosSensíveis123';

      // First layer: SHA-256 hash
      const sha256Hash = HashUtils.sha256Hash({ value: originalValue });

      // Second layer: bcrypt hash of the SHA-256 result
      const finalHash = HashUtils.bcryptHash({ value: sha256Hash });

      // Verification: recreate the SHA-256 and compare with bcrypt
      const verificationSha256 = HashUtils.sha256Hash({ value: originalValue });
      const isValid = HashUtils.bcryptCompare({
        value: verificationSha256,
        encryptedValue: finalHash,
      });

      expect(isValid).toBe(true);
    });
  });

  describe('Data integrity verification', () => {
    it('should verify the integrity of a JSON object using SHA-512', () => {
      // Original data object
      const originalData = {
        id: 123,
        name: 'Produto Teste',
        price: 99.99,
        available: true,
      };

      // Generate hash for the original object
      const originalHash = HashUtils.sha512HashJson({ json: originalData });

      // Simulates storing and retrieving the data
      const retrievedData = { ...originalData };

      // Verifies that the data was not altered
      const retrievedHash = HashUtils.sha512HashJson({ json: retrievedData });
      expect(retrievedHash).toBe(originalHash);

      // Simulates a change in the data
      retrievedData.price = 89.99;

      // Verifies that the hash is different after the change
      const modifiedHash = HashUtils.sha512HashJson({ json: retrievedData });
      expect(modifiedHash).not.toBe(originalHash);
    });
  });

  describe('Authentication token generation', () => {
    it('should generate and validate authentication tokens', () => {
      // Generates a random token
      const token = HashUtils.sha256GenerateToken({ length: 32 });

      // Simulates storing the token hash
      const tokenHash = HashUtils.sha256Hash({ value: token });

      // Simulates token validation
      const receivedToken = token; // In a real case, this would come from the client
      const receivedTokenHash = HashUtils.sha256Hash({ value: receivedToken });

      // Verifies that the hash of the received token matches the stored hash
      expect(receivedTokenHash).toBe(tokenHash);

      // Simulates an invalid token
      const invalidToken = token.substring(0, token.length - 1) + 'X';
      const invalidTokenHash = HashUtils.sha256Hash({ value: invalidToken });

      // Verifies that the hash of the invalid token does not match
      expect(invalidTokenHash).not.toBe(tokenHash);
    });
  });

  describe('Comparison between hash algorithms', () => {
    it('should demonstrate the difference between SHA-256 and SHA-512', () => {
      const testValue = 'TextoParaComparaçãoDeHashes';

      // Generates hashes with different algorithms
      const sha256Result = HashUtils.sha256Hash({ value: testValue });
      const sha512Result = HashUtils.sha512Hash({ value: testValue });

      // Verifies that the results are different
      expect(sha256Result).not.toBe(sha512Result);

      // Verifies the correct lengths
      expect(sha256Result).toHaveLength(64); // 256 bits = 64 hex characters
      expect(sha512Result).toHaveLength(128); // 512 bits = 128 hex characters
    });
  });
});
