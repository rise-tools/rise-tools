# Rise Kit

We provide the "Rise Kit" library of components that are ready to use in your application. You can always [bring your own custom components](/docs/guides/custom-components) to Rise.


## Kit Packages

You may import individual kit packages for different functionality. To provide flexibility for your server, you can use all of these:

- [Kit](/docs/kit/rise-kit) - High-level components such as List and Sheets
- [Tamagui](/docs/kit/tamagui) - Delivers the functionality from the excellent [Tamagui](https://tamagui.dev/) component system.
- [Forms](/docs/kit/forms) - Rise form toolkit powered by Tamagui
- [Haptics](/docs/kit/haptics) - Haptic vibration actions powered by [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- [Linking](/docs/kit/linking) - [React Native Linking](https://reactnative.dev/docs/linking) to the browser or settings app
- [Lucide Icons](/docs/kit/lucide-icons) - Use any icons from the [Lucide Icon Pack](https://lucide.dev) in your server components
- [SVG](/docs/kit/svg) - Render custom SVGs from your server
- [QRCode](/docs/kit/qrcode) - Render QRCodes in your app
- [Tamagui Toast](/docs/kit/tamagui-toast) - Toast UI by [Tamagui](https://tamagui.dev/ui/toast/)

We also support navigation utility packages to help you navigate between screens in your app. You will only need one of:

- [React Navigation](./react-navigation)
- [Expo Router](./expo-router)

## @rise-tools/kitchen-sink

This package is here for your convenience to help you get started quickly with most of the Kit packages. The navigation packages are not included.

```sh
npm install @rise-tools/kitchen-sink
```

```tsx
import {
  FormComponents,
  LucideIconsComponents,
  QRCodeComponents,
  RiseComponents,
  SVGComponents,
  TamaguiComponents,
  WebViewComponents,
  useHapticsActions,
  useLinkingActions,
  useToastActions,
} from '@rise-tools/kitchen-sink'

const components = {
  ...FormComponents,
  ...LucideIconsComponents,
  ...QRCodeComponents,
  ...RiseComponents,
  ...SVGComponents,
  ...TamaguiComponents,
  ...WebViewComponents,
}

// when you render your client entry point component:

<Rise
    components={components}
    actions={{
        ...useHapticsActions(),
        ...useLinkingActions(),
        ...useToastActions(),
    }}
    modelSource={...}
/>
```
