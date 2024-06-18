# @rise-tools/kit-haptics

```sh
npm install @rise-tools/kit-haptics expo-haptics
```

## Actions

- `haptics()`

Shorthand for `haptics('impact')`

- `haptics('impact', type: 'heavy' | 'light' | 'medium' | 'rigid' | 'soft' = 'medium')`

Use this action to provide haptic feedback for physical impact. Type is optional and defaults to `medium`.

- `haptics('notification', type: 'success' | 'failure' | 'error' = 'success')`

Use this action to provide haptic feedback for success, failure, and warning. Type is optional and defaults to `success`.

- `haptics('selection')`

Use this action to let user know when a selection change has been registered.

---

Check [expo-haptics](Check https://docs.expo.dev/versions/latest/sdk/haptics/) documentation for more.
