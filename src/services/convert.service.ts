export class ConvertUtils {
  /**
   * Conversion constants for space measurements using meters as the base unit.
   */
  public static spaceType = {
    meters: 1,
    miles: 0.000621371,
    kilometers: 0.001,
    centimeters: 100,
    millimeters: 1000,
    inches: 39.3701,
    feet: 3.28084,
    yards: 1.09361,
  };

  /**
   * Converts a value from one space measurement to another using meters as the base unit.
   * @param value The value to be converted
   * @param fromType The source unit type (e.g., 'meters')
   * @param toType The target unit type (e.g., 'kilometers')
   * @returns The converted value
   * @example
   * ConvertUtils.convertSpace({ value: 1000, fromType: 'meters', toType: 'kilometers' }) // 1
   */
  public static convertSpace({
    value,
    fromType,
    toType,
  }: {
    value: number;
    fromType: keyof typeof ConvertUtils.spaceType;
    toType: keyof typeof ConvertUtils.spaceType;
  }): number {
    const valueInMeters = value / ConvertUtils.spaceType[fromType]; // Convert to base unit (meters)
    return valueInMeters * ConvertUtils.spaceType[toType]; // Convert from meters to the target unit
  }

  /**
   * Conversion constants for weight measurements using kilograms as the base unit.
   */
  public static weightType = {
    kilograms: 1,
    pounds: 2.20462,
    ounces: 35.274,
    grams: 1000,
  };

  /**
   * Converts a value from one weight measurement to another using kilograms as the base unit.
   * @param value The value to be converted
   * @param fromType The source unit type (e.g., 'kilograms')
   * @param toType The target unit type (e.g., 'pounds')
   * @returns The converted value
   * @example
   * ConvertUtils.convertWeight({ value: 1, fromType: 'kilograms', toType: 'pounds' }) // 2.20462
   */
  public static convertWeight({
    value,
    fromType,
    toType,
  }: {
    value: number;
    fromType: keyof typeof ConvertUtils.weightType;
    toType: keyof typeof ConvertUtils.weightType;
  }): number {
    const valueInKilograms = value / ConvertUtils.weightType[fromType]; // Convert to base unit (kilograms)
    return valueInKilograms * ConvertUtils.weightType[toType]; // Convert from kilograms to the target unit
  }

  /**
   * Conversion constants for volume measurements using liters as the base unit.
   */
  public static volumeType = {
    liters: 1,
    gallons: 0.264172,
    milliliters: 1000,
    cubicMeters: 0.001,
  };

  /**
   * Converts a value from one volume measurement to another using liters as the base unit.
   * @param value The value to be converted
   * @param fromType The source unit type (e.g., 'liters')
   * @param toType The target unit type (e.g., 'gallons')
   * @returns The converted value
   * @example
   * ConvertUtils.convertVolume({ value: 1, fromType: 'liters', toType: 'gallons' }) // 0.264172
   */
  public static convertVolume({
    value,
    fromType,
    toType,
  }: {
    value: number;
    fromType: keyof typeof ConvertUtils.volumeType;
    toType: keyof typeof ConvertUtils.volumeType;
  }): number {
    const valueInLiters = value / ConvertUtils.volumeType[fromType]; // Convert to base unit (liters)
    return valueInLiters * ConvertUtils.volumeType[toType]; // Convert from liters to the target unit
  }

  /**
   * Converts a value between types by inferring the type of the input.
   * @param value The value to be converted
   * @param toType The target type ('string', 'number', or 'bigint')
   * @returns The converted value or null if conversion is not possible
   * @example
   * ConvertUtils.convertValue({ value: "42", toType: "number" }) // 42
   * ConvertUtils.convertValue({ value: 42, toType: "string" }) // "42"
   * ConvertUtils.convertValue({ value: "42", toType: "bigint" }) // 42n
   * ConvertUtils.convertValue({ value: 42n, toType: "roman" }) // "XLII"
   */
  public static convertValue({
    value,
    toType,
  }: {
    value: any;
    toType: 'string' | 'integer' | 'number' | 'bigint' | 'roman';
  }): any {
    const typeOfValue = typeof value;

    if (typeOfValue === toType) {
      return value;
    }

    if (toType === 'string') {
      return value.toString();
    }

    if (toType === 'integer') {
      if (typeOfValue === 'bigint') {
        return Number(value);
      }
      if (typeOfValue === 'string') {
        const parsed = parseInt(value);
        return isNaN(parsed) ? null : parsed;
      }
    }

    if (toType === 'number') {
      if (typeOfValue === 'bigint') {
        return Number(value);
      }
      if (typeOfValue === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
      }
    }

    if (toType === 'bigint') {
      if (typeOfValue === 'number') {
        return BigInt(Math.trunc(value));
      }
      if (typeOfValue === 'string') {
        try {
          return BigInt(value);
        } catch {
          return null;
        }
      }
    }

    if (toType === 'roman') {
      if (typeof value !== 'number' || value <= 0 || !Number.isInteger(value)) {
        throw new Error(
          'Value must be a positive integer to convert to Roman.',
        );
      }

      let result = '';
      const romanNumerals: { [key: string]: number } = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
      };

      for (const [roman, numericValue] of Object.entries(romanNumerals)) {
        while (value >= numericValue) {
          result += roman;
          value -= numericValue;
        }
      }

      return result;
    }
  }
}
