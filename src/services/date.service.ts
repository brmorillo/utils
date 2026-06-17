import { DateTime, Duration, DurationUnit, Info, Interval } from 'luxon';
import { ValidationError } from '../errors';

/**
 * The set of valid Luxon duration units accepted by {@link DateUtils.addTime}
 * and {@link DateUtils.removeTime}.
 */
const VALID_DURATION_UNITS: DurationUnit[] = [
  'years',
  'quarters',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
];

/**
 * Parses an ISO string into a `DateTime` (or returns the given `DateTime`),
 * throwing a {@link ValidationError} when the result is invalid.
 */
function parseDateTime(date: DateTime | string): DateTime {
  const parsed = typeof date === 'string' ? DateTime.fromISO(date) : date;
  if (!parsed.isValid) {
    throw new ValidationError(
      `Invalid date${
        parsed.invalidReason ? `: ${parsed.invalidReason}` : ''
      }`,
    );
  }
  return parsed;
}

/**
 * Validates that a duration-like object only contains supported units,
 * throwing a {@link ValidationError} otherwise.
 */
function validateDurationObject(
  duration: Duration | Partial<Record<DurationUnit, number>>,
): void {
  if (duration instanceof Duration) return;

  if (typeof duration !== 'object' || duration === null) {
    throw new ValidationError(
      'Duration must be a Duration instance or a plain object of duration units.',
    );
  }

  const invalidUnits = Object.keys(duration).filter(
    key => !VALID_DURATION_UNITS.includes(key as DurationUnit),
  );

  if (invalidUnits.length > 0) {
    throw new ValidationError(
      `Invalid duration units: ${invalidUnits.join(
        ', ',
      )}. Valid units are: ${VALID_DURATION_UNITS.join(', ')}`,
    );
  }
}

export class DateUtils {
  /**
   * Gets the current date and time, either in UTC or the system's timezone.
   * @param {object} [params] - The parameters for the method.
   * @param {boolean} [params.utc=true] - If `true`, returns the current date in UTC. Defaults to `true`.
   * @returns {DateTime} The current `DateTime`.
   * @example
   * DateUtils.now(); // Current UTC DateTime (default)
   * DateUtils.now({ utc: false }); // Current DateTime in local timezone
   */
  public static now({ utc = true }: { utc?: boolean } = {}): DateTime {
    return utc ? DateTime.utc() : DateTime.now();
  }

  /**
   * Creates an interval between two dates.
   * @param {object} params - The parameters for the method.
   * @param {DateTime | string} params.startDate - The start date (`DateTime` or ISO string).
   * @param {DateTime | string} params.endDate - The end date (`DateTime` or ISO string).
   * @returns {Interval} The `Interval` between the dates.
   * @throws {ValidationError} When either date is an invalid ISO string or the resulting interval is invalid (e.g. end before start).
   * @example
   * DateUtils.createInterval({
   *   startDate: '2024-01-01',
   *   endDate: '2024-12-31'
   * }); // Interval between Jan 1 and Dec 31, 2024
   */
  public static createInterval({
    startDate,
    endDate,
  }: {
    startDate: DateTime | string;
    endDate: DateTime | string;
  }): Interval {
    const start = parseDateTime(startDate);
    const end = parseDateTime(endDate);
    const interval = Interval.fromDateTimes(start, end);
    if (!interval.isValid) {
      throw new ValidationError(
        `Invalid interval${
          interval.invalidReason ? `: ${interval.invalidReason}` : ''
        }`,
      );
    }
    return interval;
  }

  /**
   * Adds a specific duration to a date.
   * @param {object} params - The parameters for the method.
   * @param {DateTime | string} params.date - The initial date (`DateTime` or ISO string).
   * @param {Duration | Partial<Record<DurationUnit, number>>} params.timeToAdd - The duration to add (e.g., `{ days: 1, hours: 5 }`).
   * @returns {DateTime} The `DateTime` with the added duration.
   * @throws {ValidationError} When the date is an invalid ISO string, or `timeToAdd` is not an object/`Duration`, or contains invalid duration units.
   * @example
   * DateUtils.addTime({
   *   date: '2024-01-01',
   *   timeToAdd: { days: 5 }
   * }); // January 6, 2024
   */
  public static addTime({
    date,
    timeToAdd,
  }: {
    date: DateTime | string;
    timeToAdd: Duration | Partial<Record<DurationUnit, number>>;
  }): DateTime {
    const parsedDate = parseDateTime(date);

    validateDurationObject(timeToAdd);

    const duration =
      timeToAdd instanceof Duration
        ? timeToAdd
        : Duration.fromObject(timeToAdd as Record<DurationUnit, number>);
    return parsedDate.plus(duration);
  }

