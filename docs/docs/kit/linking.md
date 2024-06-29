# kit-linking

Link to external browsers and the settings app. Uses [React Native's Linking](https://reactnative.dev/docs/linking).

## Client Installation

```sh
npm install @rise-tools/kit-linking
```

Provide the actions to your `<Rise>` component:

```tsx
import { useLinkingActions } from '@rise-tools/kit-linking'

// when you render the Rise component:
<Rise
    actions={{
        ...useLinkingActions(),
    }}
    ...
/>
```

## Server Helpers

Use these helpers to generate type safe actions from your server.

`import { openURL, openSettings } from '@rise-tools/kit-linking/server'`

As an example button handler

```tsx
<Button
    onPress={openURL('impact', 'heavy')}
>
    See the docs!
</Button>
```

- `openURL(url: string)`
- `openSettings`

### `openURL(url: string)`

Opens the URL in the default browser for that device, or opens another app with the appropriate protocol.

See the cross-platform [Built-in URL Schemes](https://reactnative.dev/docs/linking#built-in-url-schemes).

### `openSettings()`

Opens the settings app to the app's settings page

## JSON Actions

Use these JSON definitions if you are building your own server:

### `openURL`

```js
{
    $: 'action',
    name: 'rise-tools/kit-linking/openURL',
    url: 'https://rise.tools'
}
```

### `openSettings`

```js
{
    $: 'action',
    name: 'rise-tools/kit-linking/openSettings'
}
```

