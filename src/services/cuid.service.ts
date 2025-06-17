import { init, isCuid } from '@paralleldrive/cuid2';

export class CuidUtils {
  /**
   * Generates a unique and secure identifier (CUID2).
   * @param {object} [params] - The parameters for the method.
   * @param {number} [params.length] - The optional length of the CUID. If not provided, the default length will be used.
   * @returns {string} A string representing the generated CUID2.
   * @example
   * CuidUtils.generate({ length: 10 }); // "ckvlwbkni0"
   * CuidUtils.generate(); // "clh0xkfqi0000jz0ght8hjqt8" (default length)
   */
  public static generate({ length }: { length?: number } = {}): string {
    const createId = length ? init({ length }) : init();
    return createId();
  }

  /**
   * Checks if a string is a valid CUID2.
   * @param {object} params - The parameters for the method.
   * @param {string} params.id - The string to be validated.
   * @returns {boolean} `true` if the string is a valid CUID2; otherwise, `false`.
   * @example
   * CuidUtils.isValidCuid({ id: "ckvlwbkni0001rd3ediyjf3ih" }); // true
   * CuidUtils.isValidCuid({ id: "invalid-id" }); // false
   */
  public static isValidCuid({ id }: { id: string }): boolean {
    return isCuid(id);
  }
}
