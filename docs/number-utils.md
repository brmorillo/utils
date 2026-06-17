# NumberUtils

The NumberUtils class provides a collection of utility methods for working with numbers, including rounding, range generation, validation, and formatting.

## Basic Usage

```javascript
import { NumberUtils } from '@brmorillo/utils';

// Round to a number of decimal places
const rounded = NumberUtils.roundToDecimals({ value: 3.14159, decimals: 2 });
console.log(rounded); // 3.14

// Clamp a value within a range
const clamped = NumberUtils.clamp({ value: 15, min: 0, max: 10 });
console.log(clamped); // 10
```

## Methods

### isValidEven({ value })

Checks if a number is even.

```javascript
NumberUtils.isValidEven({ value: 4 }); // true
NumberUtils.isValidEven({ value: 5 }); // false
```

### isValidOdd({ value })

Checks if a number is odd.

```javascript
NumberUtils.isValidOdd({ value: 3 }); // true
NumberUtils.isValidOdd({ value: 4 }); // false
```

### isPositive({ value })

Checks if a number is positive (greater than zero).

```javascript
NumberUtils.isPositive({ value: 5 });  // true
NumberUtils.isPositive({ value: -5 }); // false
NumberUtils.isPositive({ value: 0 });  // false
```

### normalize({ value })

Normalizes a number by converting negative zero (-0) to positive zero (0).

```javascript
NumberUtils.normalize({ value: -0 }); // 0
NumberUtils.normalize({ value: 5 });  // 5
```

### roundDown({ value })

Rounds a number down to the nearest integer.

```javascript
NumberUtils.roundDown({ value: 4.7 });  // 4
NumberUtils.roundDown({ value: -4.7 }); // -5
```

### roundUp({ value })

Rounds a number up to the nearest integer.

```javascript
NumberUtils.roundUp({ value: 4.2 });  // 5
NumberUtils.roundUp({ value: -4.2 }); // -4
```

### roundToNearest({ value })

Rounds a number to the nearest integer.

```javascript
NumberUtils.roundToNearest({ value: 4.5 }); // 5
NumberUtils.roundToNearest({ value: 4.4 }); // 4
```

### roundToDecimals({ value, decimals })

Rounds a number to the specified number of decimal places. `decimals` defaults to `2`.

```javascript
NumberUtils.roundToDecimals({ value: 3.14159, decimals: 2 }); // 3.14
NumberUtils.roundToDecimals({ value: 3.14159 });              // 3.14 (default 2 decimals)
```

### toCents({ value })

Converts a number to cents by multiplying by 100 and rounding.

```javascript
NumberUtils.toCents({ value: 10.56 }); // 1056
NumberUtils.toCents({ value: 0.99 });  // 99
```

### addDecimalPlaces({ value, decimalPlaces })

Returns a string representation of the number with the specified number of decimal places. Throws if the value is not a number or `decimalPlaces` is negative.

```javascript
NumberUtils.addDecimalPlaces({ value: 10.5, decimalPlaces: 3 }); // "10.500"
NumberUtils.addDecimalPlaces({ value: 10, decimalPlaces: 2 });   // "10.00"
```

### removeDecimalPlaces({ value })

Removes all decimal places from a number (truncates toward zero).

```javascript
NumberUtils.removeDecimalPlaces({ value: 10.56 });  // 10
NumberUtils.removeDecimalPlaces({ value: -10.56 }); // -10
```

### randomIntegerInRange({ min, max })

Generates a random integer within a range (both inclusive). Throws if `min` is greater than `max`.

```javascript
NumberUtils.randomIntegerInRange({ min: 1, max: 10 }); // e.g., 7 (varies)
```

### randomFloatInRange({ min, max, decimals })

Generates a random float within a range (min inclusive, max exclusive). `decimals` defaults to `2`. Throws if `min` is greater than `max`.

```javascript
NumberUtils.randomFloatInRange({ min: 1, max: 10, decimals: 2 }); // e.g., 7.42 (varies)
```

### factorial({ value })

Calculates the factorial of a number. Returns 0 for negative input.

```javascript
NumberUtils.factorial({ value: 5 }); // 120
NumberUtils.factorial({ value: 0 }); // 1
```

### clamp({ value, min, max })

Clamps a number within a specified range.

```javascript
NumberUtils.clamp({ value: 15, min: 0, max: 10 }); // 10
NumberUtils.clamp({ value: -5, min: 0, max: 10 }); // 0
```

### isValidPrime({ value })

Checks if a number is a prime number.

```javascript
NumberUtils.isValidPrime({ value: 7 }); // true
NumberUtils.isValidPrime({ value: 4 }); // false
```

### isOdd({ value })

Checks if a number is odd.

```javascript
NumberUtils.isOdd({ value: 3 }); // true
NumberUtils.isOdd({ value: 4 }); // false
```

## Examples

```javascript
import { NumberUtils } from '@brmorillo/utils';

// Format a price for display and storage
const price = 19.999;

const display = NumberUtils.addDecimalPlaces({ value: price, decimalPlaces: 2 }); // "20.00"
const cents = NumberUtils.toCents({ value: price });                             // 2000
const safe = NumberUtils.clamp({ value: price, min: 0, max: 100 });              // 19.999

console.log('Display:', display);
console.log('Cents:', cents);
console.log('Safe:', safe);
```
