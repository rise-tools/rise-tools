# @rise-tools/server

Our reference implementation of a server that will provide UI/UX to your Rise client. If you want to build a custom server (or use a different language), see the [Rise Server Spec](/docs/server-spec).

All components that your server uses must be available on the client. For these examples we will assume you are using the [Rise Kit](/docs/kit), but you can apply these ideas to your own client components

Here is a simple example of a server which defines a counter component which uses a state and a view model. All users will see the same count.

> Note: This example uses the [experimental JSX feature](/docs/guides/jsx-setup). If you don't use JSX, your view will return the raw [Component JSON](/docs/server-spec/json-types#component).

```tsx
import {state, view} from '@rise-tools/server'

const [count, setCount] = state(0)

const incrementer = view(get => (
    <YStack>
        <Text>The count is {get(count)}</Text>
        <Button onPress={() => {
            setCount(c => c + 1)
        }}>
            Plus 1
        </Button>
    </YStack>
))

createWSServer({ incrementer }, 8888)

```

Your client component will be configured to refer to this server, with the appropriate "path" set:

```tsx
// Prepare the model source for this server
const modelSource = createWSModelSource('ws://localhost:8888')

// Render the View:
<Rise
    components={{ ...kitComponents }}
    modelSource={modelSource}
    path="incrementer"
/>
```

## Models

These logical elements can be composed to express the UI content in your server.

- [State](./models#state)
- [View](./models#view)
- [Query](./models#query)
- [Lookup](./models#lookup)

## Servers

We provide a HTTP server and a WebSocket server, plus a server which includes the functionality of both.

## Extended Examples

See our [example code on GitHub](https://github.com/rise-tools/rise-tools/blob/main/example/demo/src/index.ts) for a larger example of a server.

Here are the example UIs that have been implemented:

- [Delivery](https://github.com/rise-tools/rise-tools/blob/main/example/demo/src/delivery/ui.tsx)
- [Inventory](https://github.com/rise-tools/rise-tools/blob/main/example/demo/src/inventory/ui.tsx)
- [UI Controls](https://github.com/rise-tools/rise-tools/blob/main/example/demo/src/ui-controls/ui.tsx)