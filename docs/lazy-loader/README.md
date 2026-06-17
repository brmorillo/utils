# LazyLoader

`LazyLoader<T>` defers the creation of an expensive value until the first time it is actually needed, then caches it for every subsequent access. Useful for singletons, heavy clients, or anything you do not want to build at module-load time.

```javascript
import { LazyLoader } from '@brmorillo/utils';

const loader = new LazyLoader(() => createExpensiveClient());

// Nothing has been created yet
loader.isLoaded(); // false

const client = loader.get(); // created here, on first access
const same = loader.get();   // same instance, no re-creation
loader.isLoaded(); // true
```

## Constructor

```ts
new LazyLoader<T>(factory: () => T)
```

`factory` is invoked at most once (per loaded state) to produce the value.

## Methods

### `get(): T`

Returns the cached instance, creating it via `factory` on the first call.

### `getAsync(): Promise<T>`

Asynchronous variant: awaits the `factory` (which may return a promise) and de-duplicates concurrent calls so the factory runs only once. If the factory rejects, the loader resets so a later call can retry.

```javascript
const loader = new LazyLoader(async () => fetchConfig());
const config = await loader.getAsync();
```

### `isLoaded(): boolean`

Returns `true` once the instance has been created.

### `reset(): void`

Clears the cached instance so the next `get`/`getAsync` rebuilds it.

## Notes

- Prefer either the synchronous `get()` or the asynchronous `getAsync()` for a given loader; mixing them on the same instance is not supported.
- For value caching with TTL/expiry (rather than a single lazily-built instance), see the [Cache](../cache/README.md) module.
