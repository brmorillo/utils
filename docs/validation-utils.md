# ValidationUtils

The ValidationUtils class provides a collection of utility methods for validating common data formats such as emails, URLs, phone numbers, hex colors, JSON strings, and Brazilian documents (CPF, CNPJ, RG).

## Basic Usage

```javascript
import { ValidationUtils } from '@brmorillo/utils';

// Validate an email address
const validEmail = ValidationUtils.isValidEmail({ email: 'test@example.com' });
console.log(validEmail); // true

// Validate a URL
const validUrl = ValidationUtils.isValidURL({ inputUrl: 'https://example.com' });
console.log(validUrl); // true

// Validate a Brazilian CPF
const validCpf = ValidationUtils.isValidCPF({ cpf: '123.456.789-09' });
console.log(validCpf); // true or false depending on the CPF validity
```

## Methods

### isValidEmail({ email })

Validates if a string is a valid email address.

```javascript
ValidationUtils.isValidEmail({ email: 'test@example.com' }); // true
ValidationUtils.isValidEmail({ email: 'invalid-email' }); // false
```

### isValidURL({ inputUrl })

Validates if a string is a valid URL (only `http:` and `https:` protocols are allowed).

```javascript
ValidationUtils.isValidURL({ inputUrl: 'https://example.com' }); // true
ValidationUtils.isValidURL({ inputUrl: 'invalid-url' }); // false
```

### isValidPhoneNumber({ phoneNumber })

Validates if a string is a valid phone number (generic format, optionally prefixed with `+`).

```javascript
ValidationUtils.isValidPhoneNumber({ phoneNumber: '+1234567890' }); // true
ValidationUtils.isValidPhoneNumber({ phoneNumber: '12345' }); // false
```

### isNumber({ value })

Validates if a value is a number (or a string that can be parsed as a number).

```javascript
ValidationUtils.isNumber({ value: 123 }); // true
ValidationUtils.isNumber({ value: '123' }); // true (can be parsed as a number)
ValidationUtils.isNumber({ value: 'abc' }); // false
```

### isValidHexColor({ hexColor })

Validates if a string is a valid hexadecimal color code (full or shorthand format).

```javascript
ValidationUtils.isValidHexColor({ hexColor: '#FFFFFF' }); // true
ValidationUtils.isValidHexColor({ hexColor: '#F00' }); // true (shorthand format)
ValidationUtils.isValidHexColor({ hexColor: '123456' }); // false (missing #)
```

### hasMinLength({ input, minLength })

Validates if a string has at least the specified minimum length.

```javascript
ValidationUtils.hasMinLength({ input: 'hello', minLength: 3 }); // true
ValidationUtils.hasMinLength({ input: 'hi', minLength: 3 }); // false
```

### hasMaxLength({ input, maxLength })

Validates if a string does not exceed the specified maximum length.

```javascript
ValidationUtils.hasMaxLength({ input: 'hello', maxLength: 10 }); // true
ValidationUtils.hasMaxLength({ input: 'this is too long', maxLength: 5 }); // false
```

### isValidJSON({ jsonString })

Validates if a string is a valid JSON string.

```javascript
ValidationUtils.isValidJSON({ jsonString: '{"key": "value"}' }); // true
ValidationUtils.isValidJSON({ jsonString: '{invalid: json}' }); // false
```

### isValidCPF({ cpf })

Validates if a string is a valid CPF (Brazilian individual taxpayer registry number). Accepts formatted or unformatted input.

```javascript
ValidationUtils.isValidCPF({ cpf: '123.456.789-09' }); // true or false depending on the CPF validity
ValidationUtils.isValidCPF({ cpf: '12345678909' }); // true or false depending on the CPF validity
```

### isValidCNPJ({ cnpj })

Validates if a string is a valid CNPJ (Brazilian company registry number). Accepts formatted or unformatted input.

```javascript
ValidationUtils.isValidCNPJ({ cnpj: '12.345.678/0001-90' }); // true or false depending on the CNPJ validity
ValidationUtils.isValidCNPJ({ cnpj: '12345678000190' }); // true or false depending on the CNPJ validity
```

### isValidRG({ rg, state })

Validates if a string is a valid RG (Brazilian ID document). The `state` parameter is optional and enables state-specific validation (e.g., `'SP'`).

```javascript
ValidationUtils.isValidRG({ rg: '12.345.678-9' }); // true for valid format

ValidationUtils.isValidRG({ rg: '123456789', state: 'SP' }); // true for valid format for São Paulo
```
