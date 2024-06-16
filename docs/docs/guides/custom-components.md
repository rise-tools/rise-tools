---
description: How to define custom client components
---


# Custom Components


The components are an object that you pass to the template. Your library could be defined as:

```ts
import { View, Text } from 'react-native'

const components = {
  View: { component: View },
  Text: { component: Text },
}
```

Each component definition may also have a `validator` which is a function that accepts the props from the model and returns the props if they are valid. If they are invalid, an error is thrown. This is in place to prevent crashes in situations where invalid props are passed into your components.
