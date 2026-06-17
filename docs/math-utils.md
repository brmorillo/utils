# MathUtils

The MathUtils class provides a collection of utility methods for common mathematical operations, including rounding, percentages, GCD/LCM, clamping, and prime checks.

## Basic Usage

```javascript
import { MathUtils } from '@brmorillo/utils';

// Calculate a percentage
const pct = MathUtils.percentage({ total: 200, part: 50 });
console.log(pct); // 25

// Find the greatest common divisor
const divisor = MathUtils.gcd({ a: 24, b: 36 });
console.log(divisor); // 12
```

## Methods

### roundToDecimals({ value, decimals })

Rounds a number to the specified number of decimal places. `decimals` defaults to `2`.

```javascript
MathUtils.roundToDecimals({ value: 3.14159, decimals: 2 }); // 3.14
```

### percentage({ total, part })

Calculates the percentage of `part` relative to `total`. Throws if `total` is zero.

```javascript
MathUtils.percentage({ total: 200, part: 50 }); // 25
```

### randomInRange({ min, max })

Generates a random number within a range. Throws if `min` is greater than `max`.

```javascript
MathUtils.randomInRange({ min: 1, max: 10 }); // e.g., 5.432 (varies)
```

### gcd({ a, b })

Finds the greatest common divisor (GCD) of two numbers.

```javascript
MathUtils.gcd({ a: 24, b: 36 }); // 12
```

### lcm({ a, b })

Finds the least common multiple (LCM) of two numbers.

```javascript
MathUtils.lcm({ a: 4, b: 6 }); // 12
```

### clamp({ value, min, max })

Clamps a number within a specified range.

```javascript
MathUtils.clamp({ value: 10, min: 0, max: 5 }); // 5
```

### isValidPrime({ value })

Checks if a number is prime. This is the canonical primality check for the
library; `NumberUtils` does not expose a duplicate.

```javascript
MathUtils.isValidPrime({ value: 7 }); // true
MathUtils.isValidPrime({ value: 4 }); // false
```

## Examples

```javascript
import { MathUtils } from '@brmorillo/utils';

// Reduce a fraction using GCD
const numerator = 24;
const denominator = 36;
const divisor = MathUtils.gcd({ a: numerator, b: denominator });

const reduced = {
  numerator: numerator / divisor,
  denominator: denominator / divisor
};

const ratio = MathUtils.percentage({ total: denominator, part: numerator });

console.log('Reduced:', reduced);                                   // { numerator: 2, denominator: 3 }
console.log('Ratio:', MathUtils.roundToDecimals({ value: ratio })); // 66.67
```
