# @brmorillo/js-util-library

## Project Description

**@brmorillo/js-util-library** is a JavaScript utility library designed to simplify common tasks by providing straightforward and efficient implementations for developers. It is designed to work seamlessly in both Node.js and browser environments, ensuring flexibility and usability.

---

## How to Publish and Update on npm

### Publish for the First Time

1. **Configure npm:**
   Make sure you are logged in to npm:
   ```bash
   npm login
   ```

2. **Check `package.json`:**
   Ensure the `name` field is set to `@brmorillo/js-util-library` and the `version` field is correct.

3. **Publish the package:**
   ```bash
   npm publish --access public
   ```

### Update an Existing Version

1. **Bump the version:**
   Use the following command to update the version according to [SemVer](https://semver.org/):
   ```bash
   npm version patch   # For small fixes
   npm version minor   # For new features
   npm version major   # For breaking changes
   ```

2. **Publish again:**
   ```bash
   npm publish
   ```

---

## Project Features

### Date Utility Functions

1. **`dateNow`**: Returns the current date and time, either in UTC or the system's timezone.
2. **`dateCreateInterval`**: Creates an interval between two dates.
3. **`dateAddTime`**: Adds a specific duration to a date.
4. **`dateRemoveTime`**: Subtracts a specific duration from a date.
5. **`dateDiffBetween`**: Calculates the difference between two dates in specified units.
6. **`dateToUTC`**: Converts a date to UTC.
7. **`dateToTimeZone`**: Converts a date to a specified timezone.

### Cryptography Utility Functions

1. **`cryptEncrypt`**: Encrypts a string value using bcrypt.
2. **`cryptCompareValues`**: Compares a string value with an encrypted value.
3. **`cryptGenerateRandomString`**: Generates a random string using bcrypt.

### Array Utility Functions

1. **`removeDuplicates`**: Removes duplicate values from an array.
2. **`intersectArrays`**: Finds the intersection of two arrays.
3. **`flattenArray`**: Flattens a multi-dimensional array into a single-dimensional array.
4. **`groupBy`**: Groups elements of an array based on a grouping function.
5. **`shuffleArray`**: Shuffles the elements of an array randomly.

### String Utility Functions

1. **`capitalizeFirstLetter`**: Capitalizes the first letter of a string.
2. **`reverseString`**: Reverses a string.
3. **`isPalindrome`**: Checks if a string is a palindrome.
4. **`truncateString`**: Truncates a string to a specified length and adds an ellipsis if necessary.
5. **`toKebabCase`**: Converts a string to kebab-case.
6. **`toSnakeCase`**: Converts a string to snake_case.
7. **`countOccurrences`**: Counts the occurrences of a substring in a string.

### Validation Utility Functions

1. **`isValidEmail`**: Validates if a string is a valid email address.
2. **`isValidURL`**: Validates if a string is a valid URL.
3. **`isValidPhoneNumber`**: Validates if a string is a valid phone number (generic format).
4. **`isNumber`**: Validates if a value is a number.
5. **`isValidHexColor`**: Validates if a string is a valid hexadecimal color code.
6. **`hasMinLength`**: Validates if a string has a minimum length.
7. **`isValidJSON`**: Validates if a string is a valid JSON string.

### Number Utility Functions

1. **`isEven`**: Checks if a number is even.
2. **`isOdd`**: Checks if a number is odd.
3. **`roundDown`**: Rounds a number down to the nearest integer.
4. **`roundUp`**: Rounds a number up to the nearest integer.
5. **`roundToNearest`**: Rounds a number to the nearest integer.
6. **`toCents`**: Converts a number to cents (removes decimal places).
7. **`addDecimalPlaces`**: Adds decimal places to a number.
8. **`removeDecimalPlaces`**: Removes all decimal places from a number.
9. **`randomIntegerInRange`**: Generates a random integer within a specified range.
10. **`factorial`**: Calculates the factorial of a number.
11. **`clamp`**: Clamps a number within a specified range.
12. **`isPrime`**: Checks if a number is a prime number.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
