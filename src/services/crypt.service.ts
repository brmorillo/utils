import * as bcrypt from 'bcryptjs';

export class CryptUtils {
  /**
   * Encrypts a string value using bcrypt synchronously.
   * @param value Value to be encrypted
   * @param saltRounds Number of salt rounds for hashing (default: 10)
   * @returns The encrypted value or null if an error occurs
   * @example
   * CryptUtils.encrypt({ value: 'password123', saltRounds: 12 }) // Encrypted string
   */
  public static encrypt({
    value,
    saltRounds = 10,
  }: {
    value: string;
    saltRounds?: number;
  }): string | null {
    if (!value || typeof saltRounds !== 'number' || saltRounds < 4) {
      return null;
    }
    try {
      return bcrypt.hashSync(value, saltRounds);
    } catch (error) {
      return null;
    }
  }

  /**
   * Compares a string value with an encrypted value synchronously.
   * @param value Value to be compared
   * @param encryptedValue Encrypted value
   * @returns True if the values match, false otherwise
   * @example
   * CryptUtils.compare({ value: 'password123', encryptedValue: 'encryptedString' }) // true or false
   */
  public static compare({
    value,
    encryptedValue,
  }: {
    value: string;
    encryptedValue: string;
  }): boolean {
    try {
      return bcrypt.compareSync(value, encryptedValue);
    } catch (error) {
      return false;
    }
  }

  /**
   * Generates a random string using bcrypt synchronously.
   * @param length Number of salt rounds to generate the string (default: 10)
   * @returns The generated string or null if an error occurs
   * @example
   * CryptUtils.generateRandomString({ length: 12 }) // Randomly generated string
   */
  public static generateRandomString({
    length = 10,
  }: {
    length?: number;
  }): string | null {
    if (length < 4) {
      return null; // Salt rounds mínimo para bcrypt é 4
    }
    try {
      return bcrypt.hashSync(Math.random().toString(), length);
    } catch (error) {
      return null;
    }
  }
}
