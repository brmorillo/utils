# @brmorillo/utils

Utility library for JavaScript/TypeScript projects.

## Installation

```bash
npm install @brmorillo/utils
```

or

```bash
yarn add @brmorillo/utils
```

or

```bash
pnpm add @brmorillo/utils
```

## Usage

### ESM Import

```javascript
// Import specific utilities
import { StringUtils, ArrayUtils } from '@brmorillo/utils';

// Import all utilities
import { Utils } from '@brmorillo/utils';
```

### CommonJS Import

```javascript
// Import specific utilities
const { StringUtils, ArrayUtils } = require('@brmorillo/utils');

// Import all utilities
const { Utils } = require('@brmorillo/utils');
```

## Available Utilities

The library contains the following utility classes:

### ArrayUtils
- **removeDuplicates** - Removes duplicate values from an array
- **intersect** - Finds the intersection between two arrays
- **flatten** - Flattens a multi-dimensional array
- **groupBy** - Groups array elements by a key
- **shuffle** - Randomly shuffles array elements
- **sort** - Sorts an array with specific criteria
- **findSubset** - Finds objects that match a subset
- **isSubset** - Checks if an object contains a subset

### ConvertUtils
- **toBoolean** - Converts a value to boolean
- **toNumber** - Converts a value to number
- **toString** - Converts a value to string
- **toDate** - Converts a value to date
- **toArray** - Converts a value to array
- **toObject** - Converts a value to object
- **toJSON** - Converts a value to JSON
- **fromJSON** - Converts JSON to an object

### CryptUtils
- **generateIV** - Generates an initialization vector for AES
- **aesEncrypt** - Encrypts data using AES-256-CBC
- **aesDecrypt** - Decrypts data using AES-256-CBC
- **rsaGenerateKeyPair** - Generates an RSA key pair
- **rsaEncrypt** - Encrypts data using RSA
- **rsaDecrypt** - Decrypts data using RSA
- **rsaSign** - Signs data using RSA
- **rsaVerify** - Verifies RSA signatures
- **eccGenerateKeyPair** - Generates an ECC key pair
- **eccSign** - Signs data using ECC
- **eccVerify** - Verifies ECC signatures
- **chacha20Encrypt** - Encrypts data using ChaCha20
- **chacha20Decrypt** - Decrypts data using ChaCha20
- **rc4Encrypt** - Encrypts data using RC4
- **rc4Decrypt** - Decrypts data using RC4

### CuidUtils
- **generate** - Generates a unique CUID2 identifier
- **isValid** - Checks if a string is a valid CUID2

### DateUtils
- **now** - Gets the current date and time
- **createInterval** - Creates an interval between two dates
- **addTime** - Adds a duration to a date
- **removeTime** - Removes a duration from a date
- **diffBetween** - Calculates the difference between two dates
- **toUTC** - Converts a date to UTC
- **toTimeZone** - Converts a date to a specific timezone

### HashUtils
- **bcryptHash** - Encrypts a string using bcrypt
- **bcryptCompare** - Compares a string with a bcrypt hash
- **bcryptRandomString** - Generates a random string using bcrypt
- **sha256Hash** - Generates a SHA-256 hash of a string
- **sha256HashJson** - Generates a SHA-256 hash of a JSON object
- **sha256GenerateToken** - Generates a random token using SHA-256
- **sha512Hash** - Generates a SHA-512 hash of a string
- **sha512HashJson** - Generates a SHA-512 hash of a JSON object
- **sha512GenerateToken** - Generates a random token using SHA-512

### MathUtils
- **round** - Rounds a number to a specific number of decimal places
- **floor** - Rounds a number down
- **ceil** - Rounds a number up
- **random** - Generates a random number within a range
- **sum** - Sums the values of an array
- **average** - Calculates the average of array values
- **median** - Calculates the median of array values
- **mode** - Calculates the mode of array values
- **standardDeviation** - Calculates the standard deviation of array values