  /**
   * Subtracts a specific duration from a date.
   * @param {object} params - The parameters for the method.
   * @param {DateTime | string} params.date - The initial date (`DateTime` or ISO string).
   * @param {Duration | Partial<Record<DurationUnit, number>>} params.timeToRemove - The duration to subtract (e.g., `{ weeks: 2 }`).
   * @returns {DateTime} The `DateTime` with the subtracted duration.
   * @throws {ValidationError} When the date is an invalid ISO string, or `timeToRemove` is not an object/`Duration`, or contains invalid duration units.
   * @example
   * DateUtils.removeTime({
   *   date: '2024-01-01',
   *   timeToRemove: { days: 5 }
   * }); // December 27, 2023
   */
  public static removeTime({
    date,
    timeToRemove,
  }: {
    date: DateTime | string;
    timeToRemove: Duration | Partial<Record<DurationUnit, number>>;
  }): DateTime {
    const parsedDate = parseDateTime(date);

    validateDurationObject(timeToRemove);

    const duration =
      timeToRemove instanceof Duration
        ? timeToRemove
        : Duration.fromObject(timeToRemove as Record<DurationUnit, number>);
    return parsedDate.minus(duration);
  }

  /**
   * Calculates the difference between two dates in specific units.
   * @param {object} params - The parameters for the method.
   * @param {DateTime | string} params.startDate - The start date (`DateTime` or ISO string).
   * @param {DateTime | string} params.endDate - The end date (`DateTime` or ISO string).
   * @param {DurationUnit[]} params.units - The units of time for the difference (e.g., `['days']`, `['hours']`).
   * @returns {Duration} The `Duration` of the difference in the specified units.
   * @throws {ValidationError} When either date is an invalid ISO string.
   * @example
   * DateUtils.diffBetween({
   *   startDate: '2024-01-01',
   *   endDate: '2024-12-31',
   *   units: ['days']
   * }); // Duration representing 366 days (2024 is a leap year)
   */
  public static diffBetween({
    startDate,
    endDate,
    units,
  }: {
    startDate: DateTime | string;
    endDate: DateTime | string;
    units: DurationUnit[];
  }): Duration {
    const start = parseDateTime(startDate);
    const end = parseDateTime(endDate);
    return end.diff(start, units);
  }

  /**
   * Converts a date to UTC.
   * @param {object} params - The parameters for the method.
   * @param {DateTime | string} params.date - The date to convert (`DateTime` or ISO string).
   * @returns {DateTime} The `DateTime` in UTC.
   * @throws {ValidationError} When the date is an invalid ISO string.
   * @example
   * DateUtils.toUTC({
   *   date: '2024-01-01T12:00:00+03:00'
   * }); // 2024-01-01T09:00:00.000Z
   */
  public static toUTC({ date }: { date: DateTime | string }): DateTime {
    const dateTime = parseDateTime(date);
    return dateTime.toUTC();
  }

  /**
   * Converts a date to a specified timezone.
   * @param {object} params - The parameters for the method.
   * @param {DateTime | string} params.date - The date to convert (`DateTime` or ISO string).
   * @param {string} params.timeZone - The target timezone (e.g., `'America/New_York'`).
   * @returns {DateTime} The `DateTime` in the specified timezone.
   * @throws {ValidationError} When the date is an invalid ISO string or the timezone is not a valid IANA zone.
   * @example
   * DateUtils.toTimeZone({
   *   date: '2024-01-01T12:00:00Z',
   *   timeZone: 'America/New_York'
   * }); // 2024-01-01T07:00:00.000-05:00
   */
  public static toTimeZone({
    date,
    timeZone,
  }: {
    date: DateTime | string;
    timeZone: string;
  }): DateTime {
    const dateTime = parseDateTime(date);

    if (!Info.isValidIANAZone(timeZone)) {
      throw new ValidationError(`Invalid timezone: ${timeZone}`);
    }

    const converted = dateTime.setZone(timeZone);
    if (!converted.isValid) {
      throw new ValidationError(
        `Invalid timezone: ${timeZone}${
          converted.invalidReason ? ` (${converted.invalidReason})` : ''
        }`,
      );
    }
    return converted;
  }
}
