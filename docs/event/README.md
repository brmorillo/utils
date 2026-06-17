# EventUtils

The EventUtils class provides a factory for creating type-safe `EventEmitter` instances that implement the observer (publish/subscribe) pattern.

## Basic Usage

```javascript
import { EventUtils } from '@brmorillo/utils';

// Create an emitter instance
const emitter = EventUtils.createEmitter();

// Subscribe to an event; returns an unsubscribe function
const unsubscribe = emitter.on('userLoggedIn', (user) => {
  console.log(`User logged in: ${user.name}`);
});

// Emit an event
emitter.emit('userLoggedIn', { id: 1, name: 'John' });

// Unsubscribe later
unsubscribe();
```

## Methods

### createEmitter()

Creates and returns a new `EventEmitter` instance.

```javascript
const emitter = EventUtils.createEmitter();
```

## EventEmitter instance methods

`createEmitter()` returns an `EventEmitter` instance with the following methods.

### emitter.on(eventName, handler)

Subscribes `handler` to `eventName`. Returns an unsubscribe function.

```javascript
const unsubscribe = emitter.on('dataLoaded', (data) => {
  console.log('Data loaded:', data);
});

unsubscribe(); // stop listening
```

### emitter.once(eventName, handler)

Subscribes `handler` to `eventName` and automatically unsubscribes after the first time it fires. Returns an unsubscribe function.

```javascript
emitter.once('serverResponse', (response) => {
  console.log('Response received:', response);
});
```

### emitter.off(eventName, handler)

Unsubscribes a specific `handler` from `eventName`.

```javascript
function handleDataLoaded(data) { /* ... */ }
emitter.on('dataLoaded', handleDataLoaded);
emitter.off('dataLoaded', handleDataLoaded);
```

### emitter.emit(eventName, data)

Emits `eventName`, invoking all subscribed handlers with `data`. Errors thrown by handlers are caught and logged, so one failing handler does not stop the others.

```javascript
emitter.emit('userLoggedIn', { id: 1, name: 'John' });
```

### emitter.hasListeners(eventName)

Returns `true` if the event has at least one subscriber, otherwise `false`.

```javascript
if (emitter.hasListeners('dataLoaded')) {
  console.log('Someone is listening');
}
```

### emitter.listenerCount(eventName)

Returns the number of subscribers for an event.

```javascript
const count = emitter.listenerCount('dataLoaded');
console.log(`${count} listeners`);
```

### emitter.eventNames()

Returns an array of all event names that currently have subscribers.

```javascript
console.log(emitter.eventNames()); // ['dataLoaded', 'userLoggedIn']
```

### emitter.removeAllListeners(eventName)

Removes all listeners. If `eventName` is provided, only listeners for that event are removed; otherwise all listeners for all events are removed.

```javascript
emitter.removeAllListeners('dataLoaded'); // one event
emitter.removeAllListeners();             // all events
```
