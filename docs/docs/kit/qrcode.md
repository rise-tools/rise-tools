# kit-qrcode

Render a QRCode in your app using the [React Native QRCode SVG library](https://www.npmjs.com/package/react-native-qrcode-svg).

## Client Installation

```sh
npm install @rise-tools/kit-qrcode react-native-qrcode-svg react-native-svg
```

You must also configure `react-native-svg` in your project. If you're using Expo, run:

```sh
npx expo install react-native-svg
```

If you have already configured `@rise-tools/kit-svg`, you can skip this step.


In the `<Rise>` client, include the QRCode component:

```tsx
import { QRCodeComponents } from '@rise-tools/kit-qrcode'

// when rendering <Rise>

<Rise
    components={{
        ...QRCodeComponents
    }}
    ...
/>
```


## Server Helper

`import { QRCode } from '@rise-tools/kit-qrcode`

Then you can render the component from your server models:

```tsx
<QRCode value="https://rise.tools" />
```

## Component Props

React Native QRCode SVG supports the following props:

```tsx
type Props = {
  /* what the qr code stands for */
  value?: string;
  /* the whole component size */
  size?: number;
  /* the color of the cell */
  color?: string;
  /* the color of the background */
  backgroundColor?: string;
  /* an image source object. example {uri: 'base64string'} or {require('pathToImage')} */
  logo?: ImageSourcePropType;
  /* logo size in pixels */
  logoSize?: number;
  /* the logo gets a filled rectangular background with this color. Use 'transparent'
         if your logo already has its own backdrop. Default = same as backgroundColor */
  logoBackgroundColor?: string;
  /* logo's distance to its wrapper */
  logoMargin?: number;
  /* the border-radius of logo image */
  logoBorderRadius?: number;
  /* quiet zone in pixels */
  quietZone?: number;
  /* enable linear gradient effect */
  enableLinearGradient?: boolean;
  /* linear gradient direction */
  gradientDirection?: string[];
  /* linear gradient color */
  linearGradient?: string[];
  /* get svg ref for further usage */
  getRef?: (c: any) => any;
  /* error correction level */
  ecl?: "L" | "M" | "Q" | "H";
  /* error handler called when matrix fails to generate */
  onError?: Function;
}
```

## JSON Component

Your custom server may define the QRCode component by using the [component definition](/docs/server-spec/json-types#component):

```js
{
    $: 'component',
    component: 'rise-tools/kit-qrcode/QRCode',
    props: {
        value: 'https://rise.tools'
    }
}
```
