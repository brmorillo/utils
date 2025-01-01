import { Snowflake } from '@sapphire/snowflake';

/**
 * Components of a Snowflake ID.
 */
interface SnowflakeComponents {
  timestamp: bigint;
  workerId: bigint;
  processId: bigint;
  increment: bigint;
}

// Discord message id: 1322717493961297921

/**
 * Utility class for working with Snowflake IDs using the @sapphire/snowflake library.
 */
export class SnowflakeUtils {
  private static readonly DEFAULT_EPOCH = new Date('2025-01-01T00:00:00.000Z');

  /**
   * Generates a Snowflake ID using a custom epoch.
   * @param {Date} [epoch=DEFAULT_EPOCH] - The custom epoch to use for generating the Snowflake.
   * @param {bigint} [workerId=0n] - The worker ID.
   * @param {bigint} [processId=0n] - The process ID.
   * @returns {bigint} - The generated Snowflake ID.
   * @throws {Error} Throws an error if the epoch is invalid.
   */
  public static generate({
    epoch = SnowflakeUtils.DEFAULT_EPOCH,
    workerId = 0n,
    processId = 0n,
  }: {
    epoch?: Date;
    workerId?: bigint;
    processId?: bigint;
  }): bigint {
    if (!(epoch instanceof Date) || isNaN(epoch.getTime())) {
      throw new Error('Invalid epoch: must be a valid Date object.');
    }

    const snowflake = new Snowflake(epoch.getTime());
    return snowflake.generate({ workerId, processId });
  }

  /**
   * Deconstructs a Snowflake ID into its components using a custom epoch.
   * @param {bigint | string} snowflakeId - The Snowflake ID to deconstruct.
   * @param {Date} [epoch=DEFAULT_EPOCH] - The custom epoch to use for deconstruction.
   * @returns {SnowflakeComponents} - The components of the Snowflake ID.
   * @throws {Error} Throws an error if the Snowflake ID or epoch is invalid.
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
   * @param {bigint | string} snowflakeId - The Snowflake ID.
   * @param {Date} [epoch=DEFAULT_EPOCH] - The custom epoch to use.
   * @returns {Date} - The extracted timestamp as a Date object.
   * @throws {Error} Throws an error if the Snowflake ID or epoch is invalid.
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
