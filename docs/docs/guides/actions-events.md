# Actions and Events

For each prop that accepts a function, you can pass an action or an event.

[TBD - explain how/why we automatically allow action, event or action[] to each component that accepts a function] 

## Actions

### Executing an action

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

### Executing multiple actions

```tsx
import { goBack } from "@rise-tools/kit-expo-router"
import { haptics } from "@rise-tools/kit-haptics"

function UI() {
  return (
    <Button
      onPress={[goBack(), haptics()]}
    >
      Go back
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

Note: the above example is equivalent to:

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

When you pass a function as a prop, we wrap it with `event()` automatically.

### Passing additional options

```tsx
function UI() {
  return (
    <Button
      onPress={event(() => /* redacted */, { timeout: 5000 })}
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

You can return an arbitrary JSON value from an event handler. This value will be sent back to the client. From client component, you can await the callback to read the response from the server. 

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

### Execute an action

You can also execute an action in response to an event:

```tsx
import { goBack } from "@rise-tools/kit-expo-router"

function UI() {
  return (
    <Form
      onSubmit={() => {
        return goBack()
      }}
    />
  )
}
```

This will navigate back after the form is submitted and sucesfully processed by the server.

### Execute multiple actions

You can also execute multiple actions in response to an event:

```tsx
import { goBack } from "@rise-tools/kit-expo-router"
import { haptics } from "@rise-tools/kit-haptics"

function UI() {
  return (
    <Form
      onSubmit={() => {
        return [
          goBack(),
          haptics()
        ]
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
