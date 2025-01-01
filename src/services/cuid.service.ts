import { init, isCuid } from '@paralleldrive/cuid2';
import { Normalize } from '../middleware/normalize.middleware';

@Normalize
export class CuidUtils {
  /**
   * Generates a unique and secure identifier (CUID2).
   * @param length The optional length of the CUID. If not provided, the default length will be used.
   * @returns A string representing the generated CUID2.
   * @example
   * CuidUtils.generate({ length: 10 }); // "ckvlwbkni0"
   */
  public static generate({ length }: { length?: number } = {}): string {
    const createId = length ? init({ length }) : init();
    return createId();
  }

  /**
   * Checks if a string is a valid CUID2.
   * @param id The string to be validated.
   * @returns `true` if the string is a valid CUID2; otherwise, `false`.
   * @example
   * CuidUtils.isValid({ id: "ckvlwbkni0001rd3ediyjf3ih" }); // true
   */
  public static isValid({ id }: { id: string }): boolean {
    return isCuid(id);
  }
}