### NumberUtils
- **formatCurrency** - Formats a number as currency
- **formatPercentage** - Formats a number as percentage
- **formatDecimal** - Formats a number with specific decimal places
- **parseNumber** - Converts a string to number
- **isInteger** - Checks if a number is an integer
- **isFloat** - Checks if a number is a float
- **isPositive** - Checks if a number is positive
- **isNegative** - Checks if a number is negative
- **isZero** - Checks if a number is zero
- **clamp** - Limits a number to a specific range

### ObjectUtils
- **deepMerge** - Deeply merges objects
- **deepClone** - Deeply clones an object
- **flatten** - Flattens a nested object
- **unflatten** - Unflattens an object
- **pick** - Selects specific properties from an object
- **omit** - Omits specific properties from an object
- **isEmpty** - Checks if an object is empty
- **isEqual** - Checks if two objects are equal
- **hasCircularReference** - Checks if an object has circular references
- **removeUndefined** - Removes undefined properties from an object
- **removeNull** - Removes null properties from an object
- **removeEmptyStrings** - Removes properties with empty strings
- **removeEmptyArrays** - Removes properties with empty arrays
- **removeEmptyObjects** - Removes properties with empty objects

### RequestUtils
- **parseQueryString** - Converts a query string to an object
- **buildQueryString** - Converts an object to a query string
- **parseUrl** - Parses a URL into its component parts
- **buildUrl** - Builds a URL from its parts
- **isValidUrl** - Checks if a URL is valid

### SnowflakeUtils
- **generate** - Generates a Snowflake ID
- **decode** - Decodes a Snowflake ID into its components
- **getTimestamp** - Extracts the timestamp from a Snowflake ID
- **isValidSnowflake** - Checks if a string is a valid Snowflake ID
- **compare** - Compares two Snowflake IDs
- **fromTimestamp** - Creates a Snowflake ID from a timestamp
- **convert** - Converts a Snowflake ID to a different format

### SortUtils
- **quickSort** - Implementation of the QuickSort algorithm
- **mergeSort** - Implementation of the MergeSort algorithm
- **bubbleSort** - Implementation of the BubbleSort algorithm
- **insertionSort** - Implementation of the InsertionSort algorithm
- **selectionSort** - Implementation of the SelectionSort algorithm
- **heapSort** - Implementation of the HeapSort algorithm
- **countingSort** - Implementation of the CountingSort algorithm
- **radixSort** - Implementation of the RadixSort algorithm
- **bucketSort** - Implementation of the BucketSort algorithm
- **shellSort** - Implementation of the ShellSort algorithm
- **timSort** - Implementation of the TimSort algorithm
- **sortByProperty** - Sorts an array of objects by a property

### StringUtils
- **capitalizeFirstLetter** - Capitalizes the first letter of a string
- **reverse** - Reverses a string
- **isPalindrome** - Checks if a string is a palindrome
- **truncate** - Truncates a string and adds ellipsis
- **toKebabCase** - Converts a string to kebab-case
- **toSnakeCase** - Converts a string to snake_case
- **toCamelCase** - Converts a string to camelCase
- **toTitleCase** - Converts a string to Title Case
- **countOccurrences** - Counts occurrences of a substring
- **replaceAll** - Replaces all occurrences of a substring
- **replaceOccurrences** - Replaces a specific number of occurrences
- **replacePlaceholders** - Replaces placeholders in a string

### UUIDUtils
- **generate** - Generates a v4 UUID
- **isValid** - Checks if a string is a valid UUID
- **parse** - Converts a UUID to a specific format
- **getNil** - Returns the nil UUID (00000000-0000-0000-0000-000000000000)

