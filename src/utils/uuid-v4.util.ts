import { v4 as uuidv4, validate as validateUuid } from 'uuid'

/**
 * @description Generates a UUID (version 4).
 * @returns A unique UUID string.
 */
export function uuidGenerate(): string {
  return uuidv4()
}

/**
 * @description Validates if a string is a valid UUID.
 * @param id The string to validate.
 * @returns True if the string is a valid UUID, false otherwise.
 */
export function uuidIsValid(id: string): boolean {
  return validateUuid(id)
}
