# Rise Kit

## @rise-tools/kit

This package exports the whole kit

```sh
npm install @rise-tools/kit
```

```tsx
import haptics from '@rise-tools/kit-haptics'
import expoRouter from '@rise-tools/kit-expo-router'
import tamagui from '@rise-tools/kit-tamagui'
import toast from '@rise-tools/kit-toast'

<Rise
    components={{
        ...tamagui.components,
        ...expoRouter.components,
    }}
    actions={{
        ...haptics.actions,
        ...expoRouter.actions,
        ...toast.actions,
    }}
/>
```

### Tamagui

### Expo Router

### Toast

### Haptics

