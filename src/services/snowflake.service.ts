import { Snowflake } from '@sapphire/snowflake';
export const DEFAULT_EPOCH = new Date('1970-01-01T00:00:00.000Z').getTime();
export const DEFAULT_WORKER_ID = 0n;
export const DEFAULT_PROCESS_ID = 0n;

/**
 * Snowflake utilities encapsulated in a class for better modularity.
 */
export class SnowflakeUtils {
  private static epoch = DEFAULT_EPOCH;
  private static snowflake = new Snowflake(SnowflakeUtils.epoch);

  /**
   * Generates a unique identifier using the Snowflake algorithm.
   * @returns The generated Snowflake ID as a string
   * @example
   * const id = SnowflakeUtils.generateSnowflake();
   */
  public static generateSnowflake(): string {
    return SnowflakeUtils.snowflake
      .generate({
        workerId: DEFAULT_WORKER_ID,
        processId: DEFAULT_PROCESS_ID,
      })
      .toString();
  }

  /**
   * Validates if a string is a valid Snowflake ID.
   * @param id The ID to validate
   * @returns True if the ID is valid, false otherwise
   * @example
   * const isValid = SnowflakeUtils.isValidSnowflake({ id: "123456789" });
   */
  public static isValidSnowflake({ id }: { id: string }): boolean {
    if (!id) {
      return false;
    }

    try {
      const bigIntId = BigInt(id);
      const { timestamp, workerId, processId, increment } =
        SnowflakeUtils.snowflake.deconstruct(bigIntId);

      return (
        timestamp >= new Date(SnowflakeUtils.epoch).getTime() &&
        workerId >= 0 &&
        processId >= 0 &&
        increment >= 0
      );
    } catch {
      return false;
    }
  }

  /**
   * Decodes a Snowflake ID to extract its components.
   * @param id The Snowflake ID to decode
   * @returns An object containing the timestamp, workerId, processId, and increment
   * @example
   * const components = SnowflakeUtils.decodeSnowflake({ id: "123456789" });
   */
  public static decodeSnowflake({ id }: { id: string }): {
    timestamp: bigint;
    datetime: Date;
    workerId: bigint;
    processId: bigint;
    increment: bigint;
  } {
    const bigIntId = BigInt(id);
    const { timestamp, workerId, processId, increment } =
      SnowflakeUtils.snowflake.deconstruct(bigIntId);

    return {
      timestamp,
      datetime: new Date(Number(timestamp)),
      workerId,
      processId,
      increment,
    };
  }
}