### ValidationUtils
- **isEmail** - Checks if a string is a valid email
- **isURL** - Checks if a string is a valid URL
- **isPhoneNumber** - Checks if a string is a valid phone number
- **isCPF** - Checks if a string is a valid CPF (Brazilian ID)
- **isCNPJ** - Checks if a string is a valid CNPJ (Brazilian company ID)
- **isCreditCard** - Checks if a string is a valid credit card number
- **isStrongPassword** - Checks if a password is strong
- **isDate** - Checks if a string is a valid date
- **isNumeric** - Checks if a string contains only numbers
- **isAlpha** - Checks if a string contains only letters
- **isAlphanumeric** - Checks if a string contains only letters and numbers

## Detailed Documentation

### ArrayUtils

Utilities for array manipulation.

#### removeDuplicates

Removes duplicate values from an array.

```javascript
// Remove duplicates from primitive values
const uniqueArray = ArrayUtils.removeDuplicates({
  array: [1, 2, 2, 3, 4, 4],
});
// Result: [1, 2, 3, 4]

// Remove duplicates from objects based on a property
const uniqueObjects = ArrayUtils.removeDuplicates({
  array: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 1, name: 'John' },
  ],
  keyFn: item => item.id,
});
// Result: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
```

#### intersect

Finds the intersection between two arrays.

```javascript
const intersection = ArrayUtils.intersect({
  array1: [1, 2, 3, 4],
  array2: [3, 4, 5, 6],
});
// Result: [3, 4]
```

#### flatten

Flattens a multi-dimensional array into a single-dimensional array.

```javascript
const flattened = ArrayUtils.flatten({
  array: [1, [2, [3, 4]], 5],
});
// Result: [1, 2, 3, 4, 5]
```

#### groupBy

Groups elements of an array based on a grouping function.

```javascript
const grouped = ArrayUtils.groupBy({
  array: [
    { type: 'fruit', name: 'apple' },
    { type: 'vegetable', name: 'carrot' },
    { type: 'fruit', name: 'banana' },
  ],
  keyFn: item => item.type,
});
// Result: {
//   fruit: [
//     { type: 'fruit', name: 'apple' },
//     { type: 'fruit', name: 'banana' }
//   ],
//   vegetable: [
//     { type: 'vegetable', name: 'carrot' }
//   ]
// }
```

#### shuffle

Randomly shuffles the elements of an array.

```javascript
const shuffled = ArrayUtils.shuffle({
  array: [1, 2, 3, 4, 5],
});
// Result: [3, 1, 5, 2, 4] (random order)
```

#### sort

Sorts an array based on specific criteria.

```javascript
// Sort primitive values
const sortedAsc = ArrayUtils.sort({
  array: [3, 1, 4, 2],
  orderBy: 'asc',
});
// Result: [1, 2, 3, 4]

// Sort objects by property
const sortedObjects = ArrayUtils.sort({
  array: [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
  ],
  orderBy: { age: 'asc' },
});
// Result: [{ name: 'Jane', age: 25 }, { name: 'John', age: 30 }]
```

#### findSubset

Finds the first object in an array where the subset matches the superset.

```javascript
const found = ArrayUtils.findSubset({
  array: [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
  ],
  subset: { name: 'John' },
});
// Result: { id: 1, name: 'John', age: 30 }
```

#### isSubset

Checks if a subset is fully contained within a superset.

```javascript
const isContained = ArrayUtils.isSubset({
  superset: { id: 1, name: 'John', age: 30 },
  subset: { name: 'John', age: 30 },
});
// Result: true
```

### StringUtils

Utilities for string manipulation.

#### capitalizeFirstLetter

Capitalizes the first letter of a string.

```javascript
const capitalized = StringUtils.capitalizeFirstLetter({
  input: 'hello',
});
// Result: "Hello"
```

#### reverse

Reverses a string.

```javascript
const reversed = StringUtils.reverse({
  input: 'hello',
});
// Result: "olleh"
```

#### isPalindrome

Checks if a string is a palindrome.

```javascript
const isPalindrome1 = StringUtils.isPalindrome({
  input: 'racecar',
});
// Result: true

const isPalindrome2 = StringUtils.isPalindrome({
  input: 'hello',
});
// Result: false
```

