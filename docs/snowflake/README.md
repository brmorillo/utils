# SnowflakeUtils

The SnowflakeUtils class provides utility methods for generating, decoding, comparing, and converting Snowflake IDs using the `@sapphire/snowflake` library. The default epoch is `2025-01-01T00:00:00.000Z`.

## Basic Usage

```javascript
import { SnowflakeUtils } from '@brmorillo/utils';

// Generate a Snowflake ID
const id = SnowflakeUtils.generate();
console.log(id.toString());

// Decode a Snowflake ID into its components
const components = SnowflakeUtils.decode({ snowflakeId: id });
console.log(components); // { timestamp, workerId, processId, increment }

// Validate a Snowflake ID
const valid = SnowflakeUtils.isValidSnowflake({ snowflakeId: '1322717493961297921' });
console.log(valid); // true
```

## Methods

### generate({ epoch, workerId, processId })

Generates a Snowflake ID. All parameters are optional: `epoch` defaults to `2025-01-01T00:00:00.000Z`, `workerId` defaults to `0n`, and `processId` defaults to `0n`. Throws a `ValidationError` if the epoch is not a valid `Date`.

A persistent `Snowflake` instance is maintained per epoch, so its internal increment counter advances across calls. This guarantees that two `generate` calls in the same millisecond return distinct IDs instead of colliding.

> Note: Snowflake IDs are epoch-relative. The same `epoch` you generate with must be supplied to `decode`/`getTimestamp` to recover the correct timestamp.

```javascript
// Default parameters
const id = SnowflakeUtils.generate();

// Custom parameters
const customId = SnowflakeUtils.generate({
  epoch: new Date('2023-01-01T00:00:00.000Z'),
  workerId: 1n,
  processId: 2n,
});
```

### decode({ snowflakeId, epoch })

Deconstructs a Snowflake ID into its components (`timestamp`, `workerId`, `processId`, `increment`, `epoch`). The `epoch` parameter is optional and defaults to the default epoch. Throws a `ValidationError` if the Snowflake ID or epoch is invalid.

The ID must be an all-digit value (`/^\d+$/`). Inputs such as `'1e3'`, `'10.5'`, or `'Infinity'` throw a `ValidationError`.

> Important: pass the same `epoch` used at generation; decoding with a different epoch yields an incorrect timestamp.

```javascript
const components = SnowflakeUtils.decode({
  snowflakeId: '1322717493961297921',
});
console.log(components);
// { timestamp: 1234567890n, workerId: 1n, processId: 0n, increment: 42n, epoch: 1735689600000n }
```

### getTimestamp({ snowflakeId, epoch })

Extracts the creation timestamp from a Snowflake ID as a `Date` object. The `epoch` parameter is optional and defaults to the default epoch. You must pass the same `epoch` used at generation, otherwise the recovered timestamp will be wrong.

```javascript
const timestamp = SnowflakeUtils.getTimestamp({
  snowflakeId: '1322717493961297921',
});
console.log(timestamp); // Date object
```

### isValidSnowflake({ snowflakeId })

Validates whether a string is a valid Snowflake ID (a numeric string convertible to BigInt).

```javascript
SnowflakeUtils.isValidSnowflake({ snowflakeId: '1322717493961297921' }); // true
SnowflakeUtils.isValidSnowflake({ snowflakeId: 'not-a-number' }); // false
```

### compare({ first, second })

Compares two Snowflake IDs to determine which is newer. Returns `1` if `first` is newer, `-1` if `second` is newer, and `0` if they are equal.

```javascript
const result = SnowflakeUtils.compare({
  first: '1322717493961297921',
  second: '1322717493961297920',
});
console.log(result); // 1 (first is newer)
```

### fromTimestamp({ timestamp, epoch })

Creates a Snowflake ID from a given timestamp. The `epoch` parameter is optional and defaults to the default epoch. Throws if the timestamp or epoch is invalid.

```javascript
const id = SnowflakeUtils.fromTimestamp({
  timestamp: new Date('2023-06-15T12:30:45.000Z'),
});
console.log(id.toString());
```

### convert({ snowflakeId, toFormat })

Converts a Snowflake ID to a different format. `toFormat` must be one of `'bigint'`, `'string'`, or `'number'`. Throws a `ValidationError` if the ID is invalid, the format is unsupported, or the value is too large to be safely represented as a number.

> Warning: the `'number'` format is unusable for real Snowflake IDs. A typical Snowflake exceeds `Number.MAX_SAFE_INTEGER`, so converting it to a JavaScript `number` would lose precision; the method throws instead of returning a corrupted value. `'number'` is kept only for small/synthetic IDs. Prefer `'bigint'` or `'string'`.

```javascript
// Convert to string
const stringId = SnowflakeUtils.convert({
  snowflakeId: 1322717493961297921n,
  toFormat: 'string',
});
console.log(stringId); // "1322717493961297921"

// Convert to bigint
const bigintId = SnowflakeUtils.convert({
  snowflakeId: '1322717493961297921',
  toFormat: 'bigint',
});
console.log(bigintId); // 1322717493961297921n
```
