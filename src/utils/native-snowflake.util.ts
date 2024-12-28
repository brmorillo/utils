import { dateNow } from './date.util'
import { convertValue } from './convert.util'
import {
  DEFAULT_EPOCH,
  DEFAULT_WORKER_ID,
  DEFAULT_PROCESS_ID,
} from '../config/snowflake.config'

export interface SnowflakeConfig {
  epoch?: number // Custom epoch, defaults to Unix epoch (0)
  workerId?: number // Worker ID (default: 0)
  processId?: number // Process ID (default: 0)
  workerIdBits?: number // Number of bits allocated for worker ID (default: 5)
  processIdBits?: number // Number of bits allocated for process ID (default: 5)
  sequenceBits?: number // Number of bits allocated for sequence (default: 12)
}

export class SnowflakeGenerator {
  private epoch: number
  private workerId: number
  private processId: number
  private workerIdBits: number
  private processIdBits: number
  private sequenceBits: number

  private maxWorkerId: number
  private maxProcessId: number
  private maxSequence: number

  private sequence: number = 0
  private lastTimestamp: number = -1

  constructor(config: SnowflakeConfig = {}) {
    this.epoch = DEFAULT_EPOCH ?? 0
    this.workerId = convertValue(DEFAULT_WORKER_ID, 'number') ?? 0
    this.processId = convertValue(DEFAULT_PROCESS_ID, 'number') ?? 0
    this.workerIdBits = config.workerIdBits ?? 5
    this.processIdBits = config.processIdBits ?? 5
    this.sequenceBits = config.sequenceBits ?? 12

    this.maxWorkerId = (1 << this.workerIdBits) - 1
    this.maxProcessId = (1 << this.processIdBits) - 1
    this.maxSequence = (1 << this.sequenceBits) - 1

    if (this.workerId > this.maxWorkerId || this.workerId < 0) {
      throw new Error(`Worker ID must be between 0 and ${this.maxWorkerId}`)
    }

    if (this.processId > this.maxProcessId || this.processId < 0) {
      throw new Error(`Process ID must be between 0 and ${this.maxProcessId}`)
    }
  }

  public snowflakeGenerate(): string {
    const timestamp = this.getCurrentTimestamp()

    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock moved backwards. Refusing to generate ID.')
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & this.maxSequence
      if (this.sequence === 0) {
        // Wait for the next millisecond
        while (this.getCurrentTimestamp() <= this.lastTimestamp) {}
      }
    } else {
      this.sequence = 0
    }

    this.lastTimestamp = timestamp

    const workerIdShift = this.sequenceBits
    const processIdShift = this.sequenceBits + this.workerIdBits
    const timestampShift =
      this.sequenceBits + this.workerIdBits + this.processIdBits

    const id =
      ((timestamp - this.epoch) << timestampShift) |
      (this.processId << processIdShift) |
      (this.workerId << workerIdShift) |
      this.sequence

    return id.toString()
  }

  private getCurrentTimestamp(): number {
    return dateNow(true).toMillis()
  }
}
