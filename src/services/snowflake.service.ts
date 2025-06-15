import { Snowflake } from '@sapphire/snowflake';

// Example Discord message id: 1322717493961297921

/**
 * Components of a Snowflake ID.
 */
export interface SnowflakeComponents {
  timestamp: bigint;
  workerId: bigint;
  processId: bigint;
  increment: bigint;
}

/**
 * Utility class for working with Snowflake IDs using the @sapphire/snowflake library.
 */
export class SnowflakeUtils {
  private static readonly DEFAULT_EPOCH = new Date('2025-01-01T00:00:00.000Z');

  /**
   * Generates a Snowflake ID using a custom epoch.
   * @param {object} [params] - The parameters for the method.
   * @param {Date} [params.epoch=DEFAULT_EPOCH] - The custom epoch to use for generating the Snowflake.
   * @param {bigint} [params.workerId=0n] - The worker ID.
   * @param {bigint} [params.processId=0n] - The process ID.
   * @returns {bigint} The generated Snowflake ID.
   * @throws {Error} Throws an error if the epoch is invalid.
   * @example
   * // Generate a Snowflake ID with default parameters
   * const id = SnowflakeUtils.generate();
   *
   * // Generate a Snowflake ID with custom parameters
   * const customId = SnowflakeUtils.generate({
   *   epoch: new Date('2023-01-01T00:00:00.000Z'),
   *   workerId: 1n,
   *   processId: 2n
   * });
   */
  public static generate({
    epoch = SnowflakeUtils.DEFAULT_EPOCH,
    workerId = 0n,
    processId = 0n,
  }: {
    epoch?: Date;
    workerId?: bigint;
    processId?: bigint;
  } = {}): bigint {
    if (!(epoch instanceof Date) || isNaN(epoch.getTime())) {
      throw new Error('Invalid epoch: must be a valid Date object.');
    }

    const snowflake = new Snowflake(epoch.getTime());
    return snowflake.generate({ workerId, processId });
  }

  /**
   * Deconstructs a Snowflake ID into its components using a custom epoch.
   * @param {object} params - The parameters for the method.
   * @param {bigint | string} params.snowflakeId - The Snowflake ID to deconstruct.
   * @param {Date} [params.epoch=DEFAULT_EPOCH] - The custom epoch to use for deconstruction.
   * @returns {SnowflakeComponents} The components of the Snowflake ID.
   * @throws {Error} Throws an error if the Snowflake ID or epoch is invalid.
   * @example
   * // Decode a Snowflake ID
   * const components = SnowflakeUtils.decode({
   *   snowflakeId: "1322717493961297921"
   * });
   * console.log(components); // { timestamp: 1234567890n, workerId: 1n, processId: 0n, increment: 42n }
   */
  public static decode({
    snowflakeId,
    epoch = SnowflakeUtils.DEFAULT_EPOCH,
  }: {
    snowflakeId: bigint | string;
    epoch?: Date;
  }): SnowflakeComponents {
    if (!snowflakeId || isNaN(Number(snowflakeId))) {
      throw new Error(
        'Invalid Snowflake ID: must be a valid bigint or string.',
      );
    }

    if (!(epoch instanceof Date) || isNaN(epoch.getTime())) {
      throw new Error('Invalid epoch: must be a valid Date object.');
    }

    const snowflake = new Snowflake(epoch.getTime());
    return snowflake.deconstruct(BigInt(snowflakeId));
  }

