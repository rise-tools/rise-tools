---
description: How to build a custom modelSource
---

# Custom Models


The template uses "stores" of data to decide what UI to render. RNT is entirely network-agnostic, but it is designed for realtime scenarios where your server can push updates to the UI.

The `model` is an object with one mandatory function to returns a store for a given path. If no `path` prop was provided to the `<Rise>`, the root path of "" (empty string) will be used to query for the UI data.

```ts
type ModelSource = {
  get: (key: string) => Store
  sendEvent: (event: HandlerEvent) => Promise<ResponseModelState>
}
```

A Store allows the template to get and subscribe to data changes:

```ts
export type Store<V = unknown> = {
  get: () => V
  subscribe: (handler: () => void) => () => void
}
```
