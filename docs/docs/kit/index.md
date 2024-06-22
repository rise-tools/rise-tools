# Rise Kit

## @rise-tools/kitchen-sink

This package exports the whole kit

```sh
npm install @rise-tools/kitchen-sink
```

```tsx
import tamagui from '@rise-tools/kit-tamagui'

import useHapticsActions from '@rise-tools/kit-haptics'
import useExpoRouterActions from '@rise-tools/kit-expo-router'
import useToastActions from '@rise-tools/kit-toast'
import useToastActions from '@rise-tools/kit-linking'

<Rise
    components={{
        ...tamagui.components,
        ...expoRouter.components,
    }}
    actions={{
        ...useExpoRouterActions(),
        ...useToastActions(),
        ...useHapticsActions(),
        ...useLinkingActions()
    }}
/>
```

### Kit

### Tamagui

### Expo Router

### Toast

### Haptics

### Forms

### Linking

### Lucide Icons

### QR Code

