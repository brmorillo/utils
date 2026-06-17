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

Converts a value between types by inferring the type of the input. Supported target types: `'string'`, `'integer'`, `'number'`, `'bigint'`, `'roman'`. Returns the converted value, or `null` if conversion is not possible. Converting to `'roman'` throws if the value is not a positive integer.

```javascript
ConvertUtils.value({ value: '42', toType: 'number' }); // 42
ConvertUtils.value({ value: 42, toType: 'string' }); // "42"
ConvertUtils.value({ value: '42', toType: 'bigint' }); // 42n
ConvertUtils.value({ value: 42, toType: 'roman' }); // "XLII"
```
