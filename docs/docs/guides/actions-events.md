# Actions and Events

For each prop that accepts a callback/function, you can pass an action, array of actions, or an event that will be sent to the server.

When the server responds, it may use the `response()` helper to send one or more actions to the client that will be executed as a follow-up behavior to the server-side event.

## Actions

### Single Action

```tsx
import { goBack } from "@rise-tools/kit-expo-router"

function UI() {
  return (
    <Button
      onPress={goBack()}
    >
      Go back
    </Button>
  )
}
```

### Multiple Actions


```tsx
import { goBack } from "@rise-tools/kit-expo-router"
import { haptics } from "@rise-tools/kit-haptics"

function UI() {
  return (
    <Button
      onPress={[goBack(), haptics()]}
    >
      Go back with a vibrate effect
    </Button>
  )
}
```

## Events

### Executing function on the server

```tsx
function UI() {
  return (
    <Button
      onPress={() => console.log('This always runs on the server')}
    >
      Go back
    </Button>
  )
}
```

When you pass a function as a prop, we wrap it with `event()` automatically.
So the above example is equivalent to:

```tsx
function UI() {
  return (
    <Button
      onPress={event(() => console.log('This always runs on the server'))}
    >
      Go back
    </Button>
  )
}
```


### Passing additional options

This allows a custom timeout where the client will throw an error locally if it does not recieve a response from the server in the specified number of milliseconds.

```tsx
function UI() {
  return (
    <Button
      onPress={event(() => /* slow server behavior */, { timeout: 5000 })}
    >
      Go back
    </Button>
  )
}
```

### Executing an action and a function on the server

The following example will execute remote function on the server and execute provided actions, without waiting for the server response:

```tsx
import { goBack } from "@rise-tools/kit-expo-router"

function UI() {
  return (
    <Button
      onPress={event(() => /* redacted */, { actions: [goBack()] })}
    >
      Go back
    </Button>
  )
}
```

## Responding to events

### Return payload

You can return an arbitrary JSON value from an event handler. This value will be sent back to the client. From client components, you can await the callback to see the response sent from the server. 

<table>
<thead>
<tr>
<th>Server</th>
<th>Client</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
function UI() {
  return (
    <Form
      onSubmit={() => {
        // this function may be async but it does not need to be.
        return { message: 'Thank you!' }
      }}
    />
  )
}
```

</td>
<td>

```tsx
function Form({ onSubmit }) {
  const [isPending, setIsPending] = useState(false)
  const handleSubmit = async () => {
    setIsPending(true)
    // this onSubmit handler is always async because it has to go to the server.
    const { message } = await onSubmit()
    setIsPending(false)
    alert(message)
  }
  return (
    <Button onPress={handleSubmit} disabled={isPending}>
      {isPending ? <ActivityIndicator /> : "Submit"}
    </Button>
  )
}
```

</td>
</tr>
</tbody>
</table>

### Event Responds with Action

You can also execute an action in response to an event:

```tsx
import { goBack } from "@rise-tools/kit-expo-router"

function UI() {
  return (
    <Form
      onSubmit={() => {
        return response(goBack())
      }}
    />
  )
}
```

This will navigate back after the form is submitted and sucesfully processed by the server.

### Event Responds with Actions

You can also execute multiple actions in response to an event:

```tsx
import { goBack } from "@rise-tools/kit-expo-router"
import { haptics } from "@rise-tools/kit-haptics"

function UI() {
  return (
    <Form
      onSubmit={() => {
        return response([
          goBack(),
          haptics()
        ])
      }}
    />
  )
}
```

### Return payload and actions together

You can return a payload and actions together:

```tsx
import { goBack } from "@rise-tools/kit-expo-router"
import { response } from "@rise-tools/react"

function UI() {
  return (
    <Form
      onSubmit={() => {
        return response({
          message: 'Thank you for submitting the form'
        }, {
          actions: [goBack()]
        })
      }}
    />
  )
}
```

When the event handler gets back to the client, it the message will be visible from `await props.onSubmit()`, and the `goBack` navigation action will be triggered, moving the user to the previous route.