#### truncate

Truncates a string to a specified length and adds an ellipsis if necessary.

```javascript
const truncated = StringUtils.truncate({
  input: 'This is a long string',
  maxLength: 10,
});
// Result: "This is a..."
```

#### toKebabCase

Converts a string to kebab-case.

```javascript
const kebabCase = StringUtils.toKebabCase({
  input: 'Hello World',
});
// Result: "hello-world"
```

#### toSnakeCase

Converts a string to snake_case.

```javascript
const snakeCase = StringUtils.toSnakeCase({
  input: 'Hello World',
});
// Result: "hello_world"
```

#### toCamelCase

Converts a string to camelCase.

```javascript
const camelCase = StringUtils.toCamelCase({
  input: 'Hello World',
});
// Result: "helloWorld"
```

#### toTitleCase

Converts a string to Title Case.

```javascript
const titleCase = StringUtils.toTitleCase({
  input: 'hello world',
});
// Result: "Hello World"
```

#### countOccurrences

Counts the occurrences of a substring in a string.

```javascript
const count = StringUtils.countOccurrences({
  input: 'hello world hello',
  substring: 'hello',
});
// Result: 2
```

#### replaceAll

Replaces all occurrences of a substring in a string.

```javascript
const replaced = StringUtils.replaceAll({
  input: 'hello world hello',
  substring: 'hello',
  replacement: 'hi',
});
// Result: "hi world hi"
```

#### replaceOccurrences

Replaces the first `x` occurrences of a substring in a string.

```javascript
const replacedFirst = StringUtils.replaceOccurrences({
  input: 'hello world hello',
  substring: 'hello',
  replacement: 'hi',
  occurrences: 1,
});
// Result: "hi world hello"
```

#### replacePlaceholders

Replaces placeholders in a string with corresponding values from a replacement map.

```javascript
const withPlaceholders = StringUtils.replacePlaceholders({
  template: 'Hello, {name}! You have {count} new messages.',
  replacements: { name: 'John', count: '5' },
});
// Result: "Hello, John! You have 5 new messages."
```

### CryptUtils

Utilities for cryptography and security.

#### aesEncrypt

Encrypts a string or JSON object using AES-256-CBC.

```javascript
const { encryptedData, iv } = CryptUtils.aesEncrypt(
  'Secret text',
  'secret-key-of-32-characters-12345678',
);
// Result: { encryptedData: "base64-encoded-string", iv: "hex-string" }
```

#### aesDecrypt

Decrypts data encrypted with AES-256-CBC.

```javascript
const decrypted = CryptUtils.aesDecrypt(
  encryptedData,
  'secret-key-of-32-characters-12345678',
  iv,
);
// Result: "Secret text"
```

#### rsaGenerateKeyPair

Generates an RSA key pair.

```javascript
const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(2048);
// Result: { publicKey: "-----BEGIN RSA PUBLIC KEY-----...", privateKey: "-----BEGIN RSA PRIVATE KEY-----..." }
```

#### rsaEncrypt / rsaDecrypt

Encrypts and decrypts data using RSA.

```javascript
const encrypted = CryptUtils.rsaEncrypt('Sensitive data', publicKey);
const decrypted = CryptUtils.rsaDecrypt(encrypted, privateKey);
// decrypted: "Sensitive data"
```

#### rsaSign / rsaVerify

Signs and verifies data using RSA.

```javascript
const signature = CryptUtils.rsaSign('Authentic message', privateKey);
const isValid = CryptUtils.rsaVerify(
  'Authentic message',
  signature,
  publicKey,
);
// isValid: true
```

#### eccGenerateKeyPair

Generates an ECC (Elliptic Curve Cryptography) key pair.

```javascript
const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();
// Result: { publicKey: "-----BEGIN PUBLIC KEY-----...", privateKey: "-----BEGIN PRIVATE KEY-----..." }
```

### CuidUtils

Utilities for generating unique identifiers using CUID2.

