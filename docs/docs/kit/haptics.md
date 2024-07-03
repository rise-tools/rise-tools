# kit-haptics

Built on the [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) library, these actions allow you to provide immediate tacticle feedback to users when they interact with your components.

## Client Installation

```sh
npm install @rise-tools/kit-haptics expo-haptics
```

Provide the actions to your `<Rise>` component:

```tsx
import { useHapticsActions } from '@rise-tools/kit-haptics'

// when you render the Rise component:
<Rise
    actions={{
        ...useHapticsActions(),
    }}
    ...
/>
```

## Server Helpers

Use this helper to generate type-safe haptic actions from your server.

`import { haptics } from '@rise-tools/kit-haptics/server'`

In an example button handler:

```tsx
<Button
    onPress={haptics('impact', 'heavy')}
>
    Impactful Choice
</Button>
```

### `haptics()`

Shorthand for `haptics('impact')`

### `haptics('impact', type: 'heavy' | 'light' | 'medium' | 'rigid' | 'soft' = 'medium')`

Use this action to provide haptic feedback for physical impact. Type is optional and defaults to `medium`.

### `haptics('notification', type: 'success' | 'failure' | 'error' = 'success')`

Use this action to provide haptic feedback for success, failure, and warning. Type is optional and defaults to `success`.

### `haptics('selection')`

Use this action to let user know when a selection change has been registered.

## JSON Actions

Use these JSON definitions if you are building your own server:

### `impact`

```js
{
    $: 'action',
    name: 'rise-tools/kit-haptics/impact',
    style: 'medium' // default
}
```

Impact Styles: `'heavy' | 'light' | 'medium' | 'rigid' | 'soft'`

### `notification`

```js
{
    $: 'action',
    name: 'rise-tools/kit-haptics/notification',
    type: 'success' // default
}
```

Notification Types: `'success' | 'failure' | 'error'`

### `selection`

```js
{
    $: 'action',
    name: 'rise-tools/kit-haptics/selection',
}
```
