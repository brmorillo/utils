/**
 * Handles errors by throwing a new error with a detailed message.
 * @param {string} message - The custom error message.
 * @param {unknown} error - The original error object.
 * @throws {Error} Throws a new error with the provided message and original error details.
 * @example
 * try {
 *   // Some code that might throw an error
 *   throw new Error("Original error");
 * } catch (error) {
 *   handleError("Failed to process data", error);
 *   // Throws: "Failed to process data: Original error"
 * }
 */
export function handleError(message: string, error: unknown): never {
  const errorMessage = error instanceof Error ? error.message : String(error);
  throw new Error(`${message}: ${errorMessage}`);
}
