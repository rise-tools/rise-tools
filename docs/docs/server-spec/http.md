# HTTP

> Note: The reference implementation has mostly favored the WebSocket API, and therefore the HTTP API is rough and requires further design work. It is not yet production-ready

## GET request

Respond to a specific model path with the current state of that model.

### Request

- `path` - The model path is used in the http request to specify the model of request

### Response

Server responds with the full JSON value of the model. (Internally, the JS HTTP server calls `.load()` on the model that is being requested.)

> Note: We may eventually utilize additional headers to specify what the cache and invalidation policy is for this model.

## POST

Used to send [events](/docs/server-spec/json-types#event-model-state) to the server when they are sent as a result of a client component prop callback.

### Request

- `path` - not used because it is contained in the event request payload. You can send a POST request to any subpath of the HTTP server
- `body` - The full [event request payload](/docs/server-spec/json-types#event-request-payload)


### Response

The server responds with the [event response payload](/docs/server-spec/json-types#event-response-payload)

> Note: The HTTP server may mutate some values that are being used on the client, and ideally it would contain metadata that updates those values or identifies them so they can be re-fetched from the client. This is a bit tricky from the server implementation perspective, but the API specification should be expanded to cover this.