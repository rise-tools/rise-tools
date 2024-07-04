---
description: How to build a custom modelSource
---

# Custom Model Sources


The template uses "stores" of data to decide what UI to render. Rise is entirely network-agnostic, but it includes clients such as `createWSModelSource` and `createHTTPModelSource`.

## Model Source

The `modelSource` is an object with one mandatory function to returns a "store" for a given path. If no `path` prop was provided to the `<Rise>`, the root path of "" (empty string) will be used to query for the UI data.

```ts
type ModelSource = {
  get: (key: string) => Store
  sendEvent: (event: HandlerEvent) => Promise<EventResponse>
}
```

The event sent into `sendEvent` should conform to the [Event Request Payload](/docs/server-spec/json-types#event-request-payload).

## Store

A Store allows the template to get and subscribe to data changes:

```ts
export type Store<V = unknown> = {
  get: () => V
  subscribe: (handler: () => void) => () => void
}
```
