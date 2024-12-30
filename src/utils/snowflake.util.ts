import { Snowflake } from '@sapphire/snowflake';
import {
  DEFAULT_EPOCH,
  DEFAULT_PROCESS_ID,
  DEFAULT_WORKER_ID,
} from '../config/snowflake.config';

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
  static generateSnowflake(): string {
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
  static isValidSnowflake({ id }: { id: string }): boolean {
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
}
