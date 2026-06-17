import { init, isCuid } from '@paralleldrive/cuid2';
import { ValidationError } from '../errors';

export class CuidUtils {
  /**
   * Generates a unique and secure identifier (CUID2).
   * @param {object} [params] - The parameters for the method.
   * @param {number} [params.length=24] - The optional length of the CUID. When omitted,
   * the default length of 24 is used. Must be an integer in the range [2, 32].
   * @returns {string} A string representing the generated CUID2.
   * @throws {ValidationError} Throws a ValidationError if `length` is not an integer in the range [2, 32].
   * @example
   * CuidUtils.generate({ length: 10 }); // "ckvlwbkni0"
   * CuidUtils.generate(); // "clh0xkfqi0000jz0ght8hjqt8" (default length 24)
   */
  public static generate({ length }: { length?: number } = {}): string {
    if (length !== undefined) {
      if (!Number.isInteger(length) || length < 2 || length > 32) {
        throw new ValidationError(
          'Invalid length: must be an integer between 2 and 32.',
        );
      }
    }

    const createId = length ? init({ length }) : init();
    return createId();
  }

  /**
   * Checks if a string is a valid CUID2.
   *
   * NOTE: this only validates the FORMAT (a lowercase alphanumeric string with a
   * length between 2 and 32 characters). It does NOT verify cryptographic origin,
   * so any string matching that shape is reported as valid even if it was not
   * produced by {@link CuidUtils.generate}.
   * @param {object} params - The parameters for the method.
   * @param {string} params.id - The string to be validated.
   * @returns {boolean} `true` if the string matches the CUID2 format; otherwise, `false`.
   * @example
   * CuidUtils.isValidCuid({ id: "ckvlwbkni0001rd3ediyjf3ih" }); // true
   * CuidUtils.isValidCuid({ id: "invalid-id" }); // false
   */
  public static isValidCuid({ id }: { id: string }): boolean {
    return isCuid(id);
  }
}
