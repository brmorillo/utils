import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { handleError } from '../utils/error.util';

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
      handleError('Failed to hash value using bcrypt', error);
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
      handleError('Failed to compare values using bcrypt', error);
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
      handleError('Failed to generate random string using bcrypt', error);
    }
  }

  /**
   * Hashes a string value using SHA-256.
   * @param value The string to hash.
   * @returns The SHA-256 hash of the string.
   * @throws {Error} If the input is invalid or hashing fails.
   * @example
   * const hash = HashUtils.sha256Hash('password123');
   * console.log(hash);
   */
  public static sha256Hash(value: string): string {
    if (!value || typeof value !== 'string') {
      throw new Error('Invalid input: value must be a non-empty string.');
    }

    try {
      return crypto.createHash('sha256').update(value).digest('hex');
    } catch (error) {
      handleError('Failed to hash value using SHA-256', error);
    }
  }

  /**
   * Hashes a JSON object using SHA-256.
   * @param json The JSON object to hash.
   * @returns The SHA-256 hash of the serialized JSON.
   * @throws {Error} If the input is invalid or hashing fails.
   * @example
   * const hash = HashUtils.sha256HashJson({ key: 'value' });
   * console.log(hash);
   */
  public static sha256HashJson(json: object): string {
    if (typeof json !== 'object' || json === null) {
      throw new Error('Invalid input: JSON object expected.');
    }

    try {
      const jsonString = JSON.stringify(json);
      return HashUtils.sha256Hash(jsonString);
    } catch (error) {
      handleError('Failed to hash JSON object using SHA-256', error);
    }
  }

  /**
   * Generates a random token using SHA-256.
   * @param length The length of the random token (default: 32).
   * @returns A random token.
   * @throws {Error} If the input is invalid or generation fails.
   * @example
   * const token = HashUtils.sha256GenerateToken(16);
   * console.log(token);
   */
  public static sha256GenerateToken(length: number = 32): string {
    if (typeof length !== 'number' || length <= 0) {
      throw new Error('Invalid length: must be a positive number.');
    }

    try {
      const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
      return randomBytes.toString('hex').substring(0, length);
    } catch (error) {
      handleError('Failed to generate random token using SHA-256', error);
    }
  }

  /**
   * Hashes a string value using SHA-512.
   * @param value The string to hash.
   * @returns The SHA-512 hash of the string.
   * @throws {Error} If the input is invalid or hashing fails.
   * @example
   * const hash = HashUtils.sha512Hash('password123');
   * console.log(hash);
   */
  public static sha512Hash(value: string): string {
    if (!value || typeof value !== 'string') {
      throw new Error('Invalid input: value must be a non-empty string.');
    }

    try {
      return crypto.createHash('sha512').update(value).digest('hex');
    } catch (error) {
      handleError('Failed to hash value using SHA-512', error);
    }
  }

  /**
   * Hashes a JSON object using SHA-512.
   * @param json The JSON object to hash.
   * @returns The SHA-512 hash of the serialized JSON.
   * @throws {Error} If the input is invalid or hashing fails.
   * @example
   * const hash = HashUtils.sha512HashJson({ key: 'value' });
   * console.log(hash);
   */
  public static sha512HashJson(json: object): string {
    if (typeof json !== 'object' || json === null) {
      throw new Error('Invalid input: JSON object expected.');
    }

    try {
      const jsonString = JSON.stringify(json);
      return HashUtils.sha512Hash(jsonString);
    } catch (error) {
      handleError('Failed to hash JSON object using SHA-512', error);
    }
  }

  /**
   * Generates a random token using SHA-512.
   * @param length The length of the random token (default: 32).
   * @returns A random token.
   * @throws {Error} If the input is invalid or generation fails.
   * @example
   * const token = HashUtils.sha512GenerateToken(16);
   * console.log(token);
   */
  public static sha512GenerateToken(length: number = 32): string {
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
      handleError('Failed to generate random token using SHA-512', error);
    }
  }
}
