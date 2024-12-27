/**
 * Conversion constants for space measurements using meters as the base unit.
 */
export const spaceType = {
  meters: 1,
  miles: 0.000621371,
  kilometers: 0.001,
  centimeters: 100,
  millimeters: 1000,
  inches: 39.3701,
  feet: 3.28084,
  yards: 1.09361,
}

/**
 * Converts a value from one space measurement to another using meters as the base unit.
 * @param value The value to convert
 * @param fromType The type of the input measurement (e.g., 'meters', 'miles')
 * @param toType The type of the output measurement (e.g., 'kilometers', 'feet')
 * @returns The converted value
 */
export function convertSpace(
  value: number,
  fromType: keyof typeof spaceType,
  toType: keyof typeof spaceType,
): number {
  const valueInMeters = value / spaceType[fromType] // Convert to base unit (meters)
  return valueInMeters * spaceType[toType] // Convert from meters to the target unit
}

/**
 * Conversion constants for weight measurements using kilograms as the base unit.
 */
export const weightType = {
  kilograms: 1,
  pounds: 2.20462,
  ounces: 35.274,
  grams: 1000,
}

/**
 * Converts a value from one weight measurement to another using kilograms as the base unit.
 * @param value The value to convert
 * @param fromType The type of the input measurement (e.g., 'kilograms', 'pounds')
 * @param toType The type of the output measurement (e.g., 'grams', 'ounces')
 * @returns The converted value
 */
export function convertWeight(
  value: number,
  fromType: keyof typeof weightType,
  toType: keyof typeof weightType,
): number {
  const valueInKilograms = value / weightType[fromType] // Convert to base unit (kilograms)
  return valueInKilograms * weightType[toType] // Convert from kilograms to the target unit
}

/**
 * Conversion constants for volume measurements using liters as the base unit.
 */
export const volumeType = {
  liters: 1,
  gallons: 0.264172,
  milliliters: 1000,
  cubicMeters: 0.001,
}

/**
 * Converts a value from one volume measurement to another using liters as the base unit.
 * @param value The value to convert
 * @param fromType The type of the input measurement (e.g., 'liters', 'gallons')
 * @param toType The type of the output measurement (e.g., 'milliliters', 'cubicMeters')
 * @returns The converted value
 */
export function convertVolume(
  value: number,
  fromType: keyof typeof volumeType,
  toType: keyof typeof volumeType,
): number {
  const valueInLiters = value / volumeType[fromType] // Convert to base unit (liters)
  return valueInLiters * volumeType[toType] // Convert from liters to the target unit
}

/**
 * Converts a string to an integer.
 * @param value The string to convert
 * @returns The converted integer
 */
export function stringToInt(value: string): number {
  return parseInt(value, 10)
}

/**
 * Converts a string to a bigint.
 * @param value The string to convert
 * @returns The converted bigint
 */
export function stringToBigInt(value: string): bigint {
  return BigInt(value)
}

/**
 * Converts an integer to a bigint.
 * @param value The integer to convert
 * @returns The converted bigint
 */
export function intToBigInt(value: number): bigint {
  return BigInt(value)
}

/**
 * Converts a bigint to a string.
 * @param value The bigint to convert
 * @returns The converted string
 */
export function bigIntToString(value: bigint): string {
  return value.toString()
}

/**
 * Converts an integer to a string.
 * @param value The integer to convert
 * @returns The converted string
 */
export function intToString(value: number): string {
  return value.toString()
}

/**
 * Converts a bigint to an integer.
 * @param value The bigint to convert
 * @returns The converted integer
 */
export function bigIntToInt(value: bigint): number {
  return Number(value)
}
