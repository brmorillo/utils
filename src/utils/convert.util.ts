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
 * Types of values that can be converted.
 */
export const TypeOfValueToConvert = {
  string: 'string',
  number: 'number',
  bigint: 'bigint',
}

/**
 * Converts a value between types by inferring the type of the input.
 * @param value The value to convert
 * @param toType The desired output type ('string', 'number', or 'bigint')
 * @returns The converted value
 */
export function convertValue(
  value: any,
  toType: keyof typeof TypeOfValueToConvert,
): any {
  const typeOfValue = typeof value

  if (!(typeOfValue in TypeOfValueToConvert)) {
    throw new Error(`Unsupported conversion from type: ${typeOfValue}`)
  }

  if (typeOfValue === toType) {
    return value
  }

  if (toType === 'string') {
    return value.toString()
  }

  if (toType === 'number') {
    if (typeOfValue === 'bigint') {
      return Number(value)
    }
    if (typeOfValue === 'string') {
      return parseFloat(value)
    }
  }

  if (toType === 'bigint') {
    if (typeOfValue === 'number') {
      return BigInt(Math.trunc(value))
    }
    if (typeOfValue === 'string') {
      return BigInt(value)
    }
  }

  throw new Error(`Unsupported conversion to type: ${toType}`)
}
