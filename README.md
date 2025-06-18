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

## Configuration

The library can be configured with different options:

```javascript
import { Utils } from '@brmorillo/utils';

// Initialize with default configuration
const utils = Utils.getInstance();

// Or initialize with custom configuration
const utils = Utils.getInstance({
  logger: {
    type: 'pino', // 'pino', 'winston', or 'console'
    level: 'info', // 'error', 'warn', 'info', or 'debug'
    prettyPrint: true, // Format logs for better readability
  },
});

// Get the logger instance
const logger = utils.getLogger();
logger.info('Application started');

// Reconfigure later if needed
utils.configure({
  logger: {
    type: 'winston',
    level: 'debug',
  },
});
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

### BenchmarkUtils

- **measureExecutionTime** - Measures the execution time of a function
- **benchmark** - Runs a benchmark with multiple iterations
- **compare** - Compares the performance of multiple functions
- **progressiveBenchmark** - Runs benchmarks with increasing workload sizes
- **measureMemoryUsage** - Measures memory usage during function execution

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

### JWTUtils

- **generate** - Generates a JWT token
- **verify** - Verifies a JWT token
- **decode** - Decodes a JWT token without verification
- **refresh** - Refreshes a JWT token
- **isExpired** - Checks if a JWT token is expired
- **getExpirationTime** - Gets the remaining time until a JWT token expires

### LogService

- **info** - Logs an info message
- **warn** - Logs a warning message
- **error** - Logs an error message
- **debug** - Logs a debug message
- **configure** - Reconfigures the logger

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

### QueueUtils

- **createQueue** - Creates a FIFO queue
- **createStack** - Creates a LIFO stack
- **createMultiQueue** - Creates a multi-channel queue
- **createCircularBuffer** - Creates a fixed-size circular buffer
- **createPriorityQueue** - Creates a priority queue
- **createDelayQueue** - Creates a queue with delayed processing

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
- **isValidPalindrome** - Checks if a string is a palindrome
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

## Documentation

For detailed examples and usage instructions, see the [examples.md](./docs/examples.md) file.
