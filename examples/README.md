# @brmorillo/utils Examples

This directory contains runnable examples demonstrating how to use the `@brmorillo/utils` library.

All examples are written in English. The `.js` examples can be run directly with Node.js, and the `.ts` examples can be run with a TypeScript runner such as `ts-node` or `tsx`.

## Basic Examples

Simple examples showing how to use individual utilities:

- [Array Utils](./basic/array-utils.js) - Removing duplicates, intersecting, grouping and sorting arrays.
- [String Utils](./basic/string-utils.js) - Capitalizing, case conversion (camel/kebab/snake), truncating, counting and replacing.
- [Object Utils](./basic/object-utils.js) - Deep cloning, deep merging, picking/omitting keys, flattening and path lookup.
- [Number Utils](./basic/number-utils.js) - Rounding to decimals, clamping, random integers, prime checks and converting to cents.

## Advanced Examples

More complex examples showing how to combine multiple utilities and patterns:

- [Caching Example](./advanced/caching-example.js) - Using caching mechanisms to memoize expensive work.
- [Data Processing Pipeline](./advanced/data-processing-pipeline.js) - A complete data processing pipeline built from multiple utilities.
- [Lazy Loading Example](./advanced/lazy-loading-example.js) - Deferring expensive computations until they are needed.

## Feature Examples

End-to-end examples for the library's higher-level features (TypeScript):

- [Benchmark Example](./benchmark-example.ts) - Measuring and comparing performance of operations.
- [HTTP Example](./http-example.ts) - Using the HTTP client utilities.
- [Logger Example](./logger-example.ts) - Structured logging.
- [Redis Queue Example](./redis-queue-example.ts) - Working with a Redis-backed queue.
- [Storage Example](./storage-example.ts) - Using the storage abstraction.

## Framework Integrations

Examples showing how to integrate with popular frameworks:

- [NestJS Integration](./integrations/nestjs-integration.ts) - Integration with NestJS.

## Running the Examples

### Node.js (`.js`) Examples

```bash
# Install the library in your project
npm install @brmorillo/utils

# Run a basic example
node examples/basic/array-utils.js
node examples/basic/string-utils.js
node examples/basic/object-utils.js
node examples/basic/number-utils.js

# Run an advanced example
node examples/advanced/data-processing-pipeline.js
```

### TypeScript (`.ts`) Examples

```bash
# Using tsx
npx tsx examples/logger-example.ts

# Or using ts-node
npx ts-node examples/http-example.ts
```

### Framework Examples

The framework examples are meant to be integrated into existing projects. See the comments at the top of each file for specific instructions.

## Creating Your Own Examples

Feel free to modify these examples or create your own to explore the capabilities of the library. If you create a useful example, consider contributing it back to the project!
