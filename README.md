# @brmorillo/utils

## Project Description

**@brmorillo/utils** is a TypeScript utility library designed to simplify common tasks by providing efficient and reusable implementations. It works seamlessly in both Node.js and browser environments.

---

## Installation and Usage

### Install

To add the library to your project, use:

```bash
npm install @brmorillo/utils
```

or if you use Yarn:

```bash
yarn add @brmorillo/utils
```

or with pnpm:

```bash
pnpm add @brmorillo/utils
```

### Usage

#### Import the specific utilities you need:

```typescript
import { ArrayUtils, MathUtils, StringUtils } from '@brmorillo/utils'

// Example usage
console.log(ArrayUtils.removeDuplicates({ array: [1, 2, 2, 3] })) // [1, 2, 3]
console.log(MathUtils.roundToDecimals({ value: 3.14159, decimals: 2 })) // 3.14
console.log(StringUtils.capitalizeFirstLetter({ input: 'hello' })) // "Hello"
```

#### Or import the entire library:

```typescript
import Utils from '@brmorillo/utils'

console.log(Utils.ArrayUtils.removeDuplicates({ array: [1, 2, 3, 3] })) // [1, 2, 3]
console.log(Utils.MathUtils.randomInRange({ min: 5, max: 10 })) // Random value
```

---

## Project Features

### Array Utility Functions

1. **`removeDuplicates`**: Removes duplicate values from an array.
2. **`intersect`**: Finds the intersection of two arrays.
3. **`flatten`**: Flattens a multi-dimensional array into a single-dimensional array.
4. **`groupBy`**: Groups elements of an array based on a grouping function.
5. **`shuffle`**: Shuffles the elements of an array randomly.

### Conversion Utility Functions

1. **`convertSpace`**: Converts values between different units of space.
2. **`convertWeight`**: Converts values between different units of weight.
3. **`convertVolume`**: Converts values between different units of volume.
4. **`convertValue`**: Converts values between `string`, `number`, and `bigint`.

### Cryptography Utility Functions

1. **`encrypt`**: Encrypts a string value using bcrypt.
2. **`compare`**: Compares a string value with an encrypted hash.
3. **`generateRandomString`**: Generates a random string using bcrypt.

### Date Utility Functions

1. **`now`**: Returns the current date and time.
2. **`createInterval`**: Creates an interval between two dates.
3. **`addTime`**: Adds a specific duration to a date.
4. **`removeTime`**: Subtracts a specific duration from a date.
5. **`diffBetween`**: Calculates the difference between two dates.
6. **`toUTC`**: Converts a date to UTC.
7. **`toTimeZone`**: Converts a date to a specified timezone.

### Math Utility Functions

1. **`roundToDecimals`**: Rounds a number to the specified number of decimal places.
2. **`calculatePercentage`**: Calculates the percentage of a value.
3. **`gcd`**: Finds the greatest common divisor of two numbers.
4. **`lcm`**: Finds the least common multiple of two numbers.
5. **`randomInRange`**: Generates a random number within a range.
6. **`clamp`**: Clamps a number within a range.

### Number Utility Functions

1. **`isEven`**: Checks if a number is even.
2. **`isOdd`**: Checks if a number is odd.
3. **`roundDown`**: Rounds a number down to the nearest integer.
4. **`roundUp`**: Rounds a number up to the nearest integer.
5. **`roundToNearest`**: Rounds a number to the nearest integer.
6. **`toCents`**: Converts a number to cents.
7. **`addDecimalPlaces`**: Adds decimal places to a number.
8. **`removeDecimalPlaces`**: Removes decimal places from a number.
9. **`randomIntegerInRange`**: Generates a random integer within a range.
10. **`factorial`**: Calculates the factorial of a number.
11. **`clamp`**: Clamps a number within a range.
12. **`isPrime`**: Checks if a number is a prime.

### Request Utility Functions

1. **`extractRequestData`**: Extracts relevant data from an HTTP request object.

### String Utility Functions

1. **`capitalizeFirstLetter`**: Capitalizes the first letter of a string.
2. **`reverseString`**: Reverses a string.
3. **`isPalindrome`**: Checks if a string is a palindrome.
4. **`truncateString`**: Truncates a string to a specified length.
5. **`toKebabCase`**: Converts a string to kebab-case.
6. **`toSnakeCase`**: Converts a string to snake_case.
7. **`countOccurrences`**: Counts the occurrences of a substring.

### Validation Utility Functions

1. **`isValidEmail`**: Validates if a string is a valid email address.
2. **`isValidURL`**: Validates if a string is a valid URL.
3. **`isValidPhoneNumber`**: Validates if a string is a valid phone number.
4. **`isNumber`**: Checks if a value is a number.
5. **`isValidHexColor`**: Validates if a string is a hexadecimal color.
6. **`hasMinLength`**: Checks if a string has a minimum length.
7. **`isValidJSON`**: Validates if a string is a JSON.

---

## Contributing

### How to Publish

If you want to contribute and publish updates to this library:

1. **Bump the version:**
   Use the following command to update the version according to [SemVer](https://semver.org/):

   ```bash
   npm version patch   # For small fixes
   npm version minor   # For new features
   npm version major   # For breaking changes
   ```

2. **Publish the package:**
   ```bash
   npm publish
   ```

Feel free to fork, contribute, and submit pull requests! Any contributions are welcome.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
