import { Snowflake } from '@sapphire/snowflake';

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
}