#### generate

Generates a unique and secure identifier (CUID2).

```javascript
// Generate CUID2 with default length
const id = CuidUtils.generate();
// Result: "clh0xkfqi0000jz0ght8hjqt8"

// Generate CUID2 with custom length
const shortId = CuidUtils.generate({ length: 10 });
// Result: "ckvlwbkni0"
```

#### isValid

Checks if a string is a valid CUID2.

```javascript
const isValid = CuidUtils.isValid({ id: 'clh0xkfqi0000jz0ght8hjqt8' });
// Result: true
```

### DateUtils

Utilities for date manipulation using Luxon.

#### now

Gets the current date and time, either in UTC or the system's timezone.

```javascript
// Current date and time in local timezone
const localNow = DateUtils.now();

// Current date and time in UTC
const utcNow = DateUtils.now({ utc: true });
```

#### createInterval

Creates an interval between two dates.

```javascript
const interval = DateUtils.createInterval({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
});
// Result: Interval between January 1 and December 31, 2024
```

#### addTime

Adds a specific duration to a date.

```javascript
const nextWeek = DateUtils.addTime({
  date: '2024-01-01',
  timeToAdd: { days: 7 },
});
// Result: January 8, 2024
```

#### removeTime

Removes a specific duration from a date.

```javascript
const lastWeek = DateUtils.removeTime({
  date: '2024-01-15',
  timeToRemove: { days: 7 },
});
// Result: January 8, 2024
```

#### diffBetween

Calculates the difference between two dates in specific units.

```javascript
const diff = DateUtils.diffBetween({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  units: ['days'],
});
// Result: Duration representing 366 days (2024 is a leap year)
```

#### toUTC / toTimeZone

Converts a date to UTC or to a specific timezone.

```javascript
const utcDate = DateUtils.toUTC({
  date: '2024-01-01T12:00:00+03:00',
});
// Result: 2024-01-01T09:00:00.000Z

const nyDate = DateUtils.toTimeZone({
  date: '2024-01-01T12:00:00Z',
  timeZone: 'America/New_York',
});
// Result: 2024-01-01T07:00:00.000-05:00
```

### HashUtils

Utilities for hash functions and cryptography.

#### bcryptHash / bcryptCompare

Encrypts and compares passwords using bcrypt.

```javascript
// Encrypt password
const hash = HashUtils.bcryptHash({
  value: 'password123',
  saltRounds: 10,
});

// Verify password
const isValid = HashUtils.bcryptCompare({
  value: 'password123',
  encryptedValue: hash,
});
// isValid: true
```

#### sha256Hash / sha512Hash

Generates SHA-256 and SHA-512 hashes.

```javascript
// SHA-256 hash
const hash256 = HashUtils.sha256Hash('important data');

// SHA-512 hash
const hash512 = HashUtils.sha512Hash('important data');
```

#### sha256HashJson / sha512HashJson

Generates hashes of JSON objects.

```javascript
const jsonHash = HashUtils.sha256HashJson({ id: 1, name: 'John' });
```

#### sha256GenerateToken / sha512GenerateToken

Generates random tokens using SHA-256 or SHA-512.

```javascript
// 32-character token (default)
const token = HashUtils.sha256GenerateToken();

// Custom length token
const shortToken = HashUtils.sha256GenerateToken(16);
```

### SnowflakeUtils

Utilities for generating and manipulating Snowflake IDs.

#### generate

Generates a Snowflake ID using a custom epoch.

```javascript
// Generate ID with default parameters
const id = SnowflakeUtils.generate();

// Generate ID with custom parameters
const customId = SnowflakeUtils.generate({
  epoch: new Date('2023-01-01T00:00:00.000Z'),
  workerId: 1n,
  processId: 2n,
});
```

#### decode

Decodes a Snowflake ID into its components.

```javascript
const components = SnowflakeUtils.decode({
  snowflakeId: '1322717493961297921',
});
// Result: { timestamp: 1234567890n, workerId: 1n, processId: 0n, increment: 42n }
```

