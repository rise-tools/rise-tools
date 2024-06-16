# Rise Kit

## @rise-tools/kit

This package exports the whole kit

```sh
npm install @rise-tools/kit
```

```tsx
import tamagui from '@rise-tools/kit-tamagui'

import useHapticsActions from '@rise-tools/kit-haptics'
import useExpoRouterActions from '@rise-tools/kit-expo-router'
import useToastActions from '@rise-tools/kit-toast'

<Rise
    components={{
        ...tamagui.components,
        ...expoRouter.components,
    }}
    actions={{
        ....useExpoRouterActions(),
        ...useToastActions(),
        ...useHapticsActions(),
    }}
/>
```

### Tamagui

### Expo Router

### Toast

### Haptics

