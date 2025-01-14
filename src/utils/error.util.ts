/**
 * Handles errors by throwing a new error with a detailed message.
 * @param message The custom error message.
 * @param error The original error object.
 * @throws {Error} Throws a new error with the provided message and original error details.
 */
export function handleError(message: string, error: unknown): never {
  throw new Error(`${message}: ${(error as Error).message}`);
}