#### getTimestamp

Extracts the timestamp from a Snowflake ID.

```javascript
const timestamp = SnowflakeUtils.getTimestamp({
  snowflakeId: '1322717493961297921',
});
// Result: Date object representing when the Snowflake was created
```

#### isValidSnowflake

Checks if a string is a valid Snowflake ID.

```javascript
const isValid = SnowflakeUtils.isValidSnowflake({
  snowflakeId: '1322717493961297921',
});
// Result: true
```

#### compare

Compares two Snowflake IDs to determine which one is newer.

```javascript
const result = SnowflakeUtils.compare({
  first: '1322717493961297921',
  second: '1322717493961297920',
});
// Result: 1 (first is newer)
```

#### fromTimestamp

Creates a Snowflake ID from a timestamp.

```javascript
const id = SnowflakeUtils.fromTimestamp({
  timestamp: new Date('2023-06-15T12:30:45.000Z'),
});
```

#### convert

Converts a Snowflake ID to a different format.

```javascript
// Convert to string
const stringId = SnowflakeUtils.convert({
  snowflakeId: 1322717493961297921n,
  toFormat: 'string',
});
// Result: "1322717493961297921"

// Convert to bigint
const bigintId = SnowflakeUtils.convert({
  snowflakeId: '1322717493961297921',
  toFormat: 'bigint',
});
// Result: 1322717493961297921n
```

### NumberUtils

Utilities for number manipulation.

```javascript
// Format number as currency
const currency = NumberUtils.formatCurrency({
  value: 1234.56,
  locale: 'en-US',
  currency: 'USD',
});
// Result: "$1,234.56"

// Round to a specific number of decimal places
const rounded = NumberUtils.round({
  value: 3.14159,
  decimals: 2,
});
// Result: 3.14
```

### ObjectUtils

Utilities for object manipulation.

```javascript
// Deeply merge objects
const merged = ObjectUtils.deepMerge({
  target: { a: 1, b: { c: 2 } },
  source: { b: { d: 3 }, e: 4 },
});
// Result: { a: 1, b: { c: 2, d: 3 }, e: 4 }

// Flatten a nested object
const flattened = ObjectUtils.flatten({
  obj: { a: 1, b: { c: 2, d: { e: 3 } } },
});
// Result: { 'a': 1, 'b.c': 2, 'b.d.e': 3 }
```

### UUIDUtils

Utilities for generating and validating UUIDs.

```javascript
// Generate v4 UUID
const uuid = UUIDUtils.generate();
// Result: "123e4567-e89b-12d3-a456-426614174000"

// Check if a string is a valid UUID
const isValid = UUIDUtils.isValid({
  uuid: '123e4567-e89b-12d3-a456-426614174000',
});
// Result: true
```

### ValidationUtils

Utilities for data validation.

```javascript
// Check if a value is a valid email
const isValidEmail = ValidationUtils.isEmail({ value: 'user@example.com' });
// Result: true

// Check if a value is a valid phone number
const isValidPhone = ValidationUtils.isPhoneNumber({ value: '+15551234567' });
// Result: true
```

## Test Structure

The tests are organized in a hybrid structure that combines organization by test type with organization by functionality:

```
tests/
├── unit/                  # Unit tests
│   ├── array.service.spec.ts
│   ├── string.service.spec.ts
│   └── ...
├── integration/           # Integration tests
│   ├── array.service.int-spec.ts
│   ├── string.service.int-spec.ts
│   └── ...
└── benchmark/             # Benchmark/performance tests
    ├── array.service.bench.ts
    ├── string.service.bench.ts
    └── ...
```

### Test Types

- **Unit Tests**: Test individual units of code in isolation
- **Integration Tests**: Test the interaction between different parts of the code
- **Benchmark Tests**: Measure and ensure code performance

### Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only benchmark tests
npm run test:benchmark
```

## Development

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

## License

MIT