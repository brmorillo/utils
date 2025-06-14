import { DateTime, Duration, DurationUnit, Interval } from 'luxon';

export class DateUtils {
  /**
   * Gets the current date and time, either in UTC or the system's timezone.
   * @param {object} [params] - The parameters for the method.
   * @param {boolean} [params.utc=false] - If `true`, returns the current date in UTC.
   * @returns {DateTime} The current `DateTime`.
   * @example
   * DateUtils.now({ utc: true }); // Current UTC DateTime
   * DateUtils.now(); // Current DateTime in local timezone
   */
  public static now({ utc = false }: { utc?: boolean } = {}): DateTime {
    return utc ? DateTime.utc() : DateTime.now();
  }

  /**
   * Creates an interval between two dates.
   * @param {object} params - The parameters for the method.
   * @param {DateTime | string} params.startDate - The start date (`DateTime` or ISO string).
   * @param {DateTime | string} params.endDate - The end date (`DateTime` or ISO string).
   * @returns {Interval} The `Interval` between the dates.
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
    const start =
      typeof startDate === 'string' ? DateTime.fromISO(startDate) : startDate;
    const end =
      typeof endDate === 'string' ? DateTime.fromISO(endDate) : endDate;
    return Interval.fromDateTimes(start, end);
  }

  /**
   * Adds a specific duration to a date.
   * @param {object} params - The parameters for the method.
   * @param {DateTime | string} params.date - The initial date (`DateTime` or ISO string).
   * @param {Duration | Record<string, number>} params.timeToAdd - The duration to add (e.g., `{ days: 1, hours: 5 }`).
   * @returns {DateTime} The `DateTime` with the added duration.
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
    timeToAdd: Duration | Record<string, number>;
  }): DateTime {
    const parsedDate = typeof date === 'string' ? DateTime.fromISO(date) : date;
    return parsedDate.plus(Duration.fromObject(timeToAdd));
  }

  /**
   * Subtracts a specific duration from a date.
   * @param {object} params - The parameters for the method.
   * @param {DateTime | string} params.date - The initial date (`DateTime` or ISO string).
   * @param {Duration | Record<string, number>} params.timeToRemove - The duration to subtract (e.g., `{ weeks: 2 }`).
   * @returns {DateTime} The `DateTime` with the subtracted duration.
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
    timeToRemove: Duration | Record<string, number>;
  }): DateTime {
    const parsedDate =
      typeof date === 'string'
        ? DateTime.fromISO(date, { setZone: true })
        : date;

    return parsedDate.minus(Duration.fromObject(timeToRemove));
  }

  /**
   * Calculates the difference between two dates in specific units.
   * @param {object} params - The parameters for the method.
   * @param {DateTime | string} params.startDate - The start date (`DateTime` or ISO string).
   * @param {DateTime | string} params.endDate - The end date (`DateTime` or ISO string).
   * @param {DurationUnit[]} params.units - The units of time for the difference (e.g., `['days']`, `['hours']`).
   * @returns {Duration} The `Duration` of the difference in the specified units.
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
    const start =
      typeof startDate === 'string' ? DateTime.fromISO(startDate) : startDate;
    const end =
      typeof endDate === 'string' ? DateTime.fromISO(endDate) : endDate;
    return end.diff(start, units);
  }

  /**
   * Converts a date to UTC.
   * @param {object} params - The parameters for the method.
   * @param {DateTime | string} params.date - The date to convert (`DateTime` or ISO string).
   * @returns {DateTime} The `DateTime` in UTC.
   * @example
   * DateUtils.toUTC({
   *   date: '2024-01-01T12:00:00+03:00'
   * }); // 2024-01-01T09:00:00.000Z
   */
  public static toUTC({ date }: { date: DateTime | string }): DateTime {
    const dateTime = typeof date === 'string' ? DateTime.fromISO(date) : date;
    return dateTime.toUTC();
  }

  /**
   * Converts a date to a specified timezone.
   * @param {object} params - The parameters for the method.
   * @param {DateTime | string} params.date - The date to convert (`DateTime` or ISO string).
   * @param {string} params.timeZone - The target timezone (e.g., `'America/New_York'`).
   * @returns {DateTime} The `DateTime` in the specified timezone.
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
    const dateTime = typeof date === 'string' ? DateTime.fromISO(date) : date;
    return dateTime.setZone(timeZone);
  }
}
