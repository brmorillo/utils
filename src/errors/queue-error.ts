import { BaseError } from './base-error';

/**
 * Error thrown when an operation cannot complete because a bounded data
 * structure (queue, stack, priority queue, etc.) has reached its capacity.
 */
export class QueueFullError extends BaseError {
  /**
   * Creates a new QueueFullError.
   * @param message Error message
   * @param details Additional error details (e.g. the current size / maxSize)
   * @param options Extra options, e.g. the original error as `cause`
   */
  constructor(
    message = 'Queue is full',
    details?: Record<string, any>,
    options?: { cause?: unknown },
  ) {
    super(message, 'QUEUE_FULL', undefined, details, options);
  }
}
