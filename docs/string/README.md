# StringUtils

The StringUtils class provides a collection of utility methods for working with strings, including casing conversions, truncation, palindrome checks, and placeholder replacement.

## Basic Usage

```javascript
import { StringUtils } from '@brmorillo/utils';

// Capitalize the first letter
const capitalized = StringUtils.capitalizeFirstLetter({ input: 'hello' });
console.log(capitalized); // "Hello"

// Convert to kebab-case
const kebab = StringUtils.toKebabCase({ input: 'Hello World' });
console.log(kebab); // "hello-world"
```

## Methods

### capitalizeFirstLetter({ input })

Capitalizes the first letter of a string. Only the first character is upper-cased; the rest of the string is left untouched. Throws a `ValidationError` if `input` is not a string.

```javascript
StringUtils.capitalizeFirstLetter({ input: 'hello' });  // "Hello"
StringUtils.capitalizeFirstLetter({ input: 'iPhone' }); // "IPhone"
```

### reverse({ input })

Reverses a string.

```javascript
StringUtils.reverse({ input: 'hello' }); // "olleh"
```

### isPalindrome({ input })

Checks if a string is a palindrome (ignoring non-alphanumeric characters and case).

```javascript
StringUtils.isPalindrome({ input: 'racecar' }); // true
StringUtils.isPalindrome({ input: 'hello' });   // false
```

### truncate({ input, maxLength })

Truncates a string to a maximum length, adding an ellipsis if necessary.

```javascript
StringUtils.truncate({ input: 'This is a long string', maxLength: 10 }); // "This is..."
```

### toKebabCase({ input })

Converts a string to kebab-case.

```javascript
StringUtils.toKebabCase({ input: 'Hello World' });      // "hello-world"
StringUtils.toKebabCase({ input: 'camelCaseString' });  // "camel-case-string"
```

### toSnakeCase({ input })

Converts a string to snake_case.

```javascript
StringUtils.toSnakeCase({ input: 'Hello World' });      // "hello_world"
StringUtils.toSnakeCase({ input: 'camelCaseString' });  // "camel_case_string"
```

### toCamelCase({ input })

Converts a string to camelCase.

```javascript
StringUtils.toCamelCase({ input: 'Hello World' });        // "helloWorld"
StringUtils.toCamelCase({ input: 'snake_case_string' });  // "snakeCaseString"
```

### toTitleCase({ input })

Converts a string to Title Case.

```javascript
StringUtils.toTitleCase({ input: 'hello world' }); // "Hello World"
```

### countOccurrences({ input, substring })

Counts the occurrences of a substring in a string.

```javascript
StringUtils.countOccurrences({ input: 'hello world hello', substring: 'hello' }); // 2
StringUtils.countOccurrences({ input: 'abc abc abc', substring: 'abc' });         // 3
```

### replaceAll({ input, substring, replacement })

Replaces all occurrences of a substring in a string.

```javascript
StringUtils.replaceAll({
  input: 'hello world hello',
  substring: 'hello',
  replacement: 'hi'
}); // "hi world hi"
```

### replaceOccurrences({ input, substring, replacement, occurrences })

Replaces the first `occurrences` occurrences of a substring in a string.

```javascript
StringUtils.replaceOccurrences({
  input: 'hello world hello',
  substring: 'hello',
  replacement: 'hi',
  occurrences: 1
}); // "hi world hello"
```

### replacePlaceholders({ template, replacements })

Replaces `{key}` placeholders in a template string with values from the replacements map. Unknown placeholders are left untouched.

```javascript
StringUtils.replacePlaceholders({
  template: 'Hello, {name}! You have {count} new messages.',
  replacements: { name: 'John', count: '5' }
}); // "Hello, John! You have 5 new messages."
```

## Examples

```javascript
import { StringUtils } from '@brmorillo/utils';

const title = 'the quick brown fox';

console.log(StringUtils.toTitleCase({ input: title }));  // "The Quick Brown Fox"
console.log(StringUtils.toKebabCase({ input: title }));  // "the-quick-brown-fox"
console.log(StringUtils.toCamelCase({ input: title }));  // "theQuickBrownFox"
console.log(StringUtils.truncate({ input: title, maxLength: 12 })); // "the quick..."
```
