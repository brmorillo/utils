# ConvertUtils

The ConvertUtils class provides a collection of utility methods for converting values between measurement units (space, weight, volume) and between primitive types (string, integer, number, bigint, roman).

## Basic Usage

```javascript
import { ConvertUtils } from '@brmorillo/utils';

// Convert 1000 meters to kilometers
const km = ConvertUtils.space({ value: 1000, fromType: 'meters', toType: 'kilometers' });
console.log(km); // 1

// Convert 1 kilogram to pounds
const pounds = ConvertUtils.weight({ value: 1, fromType: 'kilograms', toType: 'pounds' });
console.log(pounds); // 2.20462

// Convert a string to a number
const number = ConvertUtils.value({ value: '42', toType: 'number' });
console.log(number); // 42
```

## Methods

### space({ value, fromType, toType })

Converts a value from one space (length) measurement to another, using meters as the base unit. Available units: `meters`, `miles`, `kilometers`, `centimeters`, `millimeters`, `inches`, `feet`, `yards`.

```javascript
ConvertUtils.space({ value: 1000, fromType: 'meters', toType: 'kilometers' }); // 1
ConvertUtils.space({ value: 1, fromType: 'miles', toType: 'meters' }); // ~1609.34
```

### weight({ value, fromType, toType })

Converts a value from one weight measurement to another, using kilograms as the base unit. Available units: `kilograms`, `pounds`, `ounces`, `grams`.

```javascript
ConvertUtils.weight({ value: 1, fromType: 'kilograms', toType: 'pounds' }); // 2.20462
ConvertUtils.weight({ value: 500, fromType: 'grams', toType: 'kilograms' }); // 0.5
```

### volume({ value, fromType, toType })

Converts a value from one volume measurement to another, using liters as the base unit. Available units: `liters`, `gallons`, `milliliters`, `cubicMeters`.

```javascript
ConvertUtils.volume({ value: 1, fromType: 'liters', toType: 'gallons' }); // 0.264172
ConvertUtils.volume({ value: 1000, fromType: 'milliliters', toType: 'liters' }); // 1
```

### value({ value, toType })

Converts a value between types by inferring the type of the input. The `value` parameter is typed as `unknown` and the method returns `string | number | bigint | null`. Supported target types: `'string'`, `'integer'`, `'number'`, `'bigint'`, `'roman'`.

Error model:

- Returns `null` when the input cannot be converted to the requested type (e.g. a non-numeric string to `'number'`/`'integer'`/`'bigint'`, or a source type with no conversion branch for the target).
- Returns `null` when `value` is `null`/`undefined` and `toType` is `'string'`.
- Converting a `number` to `'integer'` truncates toward zero (e.g. `42.9 -> 42`, `-42.9 -> -42`).
- Converting to `'roman'` throws a `ValidationError` (from `'../errors'`) when the value is not a positive integer, or is outside the classic Roman numeral range of `1`–`3999` inclusive.

```javascript
ConvertUtils.value({ value: '42', toType: 'number' }); // 42
ConvertUtils.value({ value: 42, toType: 'string' }); // "42"
ConvertUtils.value({ value: 42.9, toType: 'integer' }); // 42
ConvertUtils.value({ value: null, toType: 'string' }); // null
ConvertUtils.value({ value: '42', toType: 'bigint' }); // 42n
ConvertUtils.value({ value: 42, toType: 'roman' }); // "XLII"
ConvertUtils.value({ value: 3999, toType: 'roman' }); // "MMMCMXCIX"
ConvertUtils.value({ value: 4000, toType: 'roman' }); // throws ValidationError
```
