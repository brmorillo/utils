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

Generates a unique and secure identifier (CUID2). The `length` parameter is optional; when omitted, the default length is used.

```javascript
CuidUtils.generate(); // "clh0xkfqi0000jz0ght8hjqt8" (default length)
CuidUtils.generate({ length: 10 }); // "ckvlwbkni0"
```

### isValidCuid({ id })

Checks whether a string is a valid CUID2.

```javascript
CuidUtils.isValidCuid({ id: 'ckvlwbkni0001rd3ediyjf3ih' }); // true
CuidUtils.isValidCuid({ id: 'invalid-id' }); // false
```
