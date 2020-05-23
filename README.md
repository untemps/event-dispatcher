# @untemps/event-dispatcher

Abstract class that allows to internally dispatch events and attach subscribers to listen for them.

## Installation

```bash
yarn add @untemps/event-dispatcher
```

## Usage

Import `EventDispatcher`:

```javascript
import { EventDispatcher } from '@untemps/event-dispatcher'
```

Create a class that extends `EventDispatcher`:

```javascript
class Foo extends EventDispatcher {
	constructor() {
		super()
	}

	foo() {
		this.dispatchEvent(new Event('foo', { bubbles: false, cancelable: false, composed: false }))
	}
}
```

Each instance can now attach a subscriber to listen for events:

```javascript
const onFoo = (event) => console.log('foo has be triggered!')
const myFoo = new Foo()
myFoo.addEventListener('foo', onFoo)
```

And detach it:

```javascript
myFoo.removeEventListener('foo', onFoo)
```

All subscriptions for a specific event type can be detached in batches:

```javascript
const myFoo = new Foo()
myFoo.addEventListener('foo', onFoo1)
myFoo.addEventListener('foo', onFoo2)
myFoo.clearType('somethingDone')
```

All instance subscriptions can be detached in batches:

```javascript
const myFoo = new Foo()
myFoo.addEventListener('foo', onFoo)
myFoo.addEventListener('bar', onBar)
myFoo.cleanup()
```

## Todos

-   Publish package to npm
-   Add examples
-   Rewrite with TypeScript
