# kit-svg

Provides vector graphics abilities to your server-defined UI, powered by [Software Mansion's React Native SVG](https://github.com/software-mansion/react-native-svg).

To get an understanding of capabilities of RNSVG, check out the [usage documentation](https://github.com/software-mansion/react-native-svg/blob/main/USAGE.md).

## Client Installation

```sh
npm install @rise-tools/kit-svg react-native-svg
```

You must set up `react-native-svg` in your project. If you're using Expo, run:

```sh
npx expo install react-native-svg
```

In the `<Rise>` client, include the SVG components:

```tsx
import { SVGComponents } from '@rise-tools/kit-svg'

// when rendering <Rise>

<Rise
    components={{
        ...SVGComponents
    }}
    ...
/>
```

## Server Helpers

`import * from '@rise-tools/kit-svg/server`

Then you can render SVG elements as such from your server:

```tsx
const MyIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24">
        <Rect width="24" height="24" fill="white" />
        <Circle width="12" height="12" fill="blue" />
    </Svg>
)
```

See the [SVG example server](https://github.com/rise-tools/rise-tools/blob/main/example/demo/src/ui-controls/ui.tsx) code.

For the full list of SVG elements, see [ReactNativeSVG.ts](https://github.com/software-mansion/react-native-svg/blob/main/src/ReactNativeSVG.ts)

## JSON Components

Your custom server may provide the raw SVG components by using the [component definitions](/docs/server-spec/json-types#component):

```js
{
    $: 'component',
    component: 'rise-tools/kit-svg/Svg',
    props: {
        width: '24',
        height: '24',
        viewBox: '0 0 24 24'
    },
    children: [
        {
            $: 'component',
            component: 'rise-tools/kit-svg/Rect',
            props: { ... }
        }
    ]
}
```

The full list of SVG components are defined in the [`kit-svg` package](https://github.com/rise-tools/rise-tools/blob/main/packages/kit-svg/src/index.ts).