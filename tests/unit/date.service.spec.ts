import { DateUtils } from '../../src/services/date.service';
import { DateTime, Duration } from 'luxon';

/**
 * Unit tests for the DateUtils class.
 */
describe('DateUtils', () => {
  describe('now', () => {
    it('should return the current date in UTC by default', () => {
      const utcNow = DateUtils.now();
      const systemUtcNow = DateTime.utc();

      // Check that the difference is less than 100ms
      expect(
        Math.abs(utcNow.toMillis() - systemUtcNow.toMillis()),
      ).toBeLessThan(100);
      expect(utcNow.zoneName).toBe('UTC');
    });

    it('should return the current date in the local time zone when utc=false', () => {
      const localNow = DateUtils.now({ utc: false });
      const systemNow = DateTime.now();

      // Check that the difference is less than 100ms
      expect(Math.abs(localNow.toMillis() - systemNow.toMillis())).toBeLessThan(
        100,
      );
      expect(localNow.zoneName).toBe(systemNow.zoneName);
    });
  });

  describe('createInterval', () => {
    it('should create an interval between two DateTime dates', () => {
      const start = DateTime.fromISO('2023-01-01');
      const end = DateTime.fromISO('2023-12-31');

      const interval = DateUtils.createInterval({
        startDate: start,
        endDate: end,
      });

      expect(interval.start!.toISODate()).toBe('2023-01-01');
      expect(interval.end!.toISODate()).toBe('2023-12-31');
    });

    it('should create an interval between two date strings', () => {
      const interval = DateUtils.createInterval({
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      });

      expect(interval.start!.toISODate()).toBe('2023-01-01');
      expect(interval.end!.toISODate()).toBe('2023-12-31');
    });

    it('should create an interval with a combination of string and DateTime', () => {
      const end = DateTime.fromISO('2023-12-31');

      const interval = DateUtils.createInterval({
        startDate: '2023-01-01',
        endDate: end,
      });

      expect(interval.start!.toISODate()).toBe('2023-01-01');
      expect(interval.end!.toISODate()).toBe('2023-12-31');
    });

    it('should throw for an invalid date string', () => {
      expect(() => {
        DateUtils.createInterval({
          startDate: 'not-a-date',
          endDate: '2023-12-31',
        });
      }).toThrow('Invalid date');
    });

    it('should throw when the end date is before the start date', () => {
      expect(() => {
        DateUtils.createInterval({
          startDate: '2023-12-31',
          endDate: '2023-01-01',
        });
      }).toThrow('Invalid interval');
    });
  });

  describe('addTime', () => {
    it('should add days to a DateTime date', () => {
      const date = DateTime.fromISO('2023-01-01');
      const result = DateUtils.addTime({
        date,
        timeToAdd: { days: 5 } as any,
      });

      expect(result.toISODate()).toBe('2023-01-06');
    });

    it('should add multiple time units to a date string', () => {
      const result = DateUtils.addTime({
        date: '2023-01-01T12:00:00',
        timeToAdd: { days: 1, hours: 6, minutes: 30 } as any,
      });

      expect(result.toISODate()).toBe('2023-01-02');
      expect(result.hour).toBe(18);
      expect(result.minute).toBe(30);
    });

    it('should add a Duration object to a date', () => {
      const date = DateTime.fromISO('2023-01-01');
      const duration = Duration.fromObject({
        weeks: 2,
        years: 0,
        quarters: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });

      const result = DateUtils.addTime({
        date,
        timeToAdd: duration,
      });

      expect(result.toISODate()).toBe('2023-01-15');
    });

    it('should throw when the timeToAdd object contains invalid duration units', () => {
      expect(() => {
        DateUtils.addTime({
          date: '2023-01-01',
          timeToAdd: { days: 1, fortnights: 2 } as any,
        });
      }).toThrow('Invalid duration units: fortnights');
    });

    it('should throw for an invalid date string', () => {
      expect(() => {
        DateUtils.addTime({
          date: 'not-a-date',
          timeToAdd: { days: 1 } as any,
        });
      }).toThrow('Invalid date');
    });

    it('should throw when timeToAdd is null or not an object', () => {
      expect(() => {
        DateUtils.addTime({
          date: '2023-01-01',
          timeToAdd: null as any,
        });
      }).toThrow('Duration must be');
      expect(() => {
        DateUtils.addTime({
          date: '2023-01-01',
          timeToAdd: 5 as any,
        });
      }).toThrow('Duration must be');
    });
  });

  describe('removeTime', () => {
    it('should remove days from a DateTime date', () => {
      const date = DateTime.fromISO('2023-01-10');
      const result = DateUtils.removeTime({
        date,
        timeToRemove: { days: 5 } as any,
      });

      expect(result.toISODate()).toBe('2023-01-05');
    });

    it('should remove multiple time units from a date string', () => {
      const result = DateUtils.removeTime({
        date: '2023-01-10T12:00:00',
        timeToRemove: { days: 1, hours: 6, minutes: 30 } as any,
      });

      expect(result.toISODate()).toBe('2023-01-09');
      expect(result.hour).toBe(5);
      expect(result.minute).toBe(30);
    });

    it('should remove a Duration object from a date', () => {
      const date = DateTime.fromISO('2023-01-15');
      const duration = Duration.fromObject({
        weeks: 2,
        years: 0,
        quarters: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });

      const result = DateUtils.removeTime({
        date,
        timeToRemove: duration,
      });

      expect(result.toISODate()).toBe('2023-01-01');
    });

    it('should throw when the timeToRemove object contains invalid duration units', () => {
      expect(() => {
        DateUtils.removeTime({
          date: '2023-01-01',
          timeToRemove: { days: 1, fortnights: 2 } as any,
        });
      }).toThrow('Invalid duration units: fortnights');
    });

    it('should throw for an invalid date string', () => {
      expect(() => {
        DateUtils.removeTime({
          date: 'not-a-date',
          timeToRemove: { days: 1 } as any,
        });
      }).toThrow('Invalid date');
    });

    it('should throw when timeToRemove is null or not an object', () => {
      expect(() => {
        DateUtils.removeTime({
          date: '2023-01-01',
          timeToRemove: null as any,
        });
      }).toThrow('Duration must be');
    });
  });

  describe('diffBetween', () => {
    it('should calculate the difference in days between two DateTime dates', () => {
      const start = DateTime.fromISO('2023-01-01');
      const end = DateTime.fromISO('2023-01-11');

      const diff = DateUtils.diffBetween({
        startDate: start,
        endDate: end,
        units: ['days'],
      });

      expect(diff.days).toBe(10);
    });

    it('should calculate the difference in multiple units between date strings', () => {
      const diff = DateUtils.diffBetween({
        startDate: '2023-01-01T12:00:00',
        endDate: '2023-01-03T18:30:00',
        units: ['days', 'hours', 'minutes'],
      });

      expect(diff.days).toBe(2);
      expect(diff.hours).toBe(6);
      expect(diff.minutes).toBe(30);
    });

    it('should calculate the difference with dates in different time zones', () => {
      const start = DateTime.fromISO('2023-01-01T00:00:00Z'); // UTC
      const end = DateTime.fromISO('2023-01-01T12:00:00+08:00'); // UTC+8

      const diff = DateUtils.diffBetween({
        startDate: start,
        endDate: end,
        units: ['hours'],
      });

      expect(diff.hours).toBe(4); // 12:00 in UTC+8 is 4 hours after 00:00 UTC
    });

    it('should throw for an invalid date string', () => {
      expect(() => {
        DateUtils.diffBetween({
          startDate: 'not-a-date',
          endDate: '2023-01-11',
          units: ['days'],
        });
      }).toThrow('Invalid date');
    });
  });

  describe('toUTC', () => {
    it('should convert a DateTime date to UTC', () => {
      const date = DateTime.fromISO('2023-01-01T12:00:00+02:00');
      const utcDate = DateUtils.toUTC({ date });

      expect(utcDate.zoneName).toBe('UTC');
      expect(utcDate.hour).toBe(10); // 12:00 +02:00 = 10:00 UTC
    });

    it('should convert a date string to UTC', () => {
      const utcDate = DateUtils.toUTC({
        date: '2023-01-01T12:00:00+02:00',
      });

      expect(utcDate.zoneName).toBe('UTC');
      expect(utcDate.hour).toBe(10); // 12:00 +02:00 = 10:00 UTC
    });

    it('should throw for an invalid date string', () => {
      expect(() => {
        DateUtils.toUTC({ date: 'not-a-date' });
      }).toThrow('Invalid date');
    });
  });

  describe('toTimeZone', () => {
    it('should convert a DateTime date to a specific time zone', () => {
      const date = DateTime.fromISO('2023-01-01T12:00:00Z'); // UTC
      const nyDate = DateUtils.toTimeZone({
        date,
        timeZone: 'America/New_York',
      });

      expect(nyDate.zoneName).toBe('America/New_York');
      // The exact hour depends on daylight saving time, so we only check the zone
      expect(nyDate.offset).not.toBe(0); // Not UTC
    });

    it('should convert a date string to a specific time zone', () => {
      const tokyoDate = DateUtils.toTimeZone({
        date: '2023-01-01T12:00:00Z', // UTC
        timeZone: 'Asia/Tokyo',
      });

      expect(tokyoDate.zoneName).toBe('Asia/Tokyo');
      // Tokyo is +9 hours from UTC, so 12:00 UTC = 21:00 Tokyo
      expect(tokyoDate.hour).toBe(21);
    });

    it('should throw for an invalid timezone', () => {
      expect(() => {
        DateUtils.toTimeZone({
          date: '2023-01-01T12:00:00Z',
          timeZone: 'Not/AZone',
        });
      }).toThrow('Invalid timezone');
    });

    it('should throw for an invalid date string', () => {
      expect(() => {
        DateUtils.toTimeZone({
          date: 'not-a-date',
          timeZone: 'America/New_York',
        });
      }).toThrow('Invalid date');
    });
  });
});
