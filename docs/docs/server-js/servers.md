# Servers

These servers will expose the [models](/docs/server-js/models) over the network in one of the two protocols, according to the [Rise API definition](/docs/server-spec)

> Note: This document is a WIP. Your [contributions](/docs/contributors) to the docs would be greatly appreciated!

For an example server, see the [demo server](https://github.com/rise-tools/rise-tools/blob/main/example/demo/src/index.ts) we use for developing Rise Tools.


## WebSocket Server

```tsx
import { createWSServer } from '@rise-tools/server'

// to launch your server:

await createWSServer(models, 3005)
```

## HTTP Server

```tsx
import { createHTTPServer } from '@rise-tools/server'

// to launch your server:

await createHTTPServer(models, 8080)

```

> The HTTP server is not fully implemented. It is currently missing the POST handling for events. Your help would be appreciated in the implementation and testing of it!

## Combined Server

> To be implemented: A server which provides the models over the network in both HTTP and WS protocols.