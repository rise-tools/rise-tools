# kit-tamagui-toast

Your server-defined components can show toasts to the user with [Tamagui's Toast Components](https://tamagui.dev/ui/toast) and [Burnt](https://github.com/nandorojo/burnt).

## Client Installation

First, install [kit-tamagui](/docs/kit/tamagui). Then:

```sh
npm install @rise-tools/kit-tamagui-toast @tamagui/toast burnt
```

In the `<Rise>` client, include the toast actions:

```tsx
import { useToastActions } from '@rise-tools/kit-tamagui-toast'

// when rendering <Rise>

<Rise
    actions={{
        ...useToastActions()
    }}
    ...
/>
```

Tamagui Toasts require a provider, which can be [configured according to the docs](https://tamagui.dev/ui/toast), or you can wrap your app with our built-in `ToastProvider` component:

```tsx
import { ToastProvider } from '@rise-tools/kit-tamagui-toast'

function App() {
    return (
        <ToastProvider>
            {...}
        </ToastProvider>
    )
}
```


## Server Helpers

Use this helper to generate type-safe toast actions from your server.

`import { toast } from '@rise-tools/kit-tamagui-toast/server'`

In an example button handler:

```tsx
<Button
    onPress={toast('You did it!', 'Well Done', 2000)}
>
    Do It.
</Button>
```

### `toast(title: string, message?: string, duration?: number)`

## JSON Action

Your custom server may provide the toast action by using the [action definitions](/docs/server-spec/json-types#action-model-state):

```ts
{
    $: 'action',
    action: 'rise-tools/kit-tamagui-toast/toast',
    title: 'Toast Title',
    message: 'Additional Text to display', // optional
    duration: 4000, // optional
}
```