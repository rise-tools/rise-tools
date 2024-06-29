# Websockets

Once you form a WebSocket connection to a server, JSON objects will be passed between them. Every message in either direction will have a `$` key to specify the purpose of the message.

Here we define the specifications of these messages:


## Messages from the Client

### `sub` - Subscribe to Model(s)

A subscription requests the server to send the current value for these model paths, and continue to send new values until the `unsub` message is sent.

- `$: "sub"`
- `keys: string[]` - The model paths to subscribe to

### `unsub` - Unsubscribe from Model(s)

The user no longer to see these values. This requests the server to cease additional updates for these model paths

- `$: "unsub"`
- `keys: string[]` - The model paths to unsubscribe to

### `evt` - Event

The component has called an [event definition](/docs/server-spec/json-types#event-model-state) and the client is reporting it to the server. This message conforms exactly to the [event request definition](/docs/server-spec/json-types#event-request-payload)

- `$: "evt"`
- `key: string` - A unique identifier for this event, as determined by the client
- `event: {` - object of event details, containing the following keys:
    - `dataState: JSONValue` - the [event definition](/docs/server-spec/json-types#event-model-state)
    - `payload: JSONValue` - the data coming from the component
    - `target: {` - object detailing the source of the event, containing:
        - `key?: string`
        - `component: string`
        - `propKey: string`
        - `path: (string|number)[]`

## Messages from the Server

### `up` - Model Value Update

The model value has changed or a subscription has begun. This event sends the current state of a model from the server to the client

- `$: "up"`
- `key: string` - The model path that has changed or is being provided
- `val: JSONValue` - The JSON value of the model

### `evt-res` - Respond to an Event

The server is replying to an event that previously came from the client. This allows the client to resolve an async handler that is passed into the client component.

- `$: "evt-res"`
- `key: string` - The `key` of the `$:evt` that was sent to the server
- `res: {` - Object detailing the response
    - `$: 'response'`
    - `error?: boolean` - If this is an error that should be thrown, or a valid response
    - `payload?: JSONValue` - Data sent by the server function
    - `actions?: ActionModelState[]` - Actions that the client should call as a result of this server-handled event

> Note: the res field seems redundant and these fields should probably be flattened out into `evt-res`