  /**
   * Gets the timestamp from a Snowflake ID using a custom epoch.
   * @param {object} params - The parameters for the method.
   * @param {bigint | string} params.snowflakeId - The Snowflake ID.
   * @param {Date} [params.epoch=DEFAULT_EPOCH] - The custom epoch to use.
   * @returns {Date} The extracted timestamp as a Date object.
   * @throws {Error} Throws an error if the Snowflake ID or epoch is invalid.
   * @example
   * // Get the timestamp from a Snowflake ID
   * const timestamp = SnowflakeUtils.getTimestamp({
   *   snowflakeId: "1322717493961297921"
   * });
   * console.log(timestamp); // Date object representing when the Snowflake was created
   */
  public static getTimestamp({
    snowflakeId,
    epoch = SnowflakeUtils.DEFAULT_EPOCH,
  }: {
    snowflakeId: bigint | string;
    epoch?: Date;
  }): Date {
    const { timestamp } = SnowflakeUtils.decode({
      snowflakeId,
      epoch,
    });
    return new Date(Number(timestamp));
  }

  /**
   * Validates if a string is a valid Snowflake ID.
   * @param {object} params - The parameters for the method.
   * @param {string} params.snowflakeId - The string to validate as a Snowflake ID.
   * @returns {boolean} True if the string is a valid Snowflake ID, false otherwise.
   * @example
   * // Check if a string is a valid Snowflake ID
   * const isValid = SnowflakeUtils.isValidSnowflake({
   *   snowflakeId: "1322717493961297921"
   * });
   * console.log(isValid); // true
   */
  public static isValidSnowflake({
    snowflakeId,
  }: {
    snowflakeId: string;
  }): boolean {
    if (!snowflakeId || typeof snowflakeId !== 'string') {
      return false;
    }

    // Snowflake IDs are numeric strings
    const numericRegex = /^\d+$/;
    if (!numericRegex.test(snowflakeId)) {
      return false;
    }

    try {
      // Check if it can be converted to BigInt without errors
      BigInt(snowflakeId);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Compares two Snowflake IDs to determine which one is newer.
   * @param {object} params - The parameters for the method.
   * @param {bigint | string} params.first - The first Snowflake ID.
   * @param {bigint | string} params.second - The second Snowflake ID.
   * @returns {number} 1 if first is newer, -1 if second is newer, 0 if they are the same.
   * @throws {Error} Throws an error if either Snowflake ID is invalid.
   * @example
   * // Compare two Snowflake IDs
   * const result = SnowflakeUtils.compare({
   *   first: "1322717493961297921",
   *   second: "1322717493961297920"
   * });
   * console.log(result); // 1 (first is newer)
   */
  public static compare({
    first,
    second,
  }: {
    first: bigint | string;
    second: bigint | string;
  }): number {
    const firstBigInt = typeof first === 'string' ? BigInt(first) : first;
    const secondBigInt = typeof second === 'string' ? BigInt(second) : second;

    if (firstBigInt > secondBigInt) return 1;
    if (firstBigInt < secondBigInt) return -1;
    return 0;
  }

  /**
   * Creates a Snowflake ID from a timestamp.
   * @param {object} params - The parameters for the method.
   * @param {Date} params.timestamp - The timestamp to create the Snowflake from.
   * @param {Date} [params.epoch=DEFAULT_EPOCH] - The custom epoch to use.
   * @returns {bigint} A Snowflake ID with the specified timestamp.
   * @throws {Error} Throws an error if the timestamp or epoch is invalid.
   * @example
   * // Create a Snowflake ID from a timestamp
   * const id = SnowflakeUtils.fromTimestamp({
   *   timestamp: new Date('2023-06-15T12:30:45.000Z')
   * });
   * console.log(id.toString());
   */
  public static fromTimestamp({
    timestamp,
    epoch = SnowflakeUtils.DEFAULT_EPOCH,
  }: {
    timestamp: Date;
    epoch?: Date;
  }): bigint {
    if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
      throw new Error('Invalid timestamp: must be a valid Date object.');
    }

    if (!(epoch instanceof Date) || isNaN(epoch.getTime())) {
      throw new Error('Invalid epoch: must be a valid Date object.');
    }

    const snowflake = new Snowflake(epoch.getTime());
    return snowflake.generate({ timestamp: timestamp.getTime() });
  }
}
