# kit-webview

Render web content, powered by the excellent [react-native-webview](https://github.com/react-native-webview/react-native-webview). Learn more about the WebView features on the [rn-webview documentation](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#react-native-webview-guide)

## Client Installation

```sh
npm install @rise-tools/kit-webview react-native-webview
```

You must set up `react-native-webview` in your project. If you're using Expo, run:

```sh
npx expo install react-native-webview
```

In the `<Rise>` client, include the components:

```tsx
import { WebViewComponents } from '@rise-tools/kit-webview'

// when rendering <Rise>

<Rise
    components={{
        ...WebViewComponents
    }}
    ...
/>
```

## Server Helpers

`import * from '@rise-tools/kit-webview/server`

Then you can render SVG elements as such from your server:

```tsx
const MyWebExample = () => (
    <WebView url="https://rise.tools" >
)
```

## JSON Components

Your custom server may provide the raw WebView components by using the [component definitions](/docs/server-spec/json-types#component-model-state):

```js
{
    $: 'component',
    component: 'rise-tools/kit-webview/WebView',
    props: {
        url: 'https://rise.tools'
    }
}
```
