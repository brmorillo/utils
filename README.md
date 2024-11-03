
# @brunormorillo/js-util-library

A utility library for date manipulation with TypeScript, using the powerful [Luxon](https://moment.github.io/luxon/) library.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Available Functions](#available-functions)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install the library using `pnpm`:

```bash
pnpm add @brunormorillo/js-util-library
```

Or, with `npm`:

```bash
npm install @brunormorillo/js-util-library
```

## Usage

Import the utility functions into your project:

```typescript
import { dateNow, createInterval, addTime, removeTime, diffBetweenDates, toUTC, toUserTimeZone } from '@brunormorillo/js-util-library';
```

## Available Functions

Below are the main functions offered by this library:

### `dateNow`

Returns the current date and time, in UTC or the system's time zone.

```typescript
function dateNow(utc: boolean = false): DateTime;
```

- **Parameter**: `utc` (optional) - Defines if the date should be in UTC (default: `false`).
- **Return**: `DateTime` of the current date.

### `createInterval`

Creates an interval between two dates.

```typescript
function createInterval(startDate: DateTime | string, endDate: DateTime | string): Interval;
```

- **Parameters**:
  - `startDate`: Start date (DateTime or ISO string).
  - `endDate`: End date (DateTime or ISO string).
- **Return**: An `Interval` between the dates.

### `addTime`

Adds a specific amount of time to a date.

```typescript
function addTime(date: DateTime | string, timeToAdd: Duration | object): DateTime;
```

- **Parameters**:
  - `date`: Starting date (DateTime or ISO string).
  - `timeToAdd`: Object representing the time to add (e.g., `{ days: 1, hours: 5 }`).
- **Return**: `DateTime` with the added time.

### `removeTime`

Removes a specific amount of time from a date.

```typescript
function removeTime(date: DateTime | string, timeToRemove: Duration | object): DateTime;
```

- **Parameters**:
  - `date`: Starting date (DateTime or ISO string).
  - `timeToRemove`: Object representing the time to remove (e.g., `{ weeks: 2 }`).
- **Return**: `DateTime` with the subtracted time.

### `diffBetweenDates`

Calculates the difference between two dates in specific units.

```typescript
function diffBetweenDates(startDate: DateTime | string, endDate: DateTime | string, units: (keyof DurationLikeObject)[]): Duration;
```

- **Parameters**:
  - `startDate`: Start date (DateTime or string).
  - `endDate`: End date (DateTime or string).
  - `units`: Time units for the calculation (e.g., 'days', 'hours').
- **Return**: `Duration` with the units and calculated difference.

### `toUTC`

Converts a date to UTC.

```typescript
function toUTC(date: DateTime | string): DateTime;
```

- **Parameter**: `date` - Date to convert (DateTime or string).
- **Return**: `DateTime` in UTC.

### `toUserTimeZone`

Converts a date to the specified time zone.

```typescript
function toUserTimeZone(date: DateTime | string, timeZone: string): DateTime;
```

- **Parameters**:
  - `date`: Date to convert (DateTime or string).
  - `timeZone`: Time zone string (e.g., 'America/New_York').
- **Return**: `DateTime` in the user's time zone.

## Examples

Here are some examples of how to use the functions in this library:

```typescript
import { dateNow, createInterval, addTime, removeTime } from '@brunormorillo/js-util-library';

// Getting the current date
const currentDate = dateNow();

// Creating an interval between two dates
const interval = createInterval('2023-01-01', '2023-12-31');

// Adding and removing time
const futureDate = addTime(currentDate, { days: 10 });
const pastDate = removeTime(currentDate, { weeks: 1 });
```

## Contributing

Contributions are welcome! To contribute, please fork this repository and submit a pull request with your improvements.

## License

This project is licensed under the MIT License.
