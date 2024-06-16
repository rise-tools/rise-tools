# Server API Spec

This section defines our protocol for sending rendering information from the server to the client `<Rise />` component.

You can use this specification to build a custom server in any language which will provide the definitions for client rendering.

### HTTP Servers

See our [REST JSON API](./http) to specify your components with a regular HTTP server.

### Websocket Servers

For "live" applications you can use the [Websocket API](./ws), which will result in state updates being sent to the client UI as they happen.

### JSON Spec

See the JSON types that are shared between both protocols.

### Suggest Future Server Implementations

We may be supporting additional server languages in the future. Upvote your preferred lanugage in our Github discussions page:

- [PHP](https://github.com/rise-tools/rise-tools/discussions/100)
- [Go](https://github.com/rise-tools/rise-tools/discussions/101)

You are welcome to start an additional discussion to suggest your server language of choice. Collect as many upvotes as you can so we can see what is in demand!
