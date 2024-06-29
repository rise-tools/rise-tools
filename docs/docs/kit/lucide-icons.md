# kit-lucide-icons

Building on Tamagui and [Lucide Icons](https://lucide.dev/), use this icon pack for your server-defined components.

Browse the [available icons here](https://tamagui.dev/ui/lucide-icons).

## Client Installation

```sh 
npm install @rise-tools/kit-lucide-icons @tamagui/lucide-icons react-native-svg
```

You must also configure `react-native-svg` in your project. If you're using Expo, run:

```sh
npx expo install react-native-svg
```

We reccomend setting up `@rise-tools/kit-svg` and `@rise-tools/kit-tamagui` before installing this package.

In the `<Rise>` client, include the QRCode component:

```tsx
import { LucideIconsComponents } from '@rise-tools/kit-lucide-icons'

// when rendering <Rise>

<Rise
    components={{
        ...LucideIconsComponents
    }}
    ...
/>
```

## Server Helper

`import { LucideIcon } from '@rise-tools/kit-lucide-icons`

Then you can render the component from your server models:

```tsx
<LucideIcon icon="flame" size={36} />
```

TypeScript will hint the available props for you here.

## Component Props

- `size`
- `strokeWidth`
- `color`

The `LucideIcon` component comes from Tamagui, so all of the standard Tamagui props are available, including [color and size tokens](https://tamagui.dev/docs/core/tokens).

## JSON Component

Your custom server may define the Icon component by using the [component definition](/docs/server-spec/json-types#component):

```js
{
    $: 'component',
    component: 'rise-tools/kit-lucide-icons/Icon',
    props: {
        name: 'flame',
        color: '$color9'
        size: '$4'
    }
}
```
