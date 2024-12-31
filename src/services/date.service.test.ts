import { DateTime, Interval } from 'luxon';
import { DateUtils } from './date.service';

describe('DateUtils', () => {
  describe('now', () => {
    it('should return the current date and time in system timezone by default', () => {
      const now = DateUtils.now();
      expect(now).toBeInstanceOf(DateTime);
      expect(now.isValid).toBe(true);
    });

    it('should return the current date and time in UTC when specified', () => {
      const nowUTC = DateUtils.now({ utc: true });
      expect(nowUTC).toBeInstanceOf(DateTime);
      expect(nowUTC.isValid).toBe(true);
      expect(nowUTC.offset).toBe(0); // UTC offset is 0
    });
  });

  describe('createInterval', () => {
    it('should create an interval between two ISO date strings', () => {
      const interval = DateUtils.createInterval({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      });
      expect(interval).toBeInstanceOf(Interval);
      expect(interval.isValid).toBe(true);
    });

    it('should create an interval between two DateTime objects', () => {
      const start = DateTime.now();
      const end = start.plus({ days: 10 });
      const interval = DateUtils.createInterval({
        startDate: start,
        endDate: end,
      });
      expect(interval).toBeInstanceOf(Interval);
      expect(interval.isValid).toBe(true);
    });
  });

  describe('addTime', () => {
    it('should add a specific duration to a date', () => {
      const date = DateTime.fromISO('2024-01-01');
      const result = DateUtils.addTime({ date, timeToAdd: { days: 5 } });
      expect(result.toISODate()).toBe('2024-01-06');
    });
  });

  describe('removeTime', () => {
    it('should subtract a specific duration from a date', () => {
      const date = DateTime.fromISO('2024-01-10');
      const result = DateUtils.removeTime({ date, timeToRemove: { days: 5 } });
      expect(result.toISODate()).toBe('2024-01-05');
    });
  });

  describe('diffBetween', () => {
    it('should calculate the difference between two dates in specific units', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-10';
      const diff = DateUtils.diffBetween({
        startDate,
        endDate,
        units: ['days'],
      });
      expect(diff.days).toBe(9);
    });
  });

  describe('toUTC', () => {
    it('should convert a date to UTC', () => {
      const date = '2024-01-01T12:00:00+03:00';
      const result = DateUtils.toUTC({ date });
      expect(result.toISO()).toBe('2024-01-01T09:00:00.000Z');
    });
  });

  describe('toTimeZone', () => {
    it('should convert a date to a specified timezone', () => {
      const date = '2024-01-01T12:00:00Z';
      const timeZone = 'America/New_York';
      const result = DateUtils.toTimeZone({ date, timeZone });
      expect(result.zoneName).toBe(timeZone);
    });
  });
});
