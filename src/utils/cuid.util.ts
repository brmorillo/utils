import cuid from 'cuid'

/**
 * @description Generates a collision-resistant unique identifier (CUID).
 * @returns A unique CUID string.
 */
export function cuidGenerate(): string {
  return cuid()
}

/**
 * @description Checks if a string is a valid CUID.
 * @param id The string to validate.
 * @returns True if the string is a valid CUID, false otherwise.
 */
export function cuidIsValid(id: string): boolean {
  return cuid.isCuid(id)
}

/**
 * @description Generates a collision-resistant unique identifier (CUID) slug.
 * @returns A shorter unique CUID slug string.
 */
export function cuidGenerateSlug(): string {
  return cuid.slug()
}
