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
import { ArrayUtils, MathUtils, StringUtils } from '@brmorillo/utils';

// Example usage
console.log(ArrayUtils.removeDuplicates({ array: [1, 2, 2, 3] })); // [1, 2, 3]
console.log(MathUtils.roundToDecimals({ value: 3.14159, decimals: 2 })); // 3.14
console.log(StringUtils.capitalizeFirstLetter({ input: 'hello' })); // "Hello"
```

#### Or import the entire library:

```typescript
import Utils from '@brmorillo/utils';

console.log(Utils.ArrayUtils.removeDuplicates({ array: [1, 2, 3, 3] })); // [1, 2, 3]
console.log(Utils.MathUtils.randomInRange({ min: 5, max: 10 })); // Random value between 5 and 10
```

---

## Project Features

### Array Utility Functions

1. **`removeDuplicates`**: Removes duplicate values from an array.
2. **`intersect`**: Finds the intersection of two arrays.
3. **`flatten`**: Flattens a multi-dimensional array into a single-dimensional array.
4. **`groupBy`**: Groups elements of an array based on a grouping function.
5. **`shuffle`**: Shuffles the elements of an array randomly.
6. **`findSubset`**: Finds the first object in an array where the subset matches the superset.
7. **`isSubset`**: Checks if a subset object is fully contained within a superset object.

### Conversion Utility Functions

1. **`convertSpace`**: Converts values between different units of space.
2. **`convertWeight`**: Converts values between different units of weight.
3. **`convertVolume`**: Converts values between different units of volume.
4. **`convertValue`**: Converts values between `string`, `number`, and `bigint`.

### Cryptography Utility Functions

1. **`aesEncrypt`**: Encrypts data using AES-256-CBC.
2. **`aesDecrypt`**: Decrypts data encrypted with AES-256-CBC.
3. **`chacha20Encrypt`**: Encrypts data using ChaCha20.
4. **`chacha20Decrypt`**: Decrypts data encrypted with ChaCha20.
5. **`rsaGenerateKeyPair`**: Generates an RSA key pair.
6. **`rsaEncrypt`**: Encrypts data using an RSA public key.
7. **`rsaDecrypt`**: Decrypts data encrypted with an RSA public key using the private key.
8. **`rsaSign`**: Signs data using an RSA private key.
9. **`rsaVerify`**: Verifies a signature using an RSA public key.
10. **`eddsaGenerateKeyPair`**: Generates an EdDSA key pair (using Ed25519).
11. **`eddsaSign`**: Signs data using an EdDSA private key.
12. **`eddsaVerify`**: Verifies an EdDSA signature using a public key.
13. **`blowfishEncrypt`**: Encrypts data using Blowfish.
14. **`blowfishDecrypt`**: Decrypts data encrypted with Blowfish.
15. **`tripleDESEncrypt`**: Encrypts data using Triple DES.
16. **`tripleDESDecrypt`**: Decrypts data encrypted with Triple DES.
17. **`twofishEncrypt`**: Encrypts data using Twofish.
18. **`twofishDecrypt`**: Decrypts data encrypted with Twofish.
19. **`serpentEncrypt`**: Encrypts data using Serpent.
20. **`serpentDecrypt`**: Decrypts data encrypted with Serpent.

### Date Utility Functions

1. **`now`**: Returns the current date and time.
2. **`createInterval`**: Creates an interval between two dates.
3. **`addTime`**: Adds a specific duration to a date.
4. **`removeTime`**: Subtracts a specific duration from a date.
5. **`diffBetween`**: Calculates the difference between two dates.
6. **`toUTC`**: Converts a date to UTC.
7. **`toTimeZone`**: Converts a date to a specified timezone.

### Hash Utility Functions

1. **`bcryptHash`**: Encrypts a string value using bcrypt.
2. **`bcryptCompare`**: Compares a string value with an encrypted value.
3. **`bcryptRandomString`**: Generates a random string using bcrypt.
4. **`sha256Hash`**: Hashes a string value using SHA-256.
5. **`sha256HashJson`**: Hashes a JSON object using SHA-256.
6. **`sha256GenerateToken`**: Generates a random token using SHA-256.
7. **`sha512Hash`**: Hashes a string value using SHA-512.
8. **`sha512HashJson`**: Hashes a JSON object using SHA-512.
9. **`sha512GenerateToken`**: Generates a random token using SHA-512.

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

### Object Utility Functions

1. **`findValue`**: Finds a value in an object by a specified key or path.
2. **`deepClone`**: Creates a deep clone of an object.
3. **`deepMerge`**: Deeply merges two objects.
4. **`pick`**: Picks specific keys from an object.
5. **`omit`**: Omits specific keys from an object.
6. **`flattenObject`**: Flattens a nested object into a single level.
7. **`invert`**: Inverts the keys and values of an object.
8. **`deepFreeze`**: Deeply freezes an object, making it immutable.
9. **`compare`**: Deeply compares two objects for equality.
10. **`groupBy`**: Groups the keys of an object based on a callback function.
11. **`diff`**: Finds the difference between two objects.
12. **`unflattenObject`**: Sets a value in a nested object by a dot-separated path.
13. **`compressObject`**: Compresses a JSON object by converting it to a minified string.
14. **`decompressObject`**: Decompresses a JSON string back into an object.
15. **`compressObjectToBase64`**: Compresses and encodes a JSON object to a Base64 string.
16. **`decompressBase64ToObject`**: Decompresses a Base64-encoded JSON string back to a JSON object.

### Request Utility Functions

1. **`extractRequestData`**: Extracts relevant data from an HTTP request object.

### Snowflake Utility Functions

1. **`generate`**: Generates a Snowflake ID using a custom epoch.
2. **`decode`**: Deconstructs a Snowflake ID into its components.
3. **`getTimestamp`**: Extracts the timestamp from a Snowflake ID.

### Sorting Algorithms Utility Functions

1. **`bubbleSort`**: Implements Bubble Sort with a time complexity of O(n²) in the worst case.
2. **`mergeSort`**: Implements Merge Sort with a time complexity of O(n log n).
3. **`quickSort`**: Implements Quick Sort with a time complexity of O(n log n) on average.
4. **`heapSort`**: Implements Heap Sort with a time complexity of O(n log n).
5. **`selectionSort`**: Implements Selection Sort with a time complexity of O(n²).
6. **`insertionSort`**: Implements Insertion Sort, efficient for small or nearly sorted datasets.
7. **`shellSort`**: Implements Shell Sort with an average time complexity of O(n log² n).
8. **`countingSort`**: Implements Counting Sort, effective for integers with limited range.
9. **`radixSort`**: Implements Radix Sort for non-negative integers, processing digits or characters.
10. **`bucketSort`**: Implements Bucket Sort, dividing the array into buckets and sorting each.
11. **`timSort`**: Combines Merge Sort and Insertion Sort, used in Python and Java.
12. **`bogoSort`**: Implements Bogo Sort, an inefficient and impractical sorting algorithm.
13. **`gnomeSort`**: Implements Gnome Sort, a variation of Insertion Sort with O(n²) complexity.
14. **`pancakeSort`**: Implements Pancake Sort, flipping subarrays to sort.
15. **`combSort`**: An improved version of Bubble Sort using larger initial gaps.
16. **`cocktailShakerSort`**: A bi-directional Bubble Sort that eliminates turtles.
17. **`bitonicSort`**: Optimized for parallel systems, with O(n log² n) complexity.
18. **`stoogeSort`**: An academic curiosity with O(n².7095) complexity.

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

## Contribution Guidelines

### How to Contribute

1. **Branch naming**: Use descriptive names like `feat/feature-name` or `fix/bug-name`.
2. **Pull Requests**: Ensure proper tests are included and reviewed before merging.
3. **Commit Messages**: Follow the convention:
   - `feat: Added a new feature`
   - `fix: Resolved an issue`
   - `docs: Updated documentation`
   - `chore: Performed maintenance tasks`

### Publish Process

1. **Update version**:
   ```bash
   npm version [patch|minor|major]
   ```
2. **Publish package**:
   ```bash
   npm run pub
   ```

---

## Support

If you find this library helpful, consider supporting its development:

- **Pix**: `bruno@rmorillo.com`

- **Cryptocurrencies**:

  - **Dogecoin (DOGE):** `DLwW5LFfXV7wN7a7dVV6TX7kiomVnYABXM`
  - **Tether (USDT):** `0x2b1f5169e3719E0A25850a178db54d8D1C0c12E0`
  - **Bitcoin (BTC):** `bc1qk5cakfryrx8dw3w6uqudwkpm9apvd6h5mgl8kg`
  - **Ethereum (ETH):** `0x2b1f5169e3719E0A25850a178db54d8D1C0c12E0`

Feel free to contribute or share feedback!

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
