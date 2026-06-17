import { DateUtils } from '../../src/services/date.service';
import { DateTime, Duration } from 'luxon';

/**
 * Integration tests for the DateUtils class.
 * These tests verify more complex scenarios that involve multiple methods.
 */
describe('DateUtils - Integration Tests', () => {
  describe('Chained operations', () => {
    it('should correctly calculate the duration of an event', () => {
      // Scenario: Calculate the duration of an event in different units
      // 1. Create a date interval
      const interval = DateUtils.createInterval({
        startDate: '2023-01-01T10:00:00Z',
        endDate: '2023-01-03T15:30:00Z',
      });

      // 2. Calculate the duration in days, hours and minutes
      const duration = DateUtils.diffBetween({
        startDate: interval.start || DateTime.fromISO('2023-01-01T10:00:00Z'),
        endDate: interval.end || DateTime.fromISO('2023-01-03T15:30:00Z'),
        units: ['days', 'hours', 'minutes'],
      });

      // 3. Add the duration to a new date
      const newDate = DateUtils.addTime({
        date: interval.start || DateTime.fromISO('2023-01-01T10:00:00Z'),
        timeToAdd: duration,
      });

      // Assertions
      expect(duration.days).toBe(2);
      expect(duration.hours).toBe(5);
      expect(duration.minutes).toBe(30);
      expect(newDate.toISO()).toBe(interval.end?.toISO());
    });

    it('should correctly convert between timezones', () => {
      // Scenario: Convert a date between different timezones
      // 1. Create a UTC date
      const utcDate = DateUtils.now({ utc: true });

      // 2. Convert to New York timezone
      const nyDate = DateUtils.toTimeZone({
        date: utcDate,
        timeZone: 'America/New_York',
      });

      // 3. Convert to Tokyo timezone
      const tokyoDate = DateUtils.toTimeZone({
        date: utcDate,
        timeZone: 'Asia/Tokyo',
      });

      // 4. Convert back to UTC
      const backToUtc = DateUtils.toUTC({ date: nyDate });

      // Assertions
      expect(utcDate.hour).not.toBe(nyDate.hour); // Different hours in different timezones
      expect(utcDate.hour).not.toBe(tokyoDate.hour);
      expect(nyDate.hour).not.toBe(tokyoDate.hour);
      expect(utcDate.toMillis()).toBe(backToUtc.toMillis()); // Same timestamp when converting back
    });

    it('should correctly calculate relative dates', () => {
      // Scenario: Calculate relative dates from a base date
      // 1. Get the current date
      const now = DateUtils.now();

      // 2. Calculate a date in the past (1 month ago)
      const oneMonthAgo = DateUtils.removeTime({
        date: now,
        timeToRemove: { months: 1 },
      });

      // 3. Calculate a date in the future (2 weeks ahead)
      const twoWeeksLater = DateUtils.addTime({
        date: now,
        timeToAdd: { weeks: 2 },
      });

      // 4. Calculate the difference between the dates
      const totalDuration = DateUtils.diffBetween({
        startDate: oneMonthAgo,
        endDate: twoWeeksLater,
        units: ['days'],
      });

      // Assertions
      expect(oneMonthAgo < now).toBe(true);
      expect(twoWeeksLater > now).toBe(true);
      expect(totalDuration.days).toBeGreaterThan(30); // Approximately 1 month + 2 weeks
    });
  });

  describe('Real-world use cases', () => {
    it('should correctly calculate the intersection of two date intervals', () => {
      // Scenario: Verify the overlap of two events
      // 1. Create the first interval (January 10 to 20)
      const interval1 = DateUtils.createInterval({
        startDate: '2023-01-10',
        endDate: '2023-01-20',
      });

      // 2. Create the second interval (January 15 to 25)
      const interval2 = DateUtils.createInterval({
        startDate: '2023-01-15',
        endDate: '2023-01-25',
      });

      // 3. Calculate the intersection of the intervals
      const intersection = interval1.intersection(interval2);

      // 4. Calculate the duration of the intersection
      const duration = intersection
        ? DateUtils.diffBetween({
            startDate: intersection.start || DateTime.fromISO('2023-01-15'),
            endDate: intersection.end || DateTime.fromISO('2023-01-20'),
            units: ['days'],
          })
        : Duration.fromObject({ days: 0 });

      // Assertions
      expect(intersection?.start?.toISODate()).toBe('2023-01-15');
      expect(intersection?.end?.toISODate()).toBe('2023-01-20');
      expect(duration.days).toBe(5);
    });

    it.skip('should correctly format dates for different regions', () => {
      // Scenario: Format the same date for different regions
      // 1. Create a specific date
      const date = DateTime.fromISO('2023-04-15T14:30:00Z');

      // 2. Convert to different timezones
      const dateNY = DateUtils.toTimeZone({
        date,
        timeZone: 'America/New_York',
      });
      const dateTokyo = DateUtils.toTimeZone({
        date,
        timeZone: 'Asia/Tokyo',
      });
      const dateParis = DateUtils.toTimeZone({
        date,
        timeZone: 'Europe/Paris',
      });

      // Assertions
      expect(dateNY.toLocaleString(DateTime.DATETIME_FULL)).toContain('EDT');
      expect(dateTokyo.toLocaleString(DateTime.DATETIME_FULL)).toContain('JST');
      expect(dateParis.toLocaleString(DateTime.DATETIME_FULL)).toContain(
        'CEST',
      );

      // All represent the same instant
      expect(dateNY.toUTC().toISO()).toBe(date.toISO());
      expect(dateTokyo.toUTC().toISO()).toBe(date.toISO());
      expect(dateParis.toUTC().toISO()).toBe(date.toISO());
    });

    it('should correctly calculate due dates', () => {
      // Scenario: Calculate due dates for invoices
      // 1. Invoice issue date
      const issueDate = DateTime.fromISO('2023-03-15');

      // 2. Calculate due date (30 days)
      const dueDate = DateUtils.addTime({
        date: issueDate,
        timeToAdd: { days: 30 },
      });

      // 3. Check if it is overdue (comparing with a future date)
      const checkDate = DateTime.fromISO('2023-04-20'); // 5 days after the due date
      const isOverdue = checkDate > dueDate;

      // 4. Calculate interest (1% per day overdue)
      let lateFee = 0;
      if (isOverdue) {
        const daysLate = DateUtils.diffBetween({
          startDate: dueDate,
          endDate: checkDate,
          units: ['days'],
        }).days;
        lateFee = daysLate * 0.01; // 1% per day
      }

      // Assertions
      expect(dueDate.toISODate()).toBe('2023-04-14');
      expect(isOverdue).toBe(true);
      expect(lateFee).toBe(0.06); // 6 days * 1%
    });
  });

  describe('Time zone handling', () => {
    it.skip('should correctly handle daylight saving time changes', () => {
      // Scenario: Handle the daylight saving time change in the US (second Sunday of March)
      // 1. Date before the daylight saving time change
      const beforeDST = DateTime.fromISO('2023-03-11T12:00:00', {
        zone: 'America/New_York',
      });

      // 2. Date after the daylight saving time change
      const afterDST = DateTime.fromISO('2023-03-12T12:00:00', {
        zone: 'America/New_York',
      });

      // 3. Add 24 hours to the date before the change
      const add24h = DateUtils.addTime({
        date: beforeDST,
        timeToAdd: { hours: 24 },
      });

      // Assertions
      expect(beforeDST.offset).not.toBe(afterDST.offset); // Different offset due to daylight saving time
      expect(add24h.day).toBe(12); // Same day
      expect(add24h.hour).toBe(12); // Same hour
      expect(add24h.offset).toBe(afterDST.offset); // Same offset after the change
    });

    it('should correctly calculate durations that cross time changes', () => {
      // Scenario: Calculate a duration that crosses a daylight saving time change
      // 1. Create an interval that crosses the time change
      const startDate = DateTime.fromISO('2023-03-11T12:00:00', {
        zone: 'America/New_York',
      });
      const endDate = DateTime.fromISO('2023-03-12T12:00:00', {
        zone: 'America/New_York',
      });

      // 2. Calculate the duration in hours
      const duration = DateUtils.diffBetween({
        startDate,
        endDate,
        units: ['hours'],
      });

      // Assertions
      expect(duration.hours).toBe(23); // 23 actual hours due to the time change
    });

    it('should throw when converting to an invalid timezone in a chain', () => {
      const utcDate = DateUtils.now({ utc: true });
      expect(() => {
        DateUtils.toTimeZone({ date: utcDate, timeZone: 'Mars/Phobos' });
      }).toThrow('Invalid timezone');
    });
  });

  describe('Invalid input handling', () => {
    it('should throw a ValidationError when given an invalid ISO date string', () => {
      expect(() => {
        DateUtils.diffBetween({
          startDate: 'totally-invalid',
          endDate: '2023-01-01',
          units: ['days'],
        });
      }).toThrow('Invalid date');
    });
  });
});
