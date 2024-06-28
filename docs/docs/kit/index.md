# Rise Kit

We provide the "Rise Kit" library of components that are ready to use in your application. You can always [bring your own custom components](/docs/guides/custom-components) to Rise.


## Kit Packages

You may import individual kit packages for different functionality. To provide flexibility for your server, you can use all of these:

- [Kit](rise-kit.md) - High-level components such as List and Sheets
- [Tamagui](./tamagui) - Delivers the functionality from the excellent [Tamagui](https://tamagui.dev/) component system.
- [Forms](./forms) - Rise form toolkit powered by Tamagui
- [Haptics](./haptics) - Haptic vibration actions powered by [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- [Linking](./linking) - [React Native Linking](https://reactnative.dev/docs/linking) to the browser or settings app
- [Lucide Icons](./lucide-icons) - Use any icons from the [Lucide Icon Pack](https://lucide.dev) in your server components
- [SVG](./svg) - Render custom SVGs from your server
- [QRCode](./qrcode) - Render QRCodes in your app
- [Tamagui Toast](./tamagui-toast) - Toast UI by [Tamagui](https://tamagui.dev/ui/toast/)

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
  SVGComponents,
  TamaguiComponents,
  useHapticsActions,
  useLinkingActions,
  useToastActions,
} from '@rise-tools/kitchen-sink'

const components = {
  ...TamaguiComponents,
  ...RiseComponents,
  ...FormComponents,
  ...SVGComponents,
  ...LucideIconsComponents,
  ...QRCodeComponents,
}

// when you render your client entry point component:

<Rise
    components={components}
    actions={{
        ...useToastActions(),
        ...useHapticsActions(),
        ...useLinkingActions(),
    }}
    modelSource={...}
/>
```
