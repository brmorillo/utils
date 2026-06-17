# CuidUtils

The CuidUtils class provides utility methods for generating and validating secure, collision-resistant identifiers (CUID2).

## Basic Usage

```javascript
import { CuidUtils } from '@brmorillo/utils';

// Generate a CUID2 with the default length
const id = CuidUtils.generate();
console.log(id); // "clh0xkfqi0000jz0ght8hjqt8"

// Generate a CUID2 with a custom length
const shortId = CuidUtils.generate({ length: 10 });
console.log(shortId); // "ckvlwbkni0"

// Validate a CUID2
const valid = CuidUtils.isValidCuid({ id });
console.log(valid); // true
```

## Methods

### generate({ length })

Generates a unique and secure identifier (CUID2). The `length` parameter is optional; when omitted, the default length of **24** is used. When provided, `length` must be an integer in the range **[2, 32]**; otherwise a `ValidationError` is thrown.

```javascript
CuidUtils.generate(); // "clh0xkfqi0000jz0ght8hjqt8" (default length)
CuidUtils.generate({ length: 10 }); // "ckvlwbkni0"
```

### isValidCuid({ id })

Checks whether a string is a valid CUID2. This only validates the **format** (a lowercase alphanumeric string with a length between 2 and 32 characters). It does **not** verify cryptographic origin, so any string matching that shape is reported as valid even if it was not produced by `generate`.

```javascript
CuidUtils.isValidCuid({ id: 'ckvlwbkni0001rd3ediyjf3ih' }); // true
CuidUtils.isValidCuid({ id: 'invalid-id' }); // false
```
