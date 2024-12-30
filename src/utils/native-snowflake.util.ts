import {
  DEFAULT_EPOCH,
  DEFAULT_PROCESS_ID,
  DEFAULT_WORKER_ID,
} from '../config/snowflake.config';
import { ConvertUtils } from './convert.util';
import { DateUtils } from './date.util';

/**
 * Snowflake Generator Configuration Interface
 */
export interface SnowflakeConfig {
  epoch?: number; // Custom epoch, defaults to Unix epoch (0)
  workerId?: number; // Worker ID (default: 0)
  processId?: number; // Process ID (default: 0)
  workerIdBits?: number; // Number of bits allocated for worker ID (default: 5)
  processIdBits?: number; // Number of bits allocated for process ID (default: 5)
  sequenceBits?: number; // Number of bits allocated for sequence (default: 12)
}

/**
 * Snowflake ID Generator Class
 */
export class SnowflakeGenerator {
  private epoch: number;
  private workerId: number;
  private processId: number;
  private workerIdBits: number;
  private processIdBits: number;
  private sequenceBits: number;

  private maxWorkerId: number;
  private maxProcessId: number;
  private maxSequence: number;

  private sequence: number = 0;
  private lastTimestamp: number = -1;

  constructor(config: SnowflakeConfig = {}) {
    this.epoch = config.epoch ?? DEFAULT_EPOCH ?? 0;
    this.workerId =
      ConvertUtils.convertValue({
        value: config.workerId ?? DEFAULT_WORKER_ID,
        toType: 'number',
      }) ?? 0;
    this.processId =
      ConvertUtils.convertValue({
        value: config.processId ?? DEFAULT_PROCESS_ID,
        toType: 'number',
      }) ?? 0;
    this.workerIdBits = config.workerIdBits ?? 5;
    this.processIdBits = config.processIdBits ?? 5;
    this.sequenceBits = config.sequenceBits ?? 12;

    this.maxWorkerId = (1 << this.workerIdBits) - 1;
    this.maxProcessId = (1 << this.processIdBits) - 1;
    this.maxSequence = (1 << this.sequenceBits) - 1;

    if (this.workerId > this.maxWorkerId || this.workerId < 0) {
      throw new Error('Worker ID is out of range');
    }

    if (this.processId > this.maxProcessId || this.processId < 0) {
      throw new Error('Process ID is out of range');
    }
  }

  /**
   * Generates a unique Snowflake ID.
   * @returns A string representing the generated Snowflake ID.
   * @example
   * const generator = new SnowflakeGenerator({ epoch: 1609459200000 });
   * generator.snowflakeGenerate(); // "1420070400000000000"
   */
  public snowflakeGenerate(): string {
    const timestamp = this.getCurrentTimestamp();

    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock moved backwards. Refusing to generate ID.');
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & this.maxSequence;
      if (this.sequence === 0) {
        while (this.getCurrentTimestamp() <= this.lastTimestamp) {}
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    const workerIdShift = this.sequenceBits;
    const processIdShift = this.sequenceBits + this.workerIdBits;
    const timestampShift =
      this.sequenceBits + this.workerIdBits + this.processIdBits;

    const id =
      ((timestamp - this.epoch) << timestampShift) |
      (this.processId << processIdShift) |
      (this.workerId << workerIdShift) |
      this.sequence;

    return id.toString();
  }

  /**
   * Retrieves the current timestamp in milliseconds.
   * @returns Current timestamp in milliseconds.
   * @example
   * const timestamp = generator.getCurrentTimestamp(); // 1672531200000
   */
  private getCurrentTimestamp(): number {
    return DateUtils.now({ utc: true }).toMillis();
  }
}
