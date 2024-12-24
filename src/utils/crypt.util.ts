import * as bcrypt from 'bcryptjs'

/**
 * @description Encrypts a string value using bcrypt.
 * @param value Value to be encrypted
 * @returns Encrypted value or error
 */
export async function encrypt({
  value,
  saltRounds = 10,
}: {
  value: string
  saltRounds?: number
}): Promise<string> {
  try {
    return await bcrypt.hash(value, saltRounds)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * @description Compares a string value with an encrypted value.
 * @param value Value to be compared
 * @param encryptedValue Encrypted value
 * @returns True if the value matches the encrypted value, false otherwise
 */
export async function compare({
  value,
  encryptedValue,
}: {
  value: string
  encryptedValue: string
}): Promise<boolean> {
  try {
    return await bcrypt.compare(value, encryptedValue)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * @description Generates a random string using bcrypt.
 * @param length Length of the string to be generated
 * @returns Random string
 */
export async function generateRandomString({
  length = 10,
}: {
  length?: number
}): Promise<string> {
  try {
    return await bcrypt.hash(Math.random().toString(), length)
  } catch (error) {
    return Promise.reject(error)
  }
}
