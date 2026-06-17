# DateUtils

The DateUtils class provides a collection of utility methods for working with dates and times, built on top of [Luxon](https://moment.github.io/luxon/). Methods return Luxon objects such as `DateTime`, `Duration`, and `Interval`.

## Basic Usage

```javascript
import { DateUtils } from '@brmorillo/utils';

// Get the current UTC date and time
const now = DateUtils.now();
console.log(now.toISO()); // Current UTC DateTime as ISO string

// Add 5 days to a date
const future = DateUtils.addTime({ date: '2024-01-01', timeToAdd: { days: 5 } });
console.log(future.toISODate()); // 2024-01-06

// Calculate the difference between two dates in days
const diff = DateUtils.diffBetween({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  units: ['days'],
});
console.log(diff.days); // 365
```

## Methods

### now({ utc })

Gets the current date and time as a Luxon `DateTime`. Defaults to UTC; pass `{ utc: false }` for the local timezone.

```javascript
DateUtils.now(); // Current UTC DateTime (default)
DateUtils.now({ utc: false }); // Current DateTime in local timezone
```

### createInterval({ startDate, endDate })

Creates a Luxon `Interval` between two dates. Each date may be a `DateTime` or an ISO string.

```javascript
DateUtils.createInterval({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
}); // Interval between Jan 1 and Dec 31, 2024
```

### addTime({ date, timeToAdd })

Adds a duration to a date and returns the resulting `DateTime`. The duration can be a Luxon `Duration` or a plain object (e.g. `{ days: 1, hours: 5 }`). Throws if invalid duration units are provided.

```javascript
DateUtils.addTime({
  date: '2024-01-01',
  timeToAdd: { days: 5 },
}); // January 6, 2024 (DateTime)
```

### removeTime({ date, timeToRemove })

Subtracts a duration from a date and returns the resulting `DateTime`. The duration can be a Luxon `Duration` or a plain object (e.g. `{ weeks: 2 }`). Throws if invalid duration units are provided.

```javascript
DateUtils.removeTime({
  date: '2024-01-01',
  timeToRemove: { days: 5 },
}); // December 27, 2023 (DateTime)
```

### diffBetween({ startDate, endDate, units })

Calculates the difference between two dates as a Luxon `Duration`, expressed in the specified units (e.g. `['days']`, `['hours']`).

```javascript
DateUtils.diffBetween({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  units: ['days'],
}); // Duration representing 365 days
```

### toUTC({ date })

Converts a date to UTC and returns the resulting `DateTime`. The date may be a `DateTime` or an ISO string.

```javascript
DateUtils.toUTC({
  date: '2024-01-01T12:00:00+03:00',
}); // 2024-01-01T09:00:00.000Z (DateTime)
```

### toTimeZone({ date, timeZone })

Converts a date to the specified timezone and returns the resulting `DateTime`. The date may be a `DateTime` or an ISO string.

```javascript
DateUtils.toTimeZone({
  date: '2024-01-01T12:00:00Z',
  timeZone: 'America/New_York',
}); // 2024-01-01T07:00:00.000-05:00 (DateTime)
```
