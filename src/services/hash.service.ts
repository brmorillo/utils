import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

export class HashUtils {
  /**
   * Encrypts a string value using bcrypt synchronously.
   * @param value The value to be encrypted.
   * @param saltRounds The number of salt rounds for hashing (default: 10).
   * @returns The encrypted value.
   * @throws {Error} If the input is invalid or hashing fails.
   * @example
   * const hash = HashUtils.bcryptHash({ value: 'password123', saltRounds: 12 });
   * console.log(hash);
   */
  public static bcryptHash({
    value,
    saltRounds = 10,
  }: {
    value: string;
    saltRounds?: number;
  }): string {
    if (!value || typeof value !== 'string') {
      throw new Error('Invalid input: value must be a non-empty string.');
    }

    if (typeof saltRounds !== 'number' || saltRounds < 4) {
      throw new Error(
        'Invalid saltRounds: must be a number greater than or equal to 4.',
      );
    }

    try {
      return bcrypt.hashSync(value, saltRounds);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to hash value using bcrypt: ${errorMessage}`);
    }
  }

  /**
   * Compares a string value with an encrypted value synchronously.
   * @param value The plain text value to compare.
   * @param encryptedValue The encrypted value to compare against.
   * @returns `true` if the values match, otherwise `false`.
   * @throws {Error} If the input is invalid or comparison fails.
   * @example
   * const isValid = HashUtils.bcryptCompare({ value: 'password123', encryptedValue: hash });
   * console.log(isValid);
   */
  public static bcryptCompare({
    value,
    encryptedValue,
  }: {
    value: string;
    encryptedValue: string;
  }): boolean {
    if (!value || !encryptedValue) {
      throw new Error(
        'Invalid input: value and encryptedValue must be non-empty strings.',
      );
    }

    try {
      return bcrypt.compareSync(value, encryptedValue);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to compare values using bcrypt: ${errorMessage}`);
    }
  }

  /**
   * Generates a random string using bcrypt synchronously.
   * @param length The number of salt rounds to generate the string (default: 10).
   * @returns The generated string.
   * @throws {Error} If the input is invalid or generation fails.
   * @example
   * const randomString = HashUtils.bcryptRandomString({ length: 12 });
   * console.log(randomString);
   */
  public static bcryptRandomString({
    length = 10,
  }: {
    length?: number;
  }): string {
    if (length < 4) {
      throw new Error('Invalid length: must be greater than or equal to 4.');
    }

    try {
      return bcrypt.hashSync(Math.random().toString(), length);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to generate random string using bcrypt: ${errorMessage}`,
      );
    }
  }

  /**
   * Hashes a string value using SHA-256.
   * @param {object} params - The parameters for the method.
   * @param {string} params.value - The string to hash.
   * @returns {string} The SHA-256 hash of the string.
   * @throws {Error} If the input is invalid or hashing fails.
   * @example
   * ```typescript
   * const hash = HashUtils.sha256Hash({ value: 'password123' });
   * console.log(hash); // "ef92b778bafe771e89245b89ecbc08a44a4e166c06659..."
   * ```
   */
  public static sha256Hash({ value }: { value: string }): string {
    if (!value || typeof value !== 'string') {
      throw new Error('Invalid input: value must be a non-empty string.');
    }

    try {
      return crypto.createHash('sha256').update(value).digest('hex');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to hash value using SHA-256: ${errorMessage}`);
    }
  }

  /**
   * Hashes a JSON object using SHA-256.
   * @param {object} params - The parameters for the method.
   * @param {object} params.json - The JSON object to hash.
   * @returns {string} The SHA-256 hash of the serialized JSON.
   * @throws {Error} If the input is invalid or hashing fails.
   * @example
   * ```typescript
   * const hash = HashUtils.sha256HashJson({ json: { key: 'value' } });
   * console.log(hash); // "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
   * ```
   */
  public static sha256HashJson({ json }: { json: object }): string {
    if (typeof json !== 'object' || json === null) {
      throw new Error('Invalid input: JSON object expected.');
    }

    try {
      const jsonString = JSON.stringify(json);
      return HashUtils.sha256Hash({ value: jsonString });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to hash JSON object using SHA-256: ${errorMessage}`,
      );
    }
  }

  /**
   * Generates a random token using SHA-256.
   * @param {object} [params] - The parameters for the method.
   * @param {number} [params.length=32] - The length of the random token.
   * @returns {string} A random token.
   * @throws {Error} If the input is invalid or generation fails.
   * @example
   * ```typescript
   * const token = HashUtils.sha256GenerateToken({ length: 16 });
   * console.log(token); // "a1b2c3d4e5f67890"
   * ```
   */
  public static sha256GenerateToken({
    length = 32,
  }: { length?: number } = {}): string {
    if (typeof length !== 'number' || length <= 0) {
      throw new Error('Invalid length: must be a positive number.');
    }

    try {
      const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
      return randomBytes.toString('hex').substring(0, length);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to generate random token using SHA-256: ${errorMessage}`,
      );
    }
  }

  /**
   * Hashes a string value using SHA-512.
   * @param {object} params - The parameters for the method.
   * @param {string} params.value - The string to hash.
   * @returns {string} The SHA-512 hash of the string.
   * @throws {Error} If the input is invalid or hashing fails.
   * @example
   * ```typescript
   * const hash = HashUtils.sha512Hash({ value: 'password123' });
   * console.log(hash); // "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86"
   * ```
   */
  public static sha512Hash({ value }: { value: string }): string {
    if (!value || typeof value !== 'string') {
      throw new Error('Invalid input: value must be a non-empty string.');
    }

    try {
      return crypto.createHash('sha512').update(value).digest('hex');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to hash value using SHA-512: ${errorMessage}`);
    }
  }

  /**
   * Hashes a JSON object using SHA-512.
   * @param {object} params - The parameters for the method.
   * @param {object} params.json - The JSON object to hash.
   * @returns {string} The SHA-512 hash of the serialized JSON.
   * @throws {Error} If the input is invalid or hashing fails.
   * @example
   * ```typescript
   * const hash = HashUtils.sha512HashJson({ json: { key: 'value' } });
   * console.log(hash); // "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86"
   * ```
   */
  public static sha512HashJson({ json }: { json: object }): string {
    if (typeof json !== 'object' || json === null) {
      throw new Error('Invalid input: JSON object expected.');
    }

    try {
      const jsonString = JSON.stringify(json);
      return HashUtils.sha512Hash({ value: jsonString });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to hash JSON object using SHA-512: ${errorMessage}`,
      );
    }
  }

  /**
   * Generates a random token using SHA-512.
   * @param {object} [params] - The parameters for the method.
   * @param {number} [params.length=32] - The length of the random token.
   * @returns {string} A random token.
   * @throws {Error} If the input is invalid or generation fails.
   * @example
   * ```typescript
   * const token = HashUtils.sha512GenerateToken({ length: 16 });
   * console.log(token); // "a1b2c3d4e5f67890"
   * ```
   */
  public static sha512GenerateToken({
    length = 32,
  }: { length?: number } = {}): string {
    if (typeof length !== 'number' || length <= 0) {
      throw new Error('Invalid length: must be a positive number.');
    }

    try {
      const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
      return crypto
        .createHash('sha512')
        .update(randomBytes)
        .digest('hex')
        .substring(0, length);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to generate random token using SHA-512: ${errorMessage}`,
      );
    }
  }
}
