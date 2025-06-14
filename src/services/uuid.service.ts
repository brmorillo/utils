import {
  v1 as uuidv1,
  v4 as uuidv4,
  v5 as uuidv5,
  validate as validateUuid,
} from 'uuid';

export class UUIDUtils {
  /**
   * Generates a UUID (version 1).
   * @returns {string} A unique UUID string.
   * @example
   * UUIDUtils.uuidV1Generate(); // "f47ac10b-58cc-4372-a567-0e02b2c3d479"
   */
  public static uuidV1Generate(): string {
    return uuidv1();
  }

  /**
   * Generates a UUID (version 4).
   * @returns {string} A unique UUID string.
   * @example
   * UUIDUtils.uuidV4Generate(); // "3d6f0eb0-5e26-4b2c-a073-84d55dff3d51"
   */
  public static uuidV4Generate(): string {
    return uuidv4();
  }

  /**
   * Generates a UUID (version 5).
   * If the namespace is not valid, a new UUIDv4 will be generated as the namespace.
   * @param {object} params - The parameters for the method.
   * @param {string} [params.namespace] - The namespace for UUID generation (must be a valid UUID). Defaults to a generated UUIDv4 if not provided.
   * @param {string} params.name - The name to hash within the namespace.
   * @returns {string} A deterministic UUID string based on the namespace and name.
   * @example
   * UUIDUtils.uuidV5Generate({
   *   namespace: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
   *   name: 'example'
   * }); // Deterministic UUID based on namespace and name
   *
   * UUIDUtils.uuidV5Generate({
   *   name: 'example'
   * }); // Deterministic UUID using auto-generated namespace
   */
  public static uuidV5Generate({
    namespace,
    name,
  }: {
    namespace?: string;
    name: string;
  }): string {
    const requiredNamespace: string = namespace || uuidv4();
    return uuidv5(name, requiredNamespace);
  }

  /**
   * Validates if a string is a valid UUID.
   * @param {object} params - The parameters for the method.
   * @param {string} params.id - The ID to validate.
   * @returns {boolean} `true` if the string is a valid UUID, otherwise `false`.
   * @example
   * UUIDUtils.uuidIsValid({
   *   id: '3d6f0eb0-5e26-4b2c-a073-84d55dff3d51'
   * }); // true
   *
   * UUIDUtils.uuidIsValid({
   *   id: 'invalid-uuid'
   * }); // false
   */
  public static uuidIsValid({ id }: { id: string }): boolean {
    return validateUuid(id);
  }
}
