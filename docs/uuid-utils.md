# UUIDUtils

The UUIDUtils class provides utility methods for generating and validating UUIDs (versions 1, 4, and 5).

## Basic Usage

```javascript
import { UUIDUtils } from '@brmorillo/utils';

// Generate a random UUID (version 4)
const id = UUIDUtils.uuidV4Generate();
console.log(id); // "3d6f0eb0-5e26-4b2c-a073-84d55dff3d51"

// Generate a deterministic UUID (version 5) from a name
const v5 = UUIDUtils.uuidV5Generate({ name: 'example' });
console.log(v5); // Same name always produces the same UUID

// Validate a UUID
const valid = UUIDUtils.isValidUuid({ id });
console.log(valid); // true
```

## Methods

### uuidV1Generate()

Generates a UUID (version 1), based on timestamp and node information.

```javascript
const id = UUIDUtils.uuidV1Generate();
// "f47ac10b-58cc-4372-a567-0e02b2c3d479"
```

### uuidV4Generate()

Generates a random UUID (version 4).

```javascript
const id = UUIDUtils.uuidV4Generate();
// "3d6f0eb0-5e26-4b2c-a073-84d55dff3d51"
```

### uuidV5Generate({ namespace, name })

Generates a deterministic UUID (version 5) by hashing a `name` within a `namespace`. The same `namespace` and `name` always produce the same UUID.

The `namespace` parameter is optional. When omitted, it defaults to the standard URL namespace (`uuid.URL`, which is `6ba7b811-9dad-11d1-80b4-00c04fd430c8`). This means calling the method with only a `name` is still fully deterministic: the same name always yields the same UUID.

```javascript
// Deterministic with an explicit namespace
const a = UUIDUtils.uuidV5Generate({
  namespace: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  name: 'example',
});

// Deterministic using the default URL namespace
const b = UUIDUtils.uuidV5Generate({ name: 'example' });
const c = UUIDUtils.uuidV5Generate({ name: 'example' });
console.log(b === c); // true (same name -> same UUID)
```

### isValidUuid({ id })

Checks whether a string is a valid UUID.

```javascript
UUIDUtils.isValidUuid({ id: '3d6f0eb0-5e26-4b2c-a073-84d55dff3d51' }); // true
UUIDUtils.isValidUuid({ id: 'invalid-uuid' }); // false
```
